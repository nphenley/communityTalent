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
} from 'firebase/firestore';
import { Job } from 'types/Job';
import { Profile } from 'types/Profile';

const jobsCollectionRef = collection(firestore, 'jobs');
const pinsCollectionRef = collection(firestore, 'pins');
const profileCollectionRef = collection(firestore, 'profiles');

// ============== PROFILE ==============

export const createProfile = (profile: Profile) => {
  addDoc(collection(firestore, 'profiles'), {
    ...profile,
    dateCreated: Timestamp.now(),
    dateLastUpdated: Timestamp.now(),
  });
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

export const getProfileId = async (walletAddress: string) => {
  const profileId = await getDocs(
    query(
      profileCollectionRef,
      where('walletAddresses', 'array-contains', walletAddress)
    )
  );
  return profileId.docs[0].id;
};

// TODO:
// Atm only increments, otherwise toggle pinned
export const togglePinned = async (jobId: string) => {
  updateDoc(doc(jobsCollectionRef, jobId), {
    numberOfPins: increment(1),
  });
};
