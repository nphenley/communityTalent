import { firestore } from '_firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  setDoc,
  arrayRemove,
  arrayUnion,
  collectionGroup,
  Unsubscribe,
  query,
  where,
} from 'firebase/firestore';
import { Community } from '_types/Community';

export const checkCommunityIdMatchesAddress = async (communityId: string, tokenAddress: string) => {
  const tokenAddresses = await getDocs(collection(firestore, 'communities', communityId, 'tokenAddresses'));
  let matchFound = false;
  tokenAddresses.forEach((communityTokenAddress) => {
    if (communityTokenAddress.id == tokenAddress) matchFound = true;
  });
  return matchFound;
};

export const checkForStakingAddresses = async (communityId: string) => {
  const tokenAddressDocs = await getDocs(collection(firestore, 'communities', communityId, 'tokenAddresses'));
  const stakingAddressDocs = await getDocs(collection(firestore, 'communities', communityId, 'stakingAddresses'));
  if (stakingAddressDocs.empty) return [];
  let stakingCommunityInfo: { tokenAddress: string; stakingAddress: string }[] = [];
  for (let i = 0; i < stakingAddressDocs.size; i++) {
    stakingCommunityInfo.push({
      tokenAddress: tokenAddressDocs.docs[i].id,
      stakingAddress: stakingAddressDocs.docs[i].id,
    });
  }

  return stakingCommunityInfo;
};

// ==================== REWORK ====================

export const unpinCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(doc(firestore, 'pinnedCommunities', walletGroupID), { array: arrayRemove(communityId) }, { merge: true });
};

export const pinCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(doc(firestore, 'pinnedCommunities', walletGroupID), { array: arrayUnion(communityId) }, { merge: true });
};

export const subscribeToPinnedCommunityIds = (walletGroupID: string, updatePinnedCommunityIds: (ids: string[]) => void): Unsubscribe => {
  return onSnapshot(doc(firestore, 'pinnedCommunities', walletGroupID), (snapshot) => {
    updatePinnedCommunityIds(snapshot.exists() ? snapshot.data().array : []);
  });
};

export const subscribeToStakedCommunities = (
  walletGroupID: string,
  updateStakedCommunities: (stakedCommunities: Community[]) => void
): Unsubscribe => {
  return onSnapshot(doc(firestore, 'stakedCommunities', walletGroupID), async (snapshot) => {
    const stakedCommunities: Community[] = [];
    if (snapshot.exists()) {
      await Promise.all(
        snapshot.data().array.map(async (stakedCommunityId: string) => {
          const data = (await getDoc(doc(firestore, 'communities', stakedCommunityId))).data()!;
          stakedCommunities.push({
            id: stakedCommunityId,
            name: data.name,
            image: data.image,
          });
        })
      );
    }
    updateStakedCommunities(stakedCommunities);
  });
};

export const addStakedCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(doc(firestore, 'stakedCommunities', walletGroupID), { array: arrayUnion(communityId) }, { merge: true });
};

export const removeStakedCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(doc(firestore, 'stakedCommunities', walletGroupID), { array: arrayRemove(communityId) }, { merge: true });
};

export const getCommunitiesByTokenAddress = async (tokenAddress: string): Promise<Community[]> => {
  let communities: Community[] = [];
  await getDocs(query(collectionGroup(firestore, 'tokenAddresses'), where('tokenAddress', '==', tokenAddress))).then(async (querySnap) => {
    return Promise.all(
      querySnap.docs.map(async (doc) => {
        return getDoc(doc.ref.parent.parent!).then((docSnap) => {
          communities.push({
            id: docSnap.id,
            name: docSnap.data()!.name,
            image: docSnap.data()!.image,
          });
        });
      })
    );
  });
  return communities;
};

export const getStakingCommunities = async (updateStakingCommunities: (stakingCommunities: Community[]) => void) => {
  let communities: Community[] = [];
  await getDocs(collectionGroup(firestore, 'stakingAddresses')).then(async (querySnap) => {
    await Promise.all(
      querySnap.docs.map(async (doc) => {
        return getDoc(doc.ref.parent.parent!).then((doc) => {
          communities.push({
            id: doc.id,
            name: doc.data()!.name,
            image: doc.data()!.image,
          });
        });
      })
    );
  });
  updateStakingCommunities(communities);
};

export const getTokenAddressesForCommunity = async (communityId: string): Promise<string[]> => {
  let tokenAddresses: string[] = [];
  await getDocs(collection(firestore, 'communities', communityId, 'tokenAddresses')).then((query) => {
    query.forEach((doc) => tokenAddresses.push(doc.id));
  });
  return tokenAddresses;
};

export const getStakingAddressesForCommunity = async (communityId: string): Promise<string[]> => {
  let stakingAddresses: string[] = [];
  await getDocs(collection(firestore, 'communities', communityId, 'stakingAddresses')).then((query) => {
    query.forEach((doc) => stakingAddresses.push(doc.id));
  });
  return stakingAddresses;
};
