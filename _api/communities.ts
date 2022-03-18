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
        setUserPinnedCommunityIds(
          snapshot.data().communityIds ? snapshot.data().communityIds : []
        );
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
        setUserStakedCommunityIds(
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
  let stakingCommunityInfo: { value: string; label: string }[] = [];
  if (!stakingCommunities.exists()) return;
  stakingCommunities
    .data()
    .array.forEach(
      (stakingCommunity: { communityId: string; communityName: string }) => {
        stakingCommunityInfo.push({
          value: stakingCommunity.communityId,
          label: stakingCommunity.communityName,
        });
      }
    );
  setStakingCommunities(stakingCommunityInfo);
};

// ==================== LINKED WALLETS ====================

export const checkForIdsInLinkedWallets = async (
  walletAddress: string,
  linkedWallets: string[]
) => {
  const currentWalletPinned = await getDoc(
    doc(firestore, 'pinnedCommunities', walletAddress)
  );
  const currentWalletStaked = await getDoc(
    doc(firestore, 'stakedCommunities', walletAddress)
  );
  const index = linkedWallets.indexOf(walletAddress);
  linkedWallets.splice(index, 1);

  if (!currentWalletPinned.exists() && !currentWalletPinned.data()) {
    await Promise.all(
      linkedWallets.map(async (wallet) => {
        const linkedWalletPinned = await getDoc(
          doc(firestore, 'pinnedCommunities', wallet)
        );
        if (linkedWalletPinned.exists()) {
          console.log(wallet, linkedWalletPinned.data().communityIds);
          await setDoc(currentWalletPinned.ref, {
            communityIds: linkedWalletPinned.data().communityIds,
          });
        } //here as well we overwrite, shouldn't be much of an issue
      }) //in practice as people will be able to link wallets
    ); //with our first version so shouldn't be setting different
  } //things on different wallets then linking them.
  if (!currentWalletStaked.exists() && !currentWalletStaked.data()) {
    await Promise.all(
      linkedWallets.map(async (wallet) => {
        const linkedWalletStaked = await getDoc(
          doc(firestore, 'stakedCommunities', wallet)
        );
        if (linkedWalletStaked.exists()) {
          await setDoc(currentWalletStaked.ref, {
            communityIds: linkedWalletStaked.data().communityIds,
          });
        }
      })
    );
  }
};
