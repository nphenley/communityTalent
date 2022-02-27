import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';

import { mainNetUrl } from '_constants/solanaConstants';
import { isCommunityPinned } from '_firebase/APIRequests';
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
  updateData: any,
  chainId: string
) => {
  const nftsInWallet = await getNFTBalances({
    params: {
      chain: chainId,
      address: userAddress,
    },
  });

  let tokenAddressSet = new Set<string>();
  let pinnedCommunities: Community[] = [];
  let communities: Community[] = [];

  await Promise.all(
    nftsInWallet.result.map(async (nft: any) => {
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

      const isPinned = await isCommunityPinned(userAddress, nft.token_address);
      const community = {
        name: jsonMetadata.collection ? jsonMetadata.collection : nft.name,
        image: jsonMetadata.image,
        id: nft.token_address,
      };
      if (isPinned) pinnedCommunities.push(community);
      communities.push(community);
    })
  );
  let uniquePinnedCommunities: Community[] = [];
  let uniqueCommunities: Community[] = [];

  communities.forEach((community) => {
    if (tokenAddressSet.has(community.id)) return;
    uniqueCommunities.push(community);
    tokenAddressSet.add(community.id);
  });
  tokenAddressSet.clear();
  pinnedCommunities.forEach((community) => {
    if (tokenAddressSet.has(community.id)) return;
    uniquePinnedCommunities.push(community);
    tokenAddressSet.add(community.id);
  });

  updateData(uniqueCommunities, uniquePinnedCommunities);
};

export const checkEthMatchForCommunity = async (
  getNFTBalances: any,
  chainId: string,
  userAddress: string,
  communityId: string,
  updateHasRequiredNft: (hasRequiredNft: boolean) => void
) => {
  const nfts = await getNFTBalances({
    params: {
      chain: chainId,
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
