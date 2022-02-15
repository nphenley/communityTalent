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
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/MainView/Jobs/JobCard';
import PlusButton from 'components/MainView/PlusButton';
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

  // TODO:
  // Atm only increments, otherwise toggle pinned
  const togglePinned = (jobId: string) => {
    updateDoc(doc(jobsCollectionRef, jobId), {
      numberOfPins: increment(1),
    });
  };

  const createJob = (event: any) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id || currentValue.checked)
        accumulator[currentValue.id] = currentValue.value;
      return accumulator;
    }, {});

    setDoc(doc(db, 'jobs', 'othertest'), {
      dateCreated: Timestamp.now(),
      title: formData.title,
      description: formData.description,
      user: walletData?.address,
      tags: [false, true, false],
    });
  };

  return (
    <div className='relative grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <button className='absolute' onClick={() => setAddJob(!addJob)}>
        <PlusButton />
      </button>

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
