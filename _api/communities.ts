import { firestore } from '_firebase/config';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  setDoc,
  arrayRemove,
  arrayUnion,
  collectionGroup,
  deleteDoc,
} from 'firebase/firestore';
import { SelectOption } from '_types/SelectOption';
import { Dispatch, SetStateAction } from 'react';

export const unpinCommunity = async (
  walletGroupID: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'pinnedCommunities', walletGroupID), {
    communityIds: arrayRemove(communityId),
  });
};

export const pinCommunity = async (
  walletGroupID: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'pinnedCommunities', walletGroupID), {
    communityIds: arrayUnion(communityId),
  });
};

export const subscribeToPinnedCommunityIds = (
  walletGroupID: string,
  setUserPinnedCommunityIds: any
) => {
  return onSnapshot(
    doc(firestore, 'pinnedCommunities', walletGroupID),
    (snapshot) => {
      if (!snapshot.exists()) {
        setDoc(snapshot.ref, {});
      } else {
        setUserPinnedCommunityIds(
          snapshot.data().communityIds ? snapshot.data().communityIds : []
        );
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
  const communityStakingAddress = await getDocs(
    collection(firestore, 'communities', communityId, 'stakingAddresses')
  );
  return {
    id: communityId,
    name: community.data()!.name,
    tokenAddresses: communityAddress.docs.map((community) => community.id),
    stakingAddresses: !communityStakingAddress.empty
      ? communityStakingAddress.docs.map((community) => community.id)
      : [],
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

// ==================== STAKED COMMUNITIES ====================

export const addStakedCommunity = async (
  walletGroupID: string,
  communityId: string
) => {
  setDoc(
    doc(
      firestore,
      'walletGroups',
      walletGroupID,
      'stakedCommunities',
      communityId
    ),
    {}
  );
};

export const removeStakedCommunity = async (
  walletGroupID: string,
  communityId: string
) => {
  deleteDoc(
    doc(
      firestore,
      'walletGroups',
      walletGroupID,
      'stakedCommunities',
      communityId
    )
  );
};

export const getStakingCommunitiesSelectOptions = async (
  updateSelectOptions: (selectOptions: SelectOption[]) => void
) => {
  return getDoc(doc(firestore, 'selectOptions', 'stakingCommunities')).then(
    (docSnap) => {
      let stakingCommunityInfo: SelectOption[] = [];
      docSnap
        .data()!
        .array.forEach(
          (stakingCommunity: {
            communityId: string;
            communityName: string;
          }) => {
            stakingCommunityInfo.push({
              value: stakingCommunity.communityId,
              label: stakingCommunity.communityName,
            });
          }
        );
      updateSelectOptions(stakingCommunityInfo);
    }
  );
};

export const subscribeToStakedCommunities = (
  walletGroupID: string,
  updateStakedCommunities: (stakedCommunities: string[]) => void
) => {
  return onSnapshot(
    collection(firestore, 'walletGroups', walletGroupID, 'stakedCommunities'),
    (querySnap) => {
      let stakedCommunities: string[] = [];
      querySnap.docs.forEach((doc) => stakedCommunities.push(doc.id));
      updateStakedCommunities(stakedCommunities);
    }
  );
};
