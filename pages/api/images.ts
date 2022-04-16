import Moralis from 'moralis';
import { NextApiRequest, NextApiResponse } from 'next';
import Web3 from 'web3';

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
Moralis.start({ serverUrl, appId });

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != 'POST') res.status(400).end();
  const { walletAddresses, solCommunityIds, ethCommunityIds } = JSON.parse(req.body);
  const solWalletAddresses: string[] = [];
  const ethWalletAddresses: string[] = [];
  walletAddresses.forEach((walletAddress: string) => {
    Web3.utils.isAddress(walletAddress)
      ? ethWalletAddresses.push(walletAddress)
      : solWalletAddresses.push(walletAddress);
  });
  const response = await fetch('https://us-central1-staked-api.cloudfunctions.net/getCollectionsData', {
    method: 'POST',
    body: JSON.stringify({
      solCommunityIds: solCommunityIds,
      ethCommunityIds: ethCommunityIds,
      solWalletAddresses: solWalletAddresses,
      ethWalletAddresses: ethWalletAddresses,
    }),
  });
  const { solNFTs, ethNFTs } = await response.json();
  const images: string[] = solNFTs.map((token: any) => token.image).concat(ethNFTs.map((token: any) => token.image));
  res.status(200).json(images);
};
