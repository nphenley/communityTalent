export const getNftImagesForCommunityProfile = async (walletGroupIDs: string[], communityId: string, setUserOwnedImages: any) => {
  const community = await getCommunityById(communityId);
  let images: string[] = [];
  let tokenAddressString: string = '';
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  community.tokenAddresses.forEach((tokenAddress) => {
    tokenAddressString += '&asset_contract_address=' + tokenAddress;
  });
  await Promise.all(
    walletGroupIDs.map(async (walletGroupID) => {
      if (Web3.utils.isAddress(walletGroupID)) {
        var apiUrl =
          'https://api.opensea.io/api/v1/assets?owner=' +
          walletGroupID +
          '&owner=' +
          walletGroupID +
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
  if (!community.stakingAddresses.length) {
    setUserOwnedImages(images);
    return;
  }

  await Promise.all(
    walletGroupIDs.map(async (walletGroupID) => {
      for (let i = 0; i < community.stakingAddresses.length; i++) {
        await getStakedNftImages(walletGroupID, community.tokenAddresses[i], community.stakingAddresses[i], images);
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
