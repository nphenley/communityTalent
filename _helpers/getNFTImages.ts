import { getTokenAddressesForCommunity } from '_api/communities';
import { getAddressesInWalletGroup } from '_api/walletGroups';

export const getCommunityNFTImagesForWalletGroup = async (walletGroupID: string, communityId: string, setNFTImages: any) => {
  let walletAddresses;
  let solTokenAddresses;
  let ethTokenAddresses;
  let stakingAddresses;
  await Promise.all([
    (walletAddresses = await getAddressesInWalletGroup(walletGroupID)),
    ({ solTokenAddresses, ethTokenAddresses } = await getTokenAddressesForCommunity(communityId)),
  ]);
  const images = await (
    await fetch('/api/images/', {
      method: 'POST',
      body: JSON.stringify({
        walletAddresses: walletAddresses,
        solTokenAddresses: solTokenAddresses,
        ethTokenAddresses: ethTokenAddresses,
        stakingAddresses: stakingAddresses,
      }),
    })
  ).json();
  setNFTImages(images);
};
