import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';
import { mainNetUrl } from '_constants/solanaConstants';
import { Networks } from '_enums/Networks';
import {
  checkCommunityIdMatchesAddress,
  getCommunityById,
  getUserCommunitiesByTokenAddresses,
  checkForStakingAddresses,
} from '_api/communities';
import { Community } from '_types/Community';
import {
  checkIfUserStillHasStakedNft,
  getImageForStakingCommunity,
} from '_helpers/getStakedNfts';

export const getCommunities = async (
  getNFTBalances: any,
  walletAddress: string,
  updateData: any,
  chainId: string,
  userStakedCommunityIds: string[],
  pinnedCommunityIds: string[],
  network: string
) => {
  let communities: Community[];

  if (network === Networks.ETH) {
    communities = await getUserNftsEVM(chainId, walletAddress, getNFTBalances);
  } else {
    communities = await getUserNftsSolana(walletAddress);
  }
  if (userStakedCommunityIds.length) {
    await Promise.all(
      userStakedCommunityIds.map(async (stakedCommunityId) => {
        const stakedCommunity = await getCommunityById(stakedCommunityId);
        const image = await getImageForStakingCommunity(
          stakedCommunity.tokenAddress[0]
        );
        communities.push({
          id: stakedCommunity.id,
          name: stakedCommunity.name,
          image: image,
        });
      })
    );
  }
  communities = filterDuplicateCommunities(communities);

  let pinnedCommunities: Community[] = [];
  if (pinnedCommunityIds.length) {
    communities.forEach((community) => {
      if (pinnedCommunityIds.includes(community.id))
        pinnedCommunities.push(community);
    });
  }

  updateData(communities, pinnedCommunities);
};

export const getUserNftsSolana = async (walletAddress: string) => {
  const nftsInWallet = await getParsedNftAccountsByOwner({
    publicAddress: walletAddress,
    connection: new Connection(mainNetUrl),
  });
  if (!nftsInWallet) return [];
  let communitiesWithoutImage = await getUserCommunitiesByTokenAddresses(
    nftsInWallet.map((nft: any) => nft.mint),
    nftsInWallet.map((nft: any) => nft.data.uri)
  );
  let communities: Community[] = [];
  await Promise.all(
    communitiesWithoutImage.map(async (communityWithoutImage: any) => {
      const metadata = await fetch(communityWithoutImage.metadata);
      const data = await metadata.json();
      const community = {
        id: communityWithoutImage.id,
        name: communityWithoutImage.name,
        image: data.image,
      };
      communities.push(community);
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
  const communitiesWithoutImages = await getUserCommunitiesByTokenAddresses(
    nftsInWallet.result.map((nft: any) => nft.token_address),
    nftsInWallet.result.map((nft: any) => nft.metadata)
  );
  await Promise.all(
    communitiesWithoutImages.map(async (communityWithoutImage: any) => {
      if (chainId === '0x1') {
        const nftImage = await openseaApiCall(
          walletAddress,
          communityWithoutImage.tokenAddress
        );
        communities.push({
          id: communityWithoutImage.id,
          name: communityWithoutImage.name,
          image: nftImage,
        });
      } else {
        if (communityWithoutImage.metadata) return;
        const jsonMetadata = JSON.parse(communityWithoutImage.metadata);
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

        communities.push({
          id: communityWithoutImage.id,
          name: communityWithoutImage.name,
          image: jsonMetadata.image,
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
  chainId: string | null
) => {
  let tokenAddressesInWallet: string[] = [];
  if (network === Networks.ETH) {
    const nftsInWalletResponse = await getNFTBalances({
      params: {
        chain: chainId,
        address: walletAddress,
      },
    });

    tokenAddressesInWallet = nftsInWalletResponse.result.map(
      (nft: any) => nft.token_address
    );
  } else {
    const nftsInWallet = await getParsedNftAccountsByOwner({
      publicAddress: walletAddress,
      connection: new Connection(mainNetUrl),
    });
    tokenAddressesInWallet = nftsInWallet.map((nft: any) => nft.mint);
  }
  //filter tokenAddresses for dupes
  let hasRequiredNft = false;
  await Promise.all(
    tokenAddressesInWallet.map(async (tokenAddress: any) => {
      if (await checkCommunityIdMatchesAddress(communityId, tokenAddress)) {
        hasRequiredNft = true;
      }
    })
  );
  if (network === Networks.ETH && !hasRequiredNft) {
    const stakingCommunityInfo = await checkForStakingAddresses(communityId);

    await Promise.all(
      stakingCommunityInfo.map(async (stakingCommunity) => {
        if (
          await checkIfUserStillHasStakedNft(
            walletAddress,
            stakingCommunity.tokenAddress,
            stakingCommunity.stakingAddress
          )
        ) {
          hasRequiredNft = true;
        }
      })
    );
  }
  updateHasRequiredNft(hasRequiredNft);
};

const filterDuplicateCommunities = (nonUniqueCommunities: Community[]) => {
  let communityIdSet = new Set<string>();
  let uniqueCommunities: Community[] = [];
  if (!nonUniqueCommunities.length) return nonUniqueCommunities;
  nonUniqueCommunities.forEach((community) => {
    if (communityIdSet.has(community.id)) return;
    uniqueCommunities.push(community);
    communityIdSet.add(community.id);
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
