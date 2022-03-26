import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

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

// TODO:
// Could improve:
// instead of checking ownership in getSolImages,
// maybe check ownership at the beginning, same time as staked
// 1) find all the NFTs we want images for
// 2) get the images
// Also:
// It's unfortunate to do such an ugly nested for-loop for staked ETH NFTs.
// Could optimise by linking stakingAddresses to the corresponding tokenAddresses.
// Also:
// can do the staking stuff the first time you for-loop through walletAddresses
// In general, rate-limiting is an issue.
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') res.status(400).end();
  const { walletAddresses, tokenAddresses, stakingAddresses } = JSON.parse(req.body);
  const ethTokenAddresses: string[] = [];
  const solTokenAddresses: string[] = [];
  tokenAddresses.forEach((tokenAddress: string) =>
    Web3.utils.isAddress(tokenAddress) ? ethTokenAddresses.push(tokenAddress) : solTokenAddresses.push(tokenAddress)
  );
  const images: string[] = [];
  const imageRequests: Promise<void>[] = walletAddresses.map(async (walletAddress: string) =>
    Web3.utils.isAddress(walletAddress)
      ? (await getETHImagesViaOpensea(walletAddress, ethTokenAddresses)).forEach((image) => !images.includes(image) && images.push(image))
      : (await getSolImages(walletAddress, solTokenAddresses)).forEach((image) => !images.includes(image) && images.push(image))
  );
  stakingAddresses.forEach((stakingAddress: string) => {
    tokenAddresses.forEach((tokenAddress: string) => {
      walletAddresses.forEach((walletAddress: string) => {
        if (!Web3.utils.isAddress(walletAddress) || !Web3.utils.isAddress(tokenAddress)) return;
        const asyncFunc = getStakedEthImagesViaOpensea(walletAddress, tokenAddress, stakingAddress).then((imagesArray: string[]) => {
          images.push(...imagesArray);
        });
        return imageRequests.push(asyncFunc);
      });
    });
  });

  await Promise.all(imageRequests);
  res.status(200).json(images);
};

const getETHImagesViaOpensea = async (walletAddress: string, tokenAddresses: string[]): Promise<string[]> => {
  const images: string[] = [];
  let apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    walletAddress +
    '&order_by=pk&order_direction=desc' +
    '&asset_contract_addresses=' +
    tokenAddresses.join('&asset_contract_addresses=') +
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

const getSolImages = async (walletAddress: string, tokenAddresses: string[]): Promise<string[]> => {
  const walletOptions = {
    network: 'mainnet' as 'mainnet',
    address: walletAddress,
  };
  const nftBalance = await Moralis.SolanaAPI.account.getNFTs(walletOptions);
  const ownedNFTTokenAddressesInCommunity: string[] = [];
  nftBalance.forEach((nft) => {
    tokenAddresses.includes(nft.mint) && ownedNFTTokenAddressesInCommunity.push(nft.mint);
  });
  return Promise.all(
    ownedNFTTokenAddressesInCommunity.map(async (tokenAddress) => {
      const nftOptions = {
        network: 'mainnet' as 'mainnet',
        address: tokenAddress,
      };
      const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(nftOptions);
      return (await (await fetch(nftMetadata.metaplex.metadataUri)).json()).image;
    })
  );
};

// TODO:
// Could improve this via just push and remove.
const getStakedEthImagesViaOpensea = async (walletAddress: string, tokenAddress: string, stakingAddress: string): Promise<string[]> => {
  const userTransfersOfNft = await getNFTTransfers(walletAddress, tokenAddress);
  if (!userTransfersOfNft.forEach) return []; // If rate limit, userTransfersOfNft is not an array.
  let unstakedNftIds: string[] = [];
  let stakedNftIds: string[] = [];
  userTransfersOfNft.forEach((transfer: any) => {
    if (transfer.from === stakingAddress && transfer.to === walletAddress) {
      unstakedNftIds.push(transfer.tokenID);
    }
    if (transfer.to === stakingAddress && transfer.from === walletAddress && !unstakedNftIds.includes(transfer.tokenID)) {
      stakedNftIds.push(transfer.tokenID);
    }
  });
  if (!stakedNftIds) return [];
  const images: string[] = [];
  let apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    stakingAddress +
    '&order_by=pk&order_direction=desc' +
    '&asset_contract_address=' +
    tokenAddress +
    '&token_ids=' +
    stakedNftIds.join('&token_ids=') +
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

const getNFTTransfers = async (walletAddress: string, tokenAddress: string) => {
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
