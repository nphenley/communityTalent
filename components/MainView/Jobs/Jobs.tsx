import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/MainView/Jobs/JobCard';
import PlusCard from 'components/MainView/PlusCard';
import JobPosting from 'components/MainView/Jobs/JobPosting';
import { Job } from 'types/Job';
import { useContext } from 'react';
import { WalletContext } from 'contexts/WalletContext';

const Jobs = () => {
  const [addJob, setAddJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pins, setPins] = useState<string[]>([]);
  const jobsCollectionRef = collection(db, 'jobs');
  const pinsCollectionRef = collection(db, 'pins');

  const walletData = useContext(WalletContext);

  useEffect(() => {
    if (!walletData?.address) return;

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
        query(pinsCollectionRef, where('user', '==', walletData!.address))
      );
      let pins: string[] = [];
      userPins.docs.map((doc) => pins.push(doc.data().job));
      setPins(pins);
    };
    getPins();
    getJobs();
  }, [walletData]);

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
