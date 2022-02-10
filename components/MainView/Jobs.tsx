import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '_firebase/config';
import JobCard from 'components/SideBar/JobCard';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const jobsCollectionRef = collection(db, 'jobs');

  useEffect(() => {
    const getJobs = async () => {
      const data = await getDocs(jobsCollectionRef);
      setJobs(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getJobs();
  }, []);

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 p-2'>
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
