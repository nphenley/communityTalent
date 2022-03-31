import { Connection } from '@solana/web3.js';
import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';
import { EthTokenAddress } from '_types/EthTokenAddress';
import { SolTokenAddress } from '_types/SolTokenAddress';

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

const connection = new Connection('https://ssc-dao.genesysgo.net/');

// TODO:
// rate-limiting might be an issue.
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') res.status(400).end();
  const { walletAddresses, solTokenAddresses, ethTokenAddresses } = JSON.parse(req.body);
  const images: string[] = [];
  const imageRequests: any[] = [];
  walletAddresses.forEach(async (walletAddress: string) => {
    if (Web3.utils.isAddress(walletAddress)) {
      imageRequests.push(async () => {
        const imagesArray = await getEthImagesOwnedByWalletViaOpensea(walletAddress, ethTokenAddresses);
        imagesArray.forEach((image) => !images.includes(image) && images.push(image));
      });
      ethTokenAddresses.forEach((tokenAddress: EthTokenAddress) => {
        if (!tokenAddress.stakingAddress) return;
        imageRequests.push(async () => {
          const imagesArray = await getEthStakedImagesViaOpensea(walletAddress, tokenAddress);
          images.push(...imagesArray);
        });
      });
    } else {
      imageRequests.push(async () => {
        const imagesArray = await getSolImagesOwnedByWallet(walletAddress, solTokenAddresses);
        imagesArray.forEach((image) => !images.includes(image) && images.push(image));
      });
      imageRequests.push(async () => {
        const imagesArray = await getSolStakedImages(walletAddress, solTokenAddresses);
        images.push(...imagesArray);
      });
    }
  });
  await Promise.all(imageRequests.map((fn) => fn()));
  res.status(200).json(images);
};

const getEthImagesOwnedByWalletViaOpensea = async (walletAddress: string, ethTokenAddresses: EthTokenAddress[]): Promise<string[]> => {
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

const getEthStakedImagesViaOpensea = async (walletAddress: string, ethTokenAddress: EthTokenAddress): Promise<string[]> => {
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

const getSolImagesOwnedByWallet = async (walletAddress: string, solTokenAddresses: SolTokenAddress[]): Promise<string[]> => {
  const walletOptions = {
    network: 'mainnet' as 'mainnet',
    address: walletAddress,
  };
  const nftBalance = await Moralis.SolanaAPI.account.getNFTs(walletOptions);
  const ownedNFTTokenAddressesInCommunity: string[] = [];
  nftBalance.forEach((nft) => {
    solTokenAddresses.map((elem) => elem.tokenAddress).includes(nft.mint) && ownedNFTTokenAddressesInCommunity.push(nft.mint);
  });
  return Promise.all(ownedNFTTokenAddressesInCommunity.map(async (tokenAddress) => getSolImageByTokenAddress(tokenAddress)));
};

// TODO:
// add programID
// transfer over 1000 redo
// set staked/unstaked efficiency
// Currently blocked by solscan lol
const getSolStakedImages = async (walletAddress: string, solTokenAddresses: SolTokenAddress[]): Promise<string[]> => {
  const transfers = await getSolAllTransfersByWallet(walletAddress);
  // const transfers: any[] = [];
  const stakedNFTs: Set<string> = new Set();
  const images: string[] = [];
  await Promise.all(
    transfers.map(async (transfer: { tokenAddress: string; signature: string[] }) => {
      if (!solTokenAddresses.map((elem) => elem.tokenAddress).includes(transfer.tokenAddress)) return;
      let tx;
      while (!tx) tx = await connection.getTransaction(transfer.signature[0]);
      tx.transaction.message.instructions.map(async (instruction) => {
        if (solTokenAddresses.find((elem) => instruction.data === elem.unstakeID)) {
          stakedNFTs.delete(transfer.tokenAddress);
        } else if (solTokenAddresses.find((elem) => instruction.data === elem.stakeID)) {
          stakedNFTs.add(transfer.tokenAddress);
        }
      });
      await Promise.all(Array.from(stakedNFTs.values()).map(async (stakedNFT) => images.push(await getSolImageByTokenAddress(stakedNFT))));
    })
  );
  return images;
};

const getSolImageByTokenAddress = async (tokenAddress: string) => {
  const nftOptions = {
    network: 'mainnet' as 'mainnet',
    address: tokenAddress,
  };
  const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(nftOptions);
  return (await (await fetch(nftMetadata.metaplex.metadataUri)).json()).image;
};

const getSolAllTransfersByWallet = async (walletAddress: string) => {
  const apiUrl = 'https://public-api.solscan.io/account/splTransfers?account=' + walletAddress + '&offset=0&limit=1000';
  const response = await fetch(apiUrl);
  const transfers = await response.json();
  return transfers.data;
};
