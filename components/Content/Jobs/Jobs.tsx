import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  increment,
} from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/Content/Jobs/JobCard';
import PlusButton from 'components/Content/Jobs/PlusButton';
import JobPosting from 'components/Content/Jobs/JobPosting';
import { Job } from 'types/Job';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';

const Jobs = () => {
  const [addJob, setAddJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const jobsCollectionRef = collection(db, 'jobs');
  const pinsCollectionRef = collection(db, 'pins');

  const connectionData = useContext(ConnectionContext);

  useEffect(() => {
    if (!connectionData?.wallet.address) return;

    const getJobs = async () => {
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
    const getPins = async () => {
      const userPins = await getDocs(
        query(
          pinsCollectionRef,
          where('user', '==', connectionData!.wallet.address)
        )
      );
      let pins: string[] = [];
      userPins.docs.map((doc) => pins.push(doc.data().job));
      setPins(pins);
    };
    getPins();
    getJobs();
  }, [connectionData]);

  // TODO:
  // Atm only increments, otherwise toggle pinned
  const togglePinned = (jobId: string) => {
    updateDoc(doc(jobsCollectionRef, jobId), {
      numberOfPins: increment(1),
    });
  };

  const createJob = () => {
    console.log('create job');
  };

  return (
    <div className='relative grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <PlusButton onClick={() => setAddJob(!addJob)} />

      {addJob ? <JobPosting createJob={createJob} /> : null}

      {jobs.map((job) => (
        <JobCard
          key={job.id}
          id={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
          numberOfPins={job.numberOfPins}
          isUserPinned={pins.includes(job.id)}
          togglePinned={togglePinned}
        />
      ))}
    </div>
  );
};

export default Jobs;
