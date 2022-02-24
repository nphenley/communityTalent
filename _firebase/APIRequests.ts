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
} from 'firebase/firestore';
import { Project } from '_types/Project';
import { Profile } from '_types/Profile';
import { Community } from '_types/Community';

const projectsCollectionRef = collection(firestore, 'projects');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');
const solNftTokenAddressesCollectionRef = collection(
  firestore,
  'solNftTokenAddresses'
);
const solNftCommunitiesCollectionRef = collection(
  firestore,
  'solNftCommunities'
);

// ============== PROFILE ==============

export const createProfile = async (profileData: Partial<Profile>) => {
  addDoc(collection(firestore, 'profiles'), {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const editProfile = async (
  profileId: string,
  data: Partial<Profile>
) => {
  const docRef = await updateDoc(doc(firestore, 'profiles', profileId), {
    ...data,
    dateLastUpdated: Timestamp.now(),
  });
  return docRef;
};

export const subscribeToProfile = (
  communityId: string,
  walletAddress: string,
  updateProfile: any
) => {
  return onSnapshot(
    query(
      profileCollectionRef,
      where('walletAddresses', 'array-contains', walletAddress),
      where('communityId', '==', communityId)
    ),
    (snapshot) =>
      updateProfile(
        snapshot.docs.length
          ? { ...snapshot.docs[0].data(), id: snapshot.docs[0].id }
          : undefined
      )
  );
};

export const getProfiles = async (communityId: string, updateProfiles: any) => {
  const data = await getDocs(
    query(profileCollectionRef, where('communityId', '==', communityId))
  );
  updateProfiles(
    data.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Profile)
    )
  );
};

// ============== PROJECTS ==============

export const createProject = (project: Project) => {
  addDoc(collection(firestore, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const getProjects = async (setProjects: any) => {
  const data = await getDocs(
    query(projectsCollectionRef, orderBy('dateCreated', 'desc'))
  );
  setProjects(
    data.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Project)
    )
  );
};

export const getPins = async (walletAddress: string, setPins: any) => {
  const userPins = await getDocs(
    query(pinsCollectionRef, where('user', '==', walletAddress))
  );
  let pins: string[] = [];
  userPins.docs.map((doc) => pins.push(doc.data().project));
  setPins(pins);
};

export const getProfileId = async (
  communityId: string,
  walletAddress: string
) => {
  const profileId = await getDocs(
    query(
      profileCollectionRef,
      where('walletAddresses', 'array-contains', walletAddress),
      where('communityId', '==', communityId)
    )
  );
  return profileId.docs.length !== 0 ? profileId.docs[0].id : undefined;
};

// TODO:
// Atm only increments, otherwise toggle pinned
export const togglePinned = async (projectId: string) => {
  updateDoc(doc(projectsCollectionRef, projectId), {
    numberOfPins: increment(1),
  });
};

// ==================== SOLANA NFTS ====================

export const checkMatches = async (userNfts: string[], setCommunities: any) => {
  let count = 0;
  let list: Community[] = [];
  userNfts.forEach(async (nft) => {
    const match = await getDoc(doc(solNftTokenAddressesCollectionRef, nft));
    if (match.exists()) {
      const communityId = match.data()!.communityId;
      const community = await getDoc(
        doc(solNftCommunitiesCollectionRef, communityId)
      );
      list.push({ communityId: communityId, name: community.data()!.name });
    }
    count++;
    if (count === userNfts.length) setCommunities(list);
  });
};
