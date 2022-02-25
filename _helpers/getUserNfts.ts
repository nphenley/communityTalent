import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';
import { mainNetUrl } from '_constants/solanaConstants';

export const getUserNftsSolana = async (connectedWalletAddress: string) => {
  let mint: { tokenAddress: string; image: string }[] = [];
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress: connectedWalletAddress,
    connection: new Connection(mainNetUrl),
  });
  await Promise.all(
    nfts.map(async (nft) => {
      const metadata = await fetch(nft.data.uri);
      const data = await metadata.json();
      mint.push({ tokenAddress: nft.mint, image: data.image });
    })
  );
  return mint;
};
