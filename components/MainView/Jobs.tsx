import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
} from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/SideBar/JobCard';
import PlusCard from 'components/MainView/PlusCard';
import JobPosting from './JobPosting';
import { useMoralis } from 'react-moralis';
import { Job } from 'types/job';
const Jobs = () => {
  const { user } = useMoralis();
  const [addJob, setAddJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const jobsCollectionRef = collection(db, 'jobs');
  const pinsCollectionRef = collection(db, 'pins');

  useEffect(() => {
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
          where('user', '==', user.attributes.ethAddress)
        )
      );
      let pins: string[] = [];
      userPins.docs.map((doc) => pins.push(doc.data().job));
      setPins(pins);
    };
    getPins();
    getJobs();
  }, []);

  return (
    <div className='relative grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <button className='absolute' onClick={() => setAddJob(!addJob)}>
        <PlusCard />
      </button>

      {addJob ? <JobPosting /> : null}

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
        />
      ))}
    </div>
  );
};

export default Jobs;
