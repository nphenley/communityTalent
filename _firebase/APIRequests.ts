import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  Timestamp,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  increment,
  setDoc,
} from 'firebase/firestore';
import { Job } from 'types/Job';
import { Profile } from 'types/Profile';

const jobsCollectionRef = collection(firestore, 'jobs');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');

// ============== PROFILE ==============

export const createProfile = async (profile: Profile) => {
  const docRef = await addDoc(collection(firestore, 'profiles'), {
    ...profile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
  return docRef.id;
};

export const editProfile = async (profileId: string, profile: Profile) => {
  const docRef = await setDoc(doc(firestore, 'profiles', profileId), {
    ...profile,

    dateLastUpdated: Timestamp.now(),
  });
  return docRef;
};

export const getUserProfile = async (
  communityId: string,
  walletAddress: string,
  setProfile: any
) => {
  console.log(communityId, walletAddress);
  const profileQuery = await getDocs(
    query(
      profileCollectionRef,
      where('walletAddresses', 'array-contains', walletAddress),
      where('communityId', '==', communityId)
    )
  );
  const profile =
    profileQuery.docs.length !== 0 ? profileQuery.docs[0].data() : undefined;

  setProfile(profile);
};

// ============== JOBS ==============

export const createJob = (job: Job) => {
  addDoc(collection(firestore, 'jobs'), {
    ...job,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
};

export const getJobs = async (setJobs: any) => {
  const data = await getDocs(
    query(jobsCollectionRef, orderBy('dateCreated', 'desc'))
  );
  setJobs(
    data.docs.map(
      (doc) =>
        ({
          ...doc.data(),
          id: doc.id,
        } as Job)
    )
  );
};

export const getPins = async (walletAddress: string, setPins: any) => {
  const userPins = await getDocs(
    query(pinsCollectionRef, where('user', '==', walletAddress))
  );
  let pins: string[] = [];
  userPins.docs.map((doc) => pins.push(doc.data().job));
  setPins(pins);
};

export const getProfileId = async (
  communityId: string,
  walletAddress: string
) => {
  console.log(communityId, walletAddress);
  const profileId = await getDocs(
    query(
      profileCollectionRef,
      where('walletAddresses', 'array-contains', walletAddress),
      where('communityId', '==', communityId)
    )
  );
  console.log(profileId.docs.length);
  return profileId.docs.length !== 0 ? profileId.docs[0].id : undefined;
};

// TODO:
// Atm only increments, otherwise toggle pinned
export const togglePinned = async (jobId: string) => {
  updateDoc(doc(jobsCollectionRef, jobId), {
    numberOfPins: increment(1),
  });
};
