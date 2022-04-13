import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { EthTokenAddress } from '_types/EthTokenAddress';

const openseaOptions = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
  },
};

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
Moralis.start({ serverUrl, appId });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') res.status(400).end();
  const { walletAddresses, solCommunityIds, ethTokenAddresses } = JSON.parse(req.body);

  const solWalletAddresses: string[] = [];
  const ethWalletAddresses: string[] = [];

  walletAddresses.forEach((walletAddress: string) => {
    Web3.utils.isAddress(walletAddress)
      ? ethWalletAddresses.push(walletAddress)
      : solWalletAddresses.push(walletAddress);
  });

  const images: string[] = [];
  const imageRequests: any[] = [];

  // Eth
  ethWalletAddresses.forEach(async (walletAddress: string) => {
    // Eth in Wallet
    imageRequests.push(async () => {
      const imagesArray = await getEthImagesOwnedByWalletViaOpensea(walletAddress, ethTokenAddresses);
      imagesArray.forEach((image) => !images.includes(image) && images.push(image));
    });
    // Eth Staked
    ethTokenAddresses.forEach((tokenAddress: EthTokenAddress) => {
      if (!tokenAddress.stakingAddress) return;
      imageRequests.push(async () => {
        const imagesArray = await getEthStakedImagesViaOpensea(walletAddress, tokenAddress);
        images.push(...imagesArray);
      });
    });
  });

  // Sol Staked
  imageRequests.push(async () => {
    const stakedTokenAddresses: string[] = await (
      await fetch(
        'https://us-central1-staked-api.cloudfunctions.net/getStakedTokenAddressesFromCommunityIDsAndWalletAddresses',
        {
          method: 'POST',
          body: JSON.stringify({ communityIds: solCommunityIds, walletAddresses: solWalletAddresses }),
        }
      )
    ).json();

    await Promise.all(
      stakedTokenAddresses.map(async (stakedTokenAddress) => {
        return getSolImageByTokenAddress(stakedTokenAddress).then((image) => images.push(image));
      })
    );
  });
  // Sol in Wallet
  imageRequests.push(async () => {
    const solTokenAddresses: string[] = await (
      await fetch('https://us-central1-staked-api.cloudfunctions.net/getTokenAddressesFromCommunityIDs', {
        method: 'POST',
        body: JSON.stringify({ communityIds: solCommunityIds }),
      })
    ).json();
    await Promise.all(
      solWalletAddresses.map(async (walletAddress) => {
        return getSolImagesOwnedByWallet(walletAddress, solTokenAddresses).then((imagesArray) =>
          images.push(...imagesArray)
        );
      })
    );
  });

  await Promise.all(imageRequests.map((fn) => fn()));
  res.status(200).json(images);
};

const getEthImagesOwnedByWalletViaOpensea = async (
  walletAddress: string,
  ethTokenAddresses: EthTokenAddress[]
): Promise<string[]> => {
  const images: string[] = [];
  let apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    walletAddress +
    '&order_by=pk&order_direction=desc' +
    '&asset_contract_addresses=' +
    ethTokenAddresses.map((elem) => elem.tokenAddress).join('&asset_contract_addresses=') +
    '&limit=50&include_orders=false';
  let nftsInWallet;
  do {
    nftsInWallet = await (await fetch(apiUrl, openseaOptions)).json();
    if (!nftsInWallet.assets) break;
    nftsInWallet.assets.forEach((nft: any) => images.push(nft.image_url));
    apiUrl += '&cursor=' + nftsInWallet.next;
  } while (nftsInWallet.next);
  return images;
};

const getEthStakedImagesViaOpensea = async (
  walletAddress: string,
  ethTokenAddress: EthTokenAddress
): Promise<string[]> => {
  const userTransfersOfNft = await getEthTransfersOfTokenByWallet(walletAddress, ethTokenAddress.tokenAddress);
  if (!userTransfersOfNft.forEach) return []; // If rate limit, userTransfersOfNft is not an array.
  let stakedNFTIds: Set<string> = new Set();
  userTransfersOfNft.reverse().forEach((transfer: any) => {
    if (transfer.from === ethTokenAddress.stakingAddress && transfer.to === walletAddress) {
      stakedNFTIds.delete(transfer.tokenID);
    } else if (transfer.to === ethTokenAddress.stakingAddress && transfer.from === walletAddress) {
      stakedNFTIds.add(transfer.tokenID);
    }
  });
  if (!stakedNFTIds.size) return [];
  const images: string[] = [];
  let apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    ethTokenAddress.stakingAddress +
    '&order_by=pk&order_direction=desc' +
    '&asset_contract_address=' +
    ethTokenAddress.tokenAddress +
    '&token_ids=' +
    Array.from(stakedNFTIds.values()).join('&token_ids=') +
    '&limit=50';
  let nftsInWallet;
  do {
    nftsInWallet = await (await fetch(apiUrl, openseaOptions)).json();
    if (!nftsInWallet.assets) break;
    nftsInWallet.assets.forEach((nft: any) => images.push(nft.image_url));
    apiUrl += '&cursor=' + nftsInWallet.next;
  } while (nftsInWallet.next);
  return images;
};

const getEthTransfersOfTokenByWallet = async (walletAddress: string, tokenAddress: string) => {
  const apiUrl =
    'https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=' +
    tokenAddress +
    '&address=' +
    walletAddress +
    '&page=1&offset=10000&sort=desc&apikey=UU7BPMNMSJAP95U8JT7NN6HVD2ZTH7ZVHE';
  const response = await fetch(apiUrl);
  const transfers = await response.json();
  return transfers.result;
};

const getSolImagesOwnedByWallet = async (walletAddress: string, solTokenAddresses: string[]): Promise<string[]> => {
  const walletOptions = {
    network: 'mainnet' as 'mainnet',
    address: walletAddress,
  };
  const nftBalance = await Moralis.SolanaAPI.account.getNFTs(walletOptions);
  const ownedNFTTokenAddressesInCommunity: string[] = [];
  nftBalance.forEach((nft) => {
    solTokenAddresses.includes(nft.mint) && ownedNFTTokenAddressesInCommunity.push(nft.mint);
  });
  return Promise.all(
    ownedNFTTokenAddressesInCommunity.map(async (tokenAddress) => getSolImageByTokenAddress(tokenAddress))
  );
};

const getSolImageByTokenAddress = async (tokenAddress: string) => {
  const nftOptions = {
    network: 'mainnet' as 'mainnet',
    address: tokenAddress,
  };
  const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(nftOptions);
  return (await (await fetch(nftMetadata.metaplex.metadataUri)).json()).image;
};
