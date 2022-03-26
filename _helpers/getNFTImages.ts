import { getStakingAddressesForCommunity, getTokenAddressesForCommunity } from '_api/communities';
import { getAddressesInWalletGroup } from '_api/walletGroups';

export const getCommunityNFTImagesForWalletGroup = async (walletGroupID: string, communityId: string, setUserOwnedImages: any) => {
  let walletAddresses;
  let tokenAddresses;
  let stakingAddresses;

  await Promise.all([
    (walletAddresses = await getAddressesInWalletGroup(walletGroupID)),
    (tokenAddresses = await getTokenAddressesForCommunity(communityId)),
    (stakingAddresses = await getStakingAddressesForCommunity(communityId)),
  ]);

  const images = await (
    await fetch('/api/images/', {
      method: 'POST',
      body: JSON.stringify({ walletAddresses: walletAddresses, tokenAddresses: tokenAddresses, stakingAddresses: stakingAddresses }),
    })
  ).json();

  setUserOwnedImages(images);
};
