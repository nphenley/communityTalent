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
import { SolTokenAddress } from '_types/SolTokenAddress';

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
  await Promise.all([
    getDocs(query(collectionGroup(firestore, 'solTokenAddresses'), where('tokenAddress', '==', tokenAddress))).then(async (querySnap) => {
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
    }),
    ,
    getDocs(query(collectionGroup(firestore, 'ethTokenAddresses'), where('tokenAddress', '==', tokenAddress))).then(async (querySnap) => {
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
    }),
  ]);
  return communities;
};

export const getStakingCommunities = async (updateStakingCommunities: (stakingCommunities: Community[]) => void): Promise<void> => {
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

export const getTokenAddressesForCommunity = async (
  communityId: string
): Promise<{ solTokenAddresses: SolTokenAddress[]; ethTokenAddresses: EthTokenAddress[] }> => {
  let solTokenAddresses: SolTokenAddress[] = [];
  let ethTokenAddresses: EthTokenAddress[] = [];

  await Promise.all([
    getDocs(collection(firestore, 'communities', communityId, 'solTokenAddresses')).then((query) => {
      query.forEach((doc) => solTokenAddresses.push(doc.data() as SolTokenAddress));
    }),
    getDocs(collection(firestore, 'communities', communityId, 'ethTokenAddresses')).then((query) => {
      query.forEach((doc) => ethTokenAddresses.push(doc.data() as EthTokenAddress));
    }),
  ]);

  return { solTokenAddresses, ethTokenAddresses };
};
