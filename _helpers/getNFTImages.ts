import { getTokenAddressesForCommunity, getSolCommunityIdsForCommunity } from '_api/communities';
import { getAddressesInWalletGroup } from '_api/walletGroups';

export const getCommunityNFTImagesForWalletGroup = async (
  walletGroupID: string,
  communityId: string,
  setNFTImages: any
) => {
  let walletAddresses;
  let ethTokenAddresses;
  let solCommunityIds;
  await Promise.all([
    (walletAddresses = await getAddressesInWalletGroup(walletGroupID)),
    (ethTokenAddresses = await getTokenAddressesForCommunity(communityId)),
    (solCommunityIds = await getSolCommunityIdsForCommunity(communityId)),
  ]);
  const images = await (
    await fetch('/api/images/', {
      method: 'POST',
      body: JSON.stringify({
        walletAddresses: walletAddresses,
        ethTokenAddresses: ethTokenAddresses,
        solCommunityIds: solCommunityIds,
      }),
    })
  ).json();
  setNFTImages(images);
};
