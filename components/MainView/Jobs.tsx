import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/SideBar/JobCard';
import PlusCard from 'components/MainView/PlusCard';
import JobPosting from './JobPosting';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const jobsCollectionRef = collection(db, 'jobs');

  useEffect(() => {
    const getJobs = async () => {
      const data = await getDocs(
        query(jobsCollectionRef, orderBy('dateCreated', 'desc'))
      );
      setJobs(
        data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    };
    getJobs();
  }, []);

  const [addJob, setAddJob] = useState(false);

  return (
    <div className='relative grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
      <button className='absolute' onClick={() => setAddJob(!addJob)}>
        <PlusCard></PlusCard>
      </button>

      {addJob ? <JobPosting></JobPosting> : null}

      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          title={job.title}
          user={job.user}
          description={job.description}
          tags={job.tags}
        />
      ))}
    </div>
  );
};

export default Jobs;
