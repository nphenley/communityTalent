import Web3 from 'web3';
import { getAddressesInWalletGroup } from '_api/walletGroups';
import { getStakedNftImages } from '_helpers/getStakedNfts';

const options = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
    'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
  },
};

// TODO:
// Needs Solana
// Also needs to get Token Addresses and Staking Addresses
export const getCommunityNFTImagesForWalletGroup = async (walletGroupID: string, communityId: string, setUserOwnedImages: any) => {
  const walletAddresses = await getAddressesInWalletGroup(walletGroupID);

  let images: string[] = [];
  let tokenAddressString = '';

  const tokenAddresses: string[] = [];
  const stakingAddresses: string[] = [];

  tokenAddresses.forEach((tokenAddress) => (tokenAddressString += '&asset_contract_address=' + tokenAddress));

  await Promise.all(
    walletAddresses.map(async (walletAddress) => {
      if (Web3.utils.isAddress(walletAddress)) {
        var apiUrl =
          'https://api.opensea.io/api/v1/assets?owner=' +
          walletAddress +
          '&owner=' +
          walletAddress +
          '&order_by=pk&order_direction=desc' +
          tokenAddressString +
          '&limit=50&include_orders=false';
        const response = await fetch(apiUrl, options);
        const nftsInWallet = await response.json();
        nftsInWallet.assets.forEach((nft: any) => {
          images.push(nft.image_url);
        });

        if (nftsInWallet.next) {
          apiUrl += '&cursor=' + nftsInWallet.next;

          await openseaPushUserImages(apiUrl, images);
        }
      }
    })
  );

  await Promise.all(
    walletAddresses.map(async (walletAddress) => {
      for (let i = 0; i < stakingAddresses.length; i++) {
        await getStakedNftImages(walletAddress, tokenAddresses[i], stakingAddresses[i], images);
      }
    })
  );

  setUserOwnedImages(images);
};

export const openseaPushUserImages = async (apiUrl: string, images: string[]) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  const response = await fetch(apiUrl, options);
  const nftsInWallet = await response.json();
  nftsInWallet.assets.forEach((nft: any) => {
    images.push(nft.image_url);
  });
  if (nftsInWallet.next) {
    const parts = apiUrl.split('cursor=');
    parts[1] = nftsInWallet.next;
    const newUrl = parts.join('cursor=');
    openseaPushUserImages(newUrl, images);
  } else {
    return;
  }
};
