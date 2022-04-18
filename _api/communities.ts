import { firestore, collectionsFirestore } from '_firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { getAddressesInWalletGroup } from './walletGroups';
import { privateCommunities } from '_constants/privateCommunities';
import { Community } from '_types/Community';

export const getEthCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let ethCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'ethCollectionIds'));
  docs.forEach((doc) => ethCommunityIds.push(doc.id));
  return ethCommunityIds;
};

export const getSolCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let solCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'solCollectionIds'));
  docs.forEach((doc) => solCommunityIds.push(doc.id));
  return solCommunityIds;
};

export const getCommunitiesForWalletGroup = async (
  walletGroupID: string,
  updateFilteredCommunities: (communities: Community[]) => void
) => {
  let userCommunityIds: string[] = [];

  const userAddresses = await getAddressesInWalletGroup(walletGroupID);
  const solCollections = await getDocs(collection(collectionsFirestore, 'collections'));
  const ethCollections = await getDocs(collection(collectionsFirestore, 'ethCollections'));

  solCollections.docs.forEach((collection) => {
    if (!collection.data().tokens) return;
    for (const token of collection.data().tokens)
      if (userAddresses.includes(token.owner)) {
        userCommunityIds.push(collection.id);
        break;
      }
  });

  ethCollections.docs.forEach((collection) => {
    if (!collection.data().tokens) return;
    for (const token of collection.data().tokens)
      if (userAddresses.includes(token.owner)) {
        userCommunityIds.push(collection.id);
        break;
      }
  });
  privateCommunities.sort((a, b) => a.id.localeCompare(b.id));
  for (let i = 0; i < privateCommunities.length; i++)
    if (userCommunityIds.includes(privateCommunities[i].id)) privateCommunities[i].isOwnedByUser = true;
  updateFilteredCommunities(privateCommunities.sort((a, b) => Number(b.isOwnedByUser) - Number(a.isOwnedByUser)));
};
