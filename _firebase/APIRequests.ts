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
  onSnapshot,
} from 'firebase/firestore';
import { Job } from '_types/Job';
import { Profile } from '_types/Profile';

const jobsCollectionRef = collection(firestore, 'jobs');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');

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
export const togglePinned = async (jobId: string) => {
  updateDoc(doc(jobsCollectionRef, jobId), {
    numberOfPins: increment(1),
  });
};
