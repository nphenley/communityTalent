import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';

export const getUserNftsSolana = async (connectedWalletAddress: string) => {
  let mint: string[] = [];
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress: connectedWalletAddress,
    connection: new Connection('https://api.mainnet-beta.solana.com'),
  });
  nfts.forEach((nft) => mint.push(nft.mint));
  return mint;
};
