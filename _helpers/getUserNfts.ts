import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';
import { mainNetUrl } from '_constants/solanaConstants';
import { Networks } from '_enums/Networks';
import {
  checkCommunityIdMatchesAddress,
  getCommunitiesForAddress,
} from '_firebase/APIRequests';
import { Community } from '_types/Community';

export const getCommunities = async (
  getNFTBalances: any,
  walletAddress: string,
  updateData: any,
  chainId: string,
  pinnedCommunityIds: string[],
  network: string
) => {
  let communities: Community[] = [];
  if (network === Networks.ETH) {
    communities = await getUserNftsEVM(chainId, walletAddress, getNFTBalances);
  } else {
    communities = await getUserNftsSolana(walletAddress);
  }
  let pinnedCommunities: Community[] = [];
  if (pinnedCommunityIds) {
    communities.forEach((community) => {
      if (pinnedCommunityIds.includes(community.id))
        pinnedCommunities.push(community);
    });
  }
  updateData(
    filterDuplicateCommunities(communities),
    filterDuplicateCommunities(pinnedCommunities)
  );
};

export const getUserNftsSolana = async (walletAddress: string) => {
  const nftsInWallet = await getParsedNftAccountsByOwner({
    publicAddress: walletAddress,
    connection: new Connection(mainNetUrl),
  });
  if (!nftsInWallet) return [];
  let communities: Community[] = [];
  await Promise.all(
    nftsInWallet.map(async (nft: any) => {
      let communitiesWithoutImage = await getCommunitiesForAddress(nft.mint);
      if (!communitiesWithoutImage.length) return;

      await Promise.all(
        communitiesWithoutImage.map(async (communityWithoutImage) => {
          const metadata = await fetch(nft.data.uri);
          const data = await metadata.json();
          const community = { ...communityWithoutImage, image: data.image };
          communities.push(community);
        })
      );
    })
  );
  return communities;
};

const getUserNftsEVM = async (
  chainId: string,
  walletAddress: string,
  getNFTBalances: any
) => {
  let communities: Community[] = [];
  const nftsInWallet = await getNFTBalances({
    params: {
      chain: chainId,
      address: walletAddress,
    },
  });

  if (!nftsInWallet) return [];
  await Promise.all(
    nftsInWallet.result.map(async (nft: any) => {
      let communitiesWithoutImage = await getCommunitiesForAddress(
        nft.token_address
      );
      if (!communitiesWithoutImage.length) return;

      if (chainId === '0x1') {
        const nftImage = await openseaApiCall(walletAddress, nft.token_address);
        communitiesWithoutImage.forEach((communityWithoutImage) => {
          const community = { ...communityWithoutImage, image: nftImage };
          communities.push(community);
        });
      } else {
        if (!nft.metadata) return;
        const jsonMetadata = JSON.parse(nft.metadata);
        if (!jsonMetadata.image && jsonMetadata.image_url) {
          jsonMetadata.image = jsonMetadata.image_url;
        }
        if (jsonMetadata.image.startsWith('ipfs')) {
          jsonMetadata.image =
            'https://ipfs.io/ipfs/' + jsonMetadata.image.replace('ipfs://', '');
        }
        if (jsonMetadata.image.endsWith('.mp4')) {
          jsonMetadata.image =
            'https://bitsofco.de/content/images/2018/12/Screenshot-2018-12-16-at-21.06.29.png';
        }
        communitiesWithoutImage.forEach((communityWithoutImage) => {
          const community = {
            ...communityWithoutImage,
            image: jsonMetadata.image,
          };
          communities.push(community);
        });
      }
    })
  );
  return communities;
};

export const checkNftIsInWallet = async (
  getNFTBalances: any,
  walletAddress: string,
  communityId: string,
  updateHasRequiredNft: (hasRequiredNft: boolean) => void,
  network: string,
  chainId?: string
) => {
  let tokenAddressesInWallet: string[] = [];
  if (network === Networks.ETH) {
    const nftsInWalletResponse = await getNFTBalances({
      params: {
        chain: chainId,
        address: walletAddress,
      },
    });
    nftsInWalletResponse.result.forEach((nft: any) => {
      tokenAddressesInWallet.push(nft.token_address);
    });
  } else {
    const nftsInWallet = await getParsedNftAccountsByOwner({
      publicAddress: walletAddress,
      connection: new Connection(mainNetUrl),
    });
    nftsInWallet.forEach((nft: any) => {
      tokenAddressesInWallet.push(nft.mint);
    });
  }

  tokenAddressesInWallet.forEach(async (tokenAddress: any) => {
    const hasRequiredNft = await checkCommunityIdMatchesAddress(
      communityId,
      tokenAddress
    );
    if (hasRequiredNft) updateHasRequiredNft(hasRequiredNft);
  });
};

const filterDuplicateCommunities = (nonUniqueCommunities: Community[]) => {
  let tokenAddressSet = new Set<string>();
  let uniqueCommunities: Community[] = [];
  if (!nonUniqueCommunities.length) return nonUniqueCommunities;
  nonUniqueCommunities.forEach((community) => {
    if (tokenAddressSet.has(community.id)) return;
    uniqueCommunities.push(community);
    tokenAddressSet.add(community.id);
  });
  return uniqueCommunities;
};

const openseaApiCall = async (walletAddress: string, tokenAddress: string) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  var apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    walletAddress +
    '&owner=' +
    walletAddress +
    '&order_by=pk&order_direction=desc&asset_contract_address=' +
    tokenAddress +
    '&limit=1';

  const response = await fetch(apiUrl, options);
  const nftInWallet = await response.json();
  return nftInWallet.assets[0].image_url;
};
