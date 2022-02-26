import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';

import { mainNetUrl } from '_constants/solanaConstants';
import { Community } from '_types/Community';

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

export const getUserNftsEth = async (
  getNFTBalances: any,
  userAddress: string,
  updateData: any
) => {
  const nftsInWallet = await getNFTBalances({
    params: {
      chain: 'eth',
      address: userAddress,
    },
  });

  let tokenAddressSet = new Set<string>();

  let communities: Community[] = [];

  nftsInWallet.result.map((nft: any) => {
    if (!nft.metadata) return;

    const jsonMetadata = JSON.parse(nft.metadata);

    if (!jsonMetadata.image && jsonMetadata.image_url)
      jsonMetadata.image = jsonMetadata.image_url;

    if (jsonMetadata.image.startsWith('ipfs')) {
      jsonMetadata.image =
        'https://ipfs.io/ipfs/' + jsonMetadata.image.replace('ipfs://', '');
    } else if (jsonMetadata.image.endsWith('.mp4')) {
      jsonMetadata.image =
        'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png';
    }

    if (tokenAddressSet.has(nft.token_address)) return;
    communities.push({
      name: jsonMetadata.collection ? jsonMetadata.collection : nft.name,
      image: jsonMetadata.image,
      id: nft.token_address,
    });
    tokenAddressSet.add(nft.token_address);
  });

  updateData(communities);
};

export const checkEthMatchForCommunity = async (
  getNFTBalances: any,
  userAddress: string,
  communityId: string,
  updateHasRequiredNft: (hasRequiredNft: boolean) => void
) => {
  const nfts = await getNFTBalances({
    params: {
      chain: 'eth',
      address: userAddress,
      token_addresses: communityId,
    },
  });
  if (nfts.total) {
    updateHasRequiredNft(true);
  } else {
    updateHasRequiredNft(false);
  }
};
