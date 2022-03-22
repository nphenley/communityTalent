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

export const getUserCommunitiesByTokenAddresses = async (userTokenAddresses: string[], userTokenMetadata: string[]) => {
  const allTokenAddresses = await getDocs(collectionGroup(firestore, 'tokenAddresses'));
  let communitiesMatchingUserTokenAddresses: {
    id: string;
    name: string;
    tokenAddress: string;
    metadata: string | undefined;
  }[] = [];

  await Promise.all(
    allTokenAddresses.docs.map(async (docSnap) => {
      if (userTokenAddresses.includes(docSnap.id)) {
        const index = userTokenAddresses.indexOf(docSnap.id);
        const community = await getDoc(docSnap.ref.parent.parent!);
        communitiesMatchingUserTokenAddresses.push({
          id: community.id,
          name: community.data()!.name,
          tokenAddress: docSnap.id,
          metadata: userTokenMetadata[index] ? userTokenMetadata[index] : undefined,
        });
      }
    })
  );
  return communitiesMatchingUserTokenAddresses;
};

export const checkCommunityIdMatchesAddress = async (communityId: string, tokenAddress: string) => {
  const tokenAddresses = await getDocs(collection(firestore, 'communities', communityId, 'tokenAddresses'));
  let matchFound = false;
  tokenAddresses.forEach((communityTokenAddress) => {
    if (communityTokenAddress.id == tokenAddress) matchFound = true;
  });
  return matchFound;
};

export const getCommunityById = async (communityId: string) => {
  const community = await getDoc(doc(firestore, 'communities', communityId));
  const communityAddress = await getDocs(collection(firestore, 'communities', communityId, 'tokenAddresses'));
  const communityStakingAddress = await getDocs(collection(firestore, 'communities', communityId, 'stakingAddresses'));
  return {
    id: communityId,
    name: community.data()!.name,
    tokenAddresses: communityAddress.docs.map((community) => community.id),
    stakingAddresses: !communityStakingAddress.empty ? communityStakingAddress.docs.map((community) => community.id) : [],
  };
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
