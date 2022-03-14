import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  getDoc,
  orderBy,
  where,
  doc,
  updateDoc,
  increment,
  onSnapshot,
  deleteDoc,
  setDoc,
  arrayRemove,
  arrayUnion,
  collectionGroup,
} from 'firebase/firestore';

export const unpinCommunity = async (
  walletAddress: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'pinnedCommunities', walletAddress), {
    communityIds: arrayRemove(communityId),
  });
};

export const pinCommunity = async (
  walletAddress: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'pinnedCommunities', walletAddress), {
    communityIds: arrayUnion(communityId),
  });
};

export const subscribeToPinnedCommunityIds = (
  walletAddress: string,
  setUserPinnedCommunityIds: any
) => {
  return onSnapshot(
    doc(firestore, 'pinnedCommunities', walletAddress),
    (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(snapshot.ref, {});
      } else {
        setUserPinnedCommunityIds(snapshot.data().communityIds);
      }
    }
  );
};

export const subscribeToStakedCommunityIds = (
  walletAddress: string,
  setUserStakedCommunityIds: any
) => {
  return onSnapshot(
    doc(firestore, 'stakedCommunities', walletAddress),
    (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(snapshot.ref, {});
      } else {
        setUserStakedCommunityIds(snapshot.data().communityIds);
      }
    }
  );
};

export const getUserCommunitiesByTokenAddresses = async (
  userTokenAddresses: string[],
  userTokenMetadata: string[]
) => {
  const allTokenAddresses = await getDocs(
    collectionGroup(firestore, 'tokenAddresses')
  );
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
          metadata: userTokenMetadata[index]
            ? userTokenMetadata[index]
            : undefined,
        });
      }
    })
  );
  return communitiesMatchingUserTokenAddresses;
};

export const checkCommunityIdMatchesAddress = async (
  communityId: string,
  tokenAddress: string
) => {
  const tokenAddresses = await getDocs(
    collection(firestore, 'communities', communityId, 'tokenAddresses')
  );
  let matchFound = false;
  tokenAddresses.forEach((communityTokenAddress) => {
    if (communityTokenAddress.id == tokenAddress) matchFound = true;
  });
  return matchFound;
};

export const getCommunityById = async (communityId: string) => {
  const community = await getDoc(doc(firestore, 'communities', communityId));
  const communityAddress = await getDocs(
    collection(firestore, 'communities', communityId, 'tokenAddresses')
  );
  return {
    id: communityId,
    name: community.data()!.name,
    tokenAddress: communityAddress.docs.map((community) => community.id),
  };
};

export const checkForStakingAddresses = async (communityId: string) => {
  const tokenAddressDocs = await getDocs(
    collection(firestore, 'communities', communityId, 'tokenAddresses')
  );
  const stakingAddressDocs = await getDocs(
    collection(firestore, 'communities', communityId, 'stakingAddresses')
  );
  if (stakingAddressDocs.empty) return [];
  let stakingCommunityInfo: { tokenAddress: string; stakingAddress: string }[] =
    [];
  for (let i = 0; i < stakingAddressDocs.size; i++) {
    stakingCommunityInfo.push({
      tokenAddress: tokenAddressDocs.docs[i].id,
      stakingAddress: stakingAddressDocs.docs[i].id,
    });
  }

  return stakingCommunityInfo;
};

// ==================== STAKED NFTS ====================

export const addStakedCommunityId = async (
  walletAddress: string,
  communityId: string
) => {
  updateDoc(doc(firestore, 'stakedCommunities', walletAddress), {
    communityIds: arrayUnion(communityId),
  });
};

export const removeStakedCommunityId = async (
  walletAddress: string,
  communityId: string
) => {
  updateDoc(doc(firestore, 'stakedCommunities', walletAddress), {
    communityIds: arrayRemove(communityId),
  });
};

export const getAllStakingCommunities = async (setStakingCommunities: any) => {
  const stakingCommunities = await getDoc(
    doc(firestore, 'selectOptions', 'stakingCommunities')
  );
  let stakingCommunityInfo: { communityId: string; communityName: string }[] =
    [];
  if (!stakingCommunities.exists()) return;
  stakingCommunities
    .data()
    .array.forEach((stakingCommunity: { label: string; value: string }) => {
      stakingCommunityInfo.push({
        communityId: stakingCommunity.value,
        communityName: stakingCommunity.label,
      });
    });
  setStakingCommunities(stakingCommunityInfo);
};
