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
} from 'firebase/firestore';
import { Project } from '_types/Project';
import { Profile } from '_types/Profile';

// ============== WALLET ==============

export const subscribeToWallet = (
  walletAddress: string,
  setWalletContext: any
) => {
  return onSnapshot(doc(firestore, 'wallets', walletAddress), (snapshot) => {
    if (!snapshot.exists()) {
      setDoc(snapshot.ref, {});
      setWalletContext({});
    } else {
      setWalletContext(snapshot.data());
    }
  });
};

// ============== PROFILE ==============

export const createProfile = async (
  communityId: string,
  profileData: Profile
) => {
  addDoc(collection(firestore, 'communities', communityId, 'profiles'), {
    ...profileData,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProfile = async (
  communityId: string,
  profileId: string,
  data: Partial<Profile>
) => {
  const docRef = await updateDoc(
    doc(firestore, 'communities', communityId, 'profiles', profileId),
    { ...data, dateLastUpdated: Timestamp.now() }
  );
  return docRef;
};

export const subscribeToProfile = (
  communityId: string,
  walletAddress: string,
  updateProfile: any
) => {
  return onSnapshot(
    query(
      collection(firestore, 'communities', communityId, 'profiles'),
      where('walletAddress', '==', walletAddress)
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
    collection(firestore, 'communities', communityId, 'profiles')
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

// TODO:
// Existing Profile requires a main profile to be made outside a community.
export const checkForExistingProfile = async (
  walletAddress: string,
  setExistingProfile: any
) => {
  // const userProfiles = await getDocs(
  //   query(
  //     collection(firestore, 'communities', communityId, 'profiles')
  //     where('walletAddress', '==', walletAddress),
  //     orderBy('dateLastUpdated', 'desc')
  //   )
  // );
  // const profile = userProfiles.docs.length
  //   ? { ...userProfiles.docs[0].data() }
  //   : undefined;
  // setExistingProfile(profile);
  setExistingProfile(undefined);
};

export const importProfile = async (
  communityId: string,
  existingProfile: Profile
) => {
  return addDoc(collection(firestore, 'communities', communityId, 'profiles'), {
    ...existingProfile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

// ============== PROJECTS ==============

export const createProject = async (communityId: string, project: Project) => {
  return addDoc(collection(firestore, 'communities', communityId, 'projects'), {
    ...project,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const updateProject = async (
  communityId: string,
  projectId: string,
  data: Partial<Project>
) => {
  return updateDoc(
    doc(
      collection(firestore, 'communities', communityId, 'projects'),
      projectId
    ),
    { ...data, dateLastUpdated: Timestamp.now() }
  );
};

export const getProjects = async (communityId: string, setProjects: any) => {
  const data = await getDocs(
    query(
      collection(firestore, 'communities', communityId, 'projects'),
      orderBy('dateCreated', 'desc')
    )
  );
  setProjects(
    data.docs.map((doc) => ({ ...doc.data(), id: doc.id } as Project))
  );
};

// ==================== CHECK COMMUNITY EXISTS FOR NFT ====================

export const getCommunitiesForAddress = async (tokenAddress: string) => {
  const communities = await getDocs(
    collection(firestore, 'tokenAddresses', tokenAddress, 'communities')
  );
  let communitiesWithoutImage: { id: string; name: string }[] = [];
  communities.forEach((doc) => {
    communitiesWithoutImage.push({
      id: doc.id,
      name: doc.data().name,
    });
  });
  return communitiesWithoutImage;
};

// ==================== COMMUNITY PINS ====================

export const unpinCommunity = async (
  walletAddress: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'wallets', walletAddress), {
    pinnedCommunities: arrayRemove(communityId),
  });
};

export const pinCommunity = async (
  walletAddress: string,
  communityId: string
) => {
  await updateDoc(doc(firestore, 'wallets', walletAddress), {
    pinnedCommunities: arrayUnion(communityId),
  });
};

// ==================== FIND COMMUNITY TOKEN ADDRESS ====================

export const checkCommunityIdMatchesAddress = async (
  communityId: string,
  tokenAddress: string
) => {
  const community = await getDoc(
    doc(firestore, 'tokenAddresses', tokenAddress, 'communities', communityId)
  );
  return community.exists();
};
