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
import { EthTokenAddress } from '_types/EthTokenAddress';

export const unpinCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(
    doc(firestore, 'pinnedCommunities', walletGroupID),
    { array: arrayRemove(communityId) },
    { merge: true }
  );
};

export const pinCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(
    doc(firestore, 'pinnedCommunities', walletGroupID),
    { array: arrayUnion(communityId) },
    { merge: true }
  );
};

export const subscribeToPinnedCommunityIds = (
  walletGroupID: string,
  updatePinnedCommunityIds: (ids: string[]) => void
): Unsubscribe => {
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
  return setDoc(
    doc(firestore, 'stakedCommunities', walletGroupID),
    { array: arrayUnion(communityId) },
    { merge: true }
  );
};

export const removeStakedCommunity = async (walletGroupID: string, communityId: string) => {
  return setDoc(
    doc(firestore, 'stakedCommunities', walletGroupID),
    { array: arrayRemove(communityId) },
    { merge: true }
  );
};

export const getCommunitiesByTokenAddress = async (tokenAddress: string): Promise<Community[]> => {
  let communities: Community[] = [];
  await Promise.all([
    getDocs(query(collectionGroup(firestore, 'solTokenAddresses'), where('tokenAddress', '==', tokenAddress))).then(
      async (querySnap) => {
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
      }
    ),
    ,
    getDocs(query(collectionGroup(firestore, 'ethTokenAddresses'), where('tokenAddress', '==', tokenAddress))).then(
      async (querySnap) => {
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
      }
    ),
  ]);
  return communities;
};

export const getStakingCommunities = async (
  updateStakingCommunities: (stakingCommunities: Community[]) => void
): Promise<void> => {
  let communities: Community[] = [];
  await getDocs(collectionGroup(firestore, 'ethTokenAddresses')).then(async (querySnap) => {
    await Promise.all(
      querySnap.docs.map(async (doc) => {
        if (doc.data().stakingAddress) {
          return getDoc(doc.ref.parent.parent!).then((doc) => {
            communities.push({
              id: doc.id,
              name: doc.data()!.name,
              image: doc.data()!.image,
            });
          });
        }
      })
    );
  });

  await getDocs(collectionGroup(firestore, 'solCommunityIds')).then(async (querySnap) => {
    await Promise.all(
      querySnap.docs.map(async (doc) => {
        if (doc.data().staked) {
          return getDoc(doc.ref.parent.parent!).then((doc) => {
            communities.push({
              id: doc.id,
              name: doc.data()!.name,
              image: doc.data()!.image,
            });
          });
        }
      })
    );
  });
  let uniq: any = {};
  const uniqueCommunities = communities.filter((obj) => !uniq[obj.id] && (uniq[obj.id] = true));
  updateStakingCommunities(uniqueCommunities);
};

export const getTokenAddressesForCommunity = async (communityId: string): Promise<EthTokenAddress[]> => {
  let ethTokenAddresses: EthTokenAddress[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'ethTokenAddresses'));
  docs.forEach((doc) => ethTokenAddresses.push(doc.data() as EthTokenAddress));
  return ethTokenAddresses;
};

export const getSolCommunityIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let solCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'solCommunityIds'));
  docs.forEach((doc) => solCommunityIds.push(doc.id));
  return solCommunityIds;
};
