import { firestore, collectionsFirestore } from '_firebase/config';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAddressesInWalletGroup } from './walletGroups';
import { privateCommunities } from '_constants/privateCommunities';
import { Community } from '_types/Community';

export const getEthCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  const docRef = await getDoc(doc(firestore, 'communities', communityId));
  if (!docRef.exists()) return [];
  const ethCollectionIds = docRef.data()!.ethCollectionIds;
  return ethCollectionIds ? ethCollectionIds : [];
};

export const getSolCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  const docRef = await getDoc(doc(firestore, 'communities', communityId));
  if (!docRef.exists()) return [];
  const solCollectionIds = docRef.data()!.solCollectionIds;
  return solCollectionIds ? solCollectionIds : [];
};

export const getCommunitiesForWalletGroup = async (
  walletGroupID: string,
  updateFilteredCommunities: (communities: Community[]) => void
) => {
  let userCommunityIds: string[] = [];

  const userAddresses = await getAddressesInWalletGroup(walletGroupID);
  await Promise.all([
    getUserCommunities(userAddresses, 'sol').then((collectionIds) => userCommunityIds.push(...collectionIds)),
    getUserCommunities(userAddresses, 'eth').then((collectionIds) => userCommunityIds.push(...collectionIds)),
  ]);

  privateCommunities.sort((a, b) => a.id.localeCompare(b.id));
  for (let i = 0; i < privateCommunities.length; i++) {
    for (let j = 0; j < privateCommunities[i].collectionIds.length; j++) {
      if (userCommunityIds.includes(privateCommunities[i].collectionIds[j])) {
        privateCommunities[i].isOwnedByUser = true;
      } else {
        privateCommunities[i].isOwnedByUser = false;
      }
    }
  }
  updateFilteredCommunities(privateCommunities.sort((a, b) => Number(b.isOwnedByUser) - Number(a.isOwnedByUser)));
};

const getUserCommunities = async (userAddresses: string[], chain: 'eth' | 'sol') => {
  let path = chain === 'eth' ? 'ethCollections' : 'collections';
  const collections = await getDocs(collection(collectionsFirestore, path));
  const collectionIds: string[] = [];
  collections.docs.forEach((collection) => {
    if (!collection.data().tokens) return;
    for (const token of collection.data().tokens)
      if (userAddresses.includes(token.owner)) {
        return collectionIds.push(collection.id);
      }
  });
  return collectionIds;
};

export const getProfileFromPublicCommunity = async (walletGroupID: string, setPublicProfile: any) => {
  const profile = await getDoc(doc(firestore, 'communities', 'web3', 'profiles', walletGroupID));
  setPublicProfile({ ...profile.data(), profilePicture: 'N/A' });
};
