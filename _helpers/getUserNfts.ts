import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';
import { mainNetUrl } from '_constants/solanaConstants';
import { getSolNftCommunity } from '_firebase/APIRequests';
import { Community } from '_types/Community';

export const getUserNftsSolana = async (
  walletAddress: string,
  updateData: any
) => {
  const nftsInWallet = await getParsedNftAccountsByOwner({
    publicAddress: walletAddress,
    connection: new Connection(mainNetUrl),
  });
  let communities: Community[] = [];
  await Promise.all(
    nftsInWallet.map(async (nft) => {
      let communityWithoutImage = await getSolNftCommunity(nft.mint);
      if (!communityWithoutImage) return;
      const metadata = await fetch(nft.data.uri);
      const data = await metadata.json();
      const community = { ...communityWithoutImage, image: data.image };
      communities.push(community);
    })
  );
  const pinnedCommunities = await getPinnedCommunities(
    walletAddress,
    communities
  );
  updateData(
    filterDuplicateCommunities(communities),
    filterDuplicateCommunities(pinnedCommunities)
  );
};

export const checkSolNftInWallet = async (
  connectedWalletAddress: string,
  communityId: string,
  updateHasRequiredNft: any
) => {
  const nftsInWallet = await getParsedNftAccountsByOwner({
    publicAddress: connectedWalletAddress,
    connection: new Connection(mainNetUrl),
  });
  let hasRequiredNft = false;
  await Promise.all(
    nftsInWallet.map(async (nft) => {
      let communityWithoutImage = await getSolNftCommunity(nft.mint);
      if (communityWithoutImage && communityWithoutImage.id === communityId) {
        hasRequiredNft = true;
      }
    })
  );
  updateHasRequiredNft(hasRequiredNft);
};

export const getUserNftsEth = async (
  getNFTBalances: any,
  walletAddress: string,
  updateData: any,
  chainId: string
) => {
  let communities: Community[] = [];

  if (chainId === '0x1') {
    communities = await getEthNftsOpensea(walletAddress);
  } else {
    const nftsInWallet = await getNFTBalances({
      params: {
        chain: chainId,
        address: walletAddress,
      },
    });
    if (!nftsInWallet) return;
    await Promise.all(
      nftsInWallet.result.map(async (nft: any) => {
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
        const community = {
          name: jsonMetadata.collection ? jsonMetadata.collection : nft.name,
          image: jsonMetadata.image,
          id: nft.token_address,
        };
        communities.push(community);
      })
    );
  }

  const pinnedCommunities = await getPinnedCommunities(
    walletAddress,
    communities
  );
  updateData(
    filterDuplicateCommunities(communities),
    filterDuplicateCommunities(pinnedCommunities)
  );
};

export const checkEthNftInWallet = async (
  getNFTBalances: any,
  chainId: string,
  walletAddress: string,
  communityId: string,
  updateHasRequiredNft: (hasRequiredNft: boolean) => void
) => {
  const nfts = await getNFTBalances({
    params: {
      chain: chainId,
      address: walletAddress,
      token_addresses: communityId,
    },
  });
  updateHasRequiredNft(nfts.total ? true : false);
};

const filterDuplicateCommunities = (nonUniqueCommunities: Community[]) => {
  let tokenAddressSet = new Set<string>();
  let uniqueCommunities: Community[] = [];
  nonUniqueCommunities.forEach((community) => {
    if (tokenAddressSet.has(community.id)) return;
    uniqueCommunities.push(community);
    tokenAddressSet.add(community.id);
  });
  return uniqueCommunities;
};

// TODO:
// Figure out Pinned Communities system
// When you first connect, if no wallet doc exists create it
// when you pin a community, if no pinnedCommunities array create it
const getPinnedCommunities = async (
  walletAddress: string,
  communities: Community[]
) => {
  let pinnedCommunities: Community[] = [];
  return pinnedCommunities;
};

const getEthNftsOpensea = async (walletAddress: string) => {
  let communities: Community[] = [];

  await openseaApiCall(walletAddress, communities);
  return communities;
};

const openseaApiCall = async (
  walletAddress: string,
  communities: Community[],
  next?: string
) => {
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
    '&order_by=pk&order_direction=desc&limit=50';

  if (next) {
    apiUrl += '&cursor=' + next;
  }

  const response = await fetch(apiUrl, options);
  const nftsInWallet = await response.json();

  nftsInWallet.assets.map((nft: any) => {
    const community = {
      name: nft.collection.name,
      image: nft.image_url,
      id: nft.asset_contract.address,
    };
    communities.push(community);
  });
  if (nftsInWallet.next) {
    await openseaApiCall(walletAddress, communities, nftsInWallet.next);
  }
};
