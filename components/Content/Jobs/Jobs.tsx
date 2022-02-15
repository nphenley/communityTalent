import { useEffect, useState, useContext } from 'react';
import { Job } from 'types/Job';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { getJobs, getPins, togglePinned } from '_firebase/APIRequests';
import JobCard from 'components/Content/Jobs/JobCard';
import PlusButton from 'components/Content/Jobs/PlusButton';
import JobForm from 'components/Content/Jobs/JobForm';

const Jobs = () => {
  const [addJob, setAddJob] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [pins, setPins] = useState<string[]>([]);

  const connectionData = useContext(ConnectionContext);

  useEffect(() => {
    getPins(connectionData!.wallet.address, setPins);
    getJobs(setJobs);
  }, [connectionData]);

  return (
    <div className={styles.container}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isUserPinned={pins.includes(job.id)}
          togglePinned={() => togglePinned(job.id)}
        />
      ))}

      {addJob ? <JobForm /> : null}
      <PlusButton onClick={() => setAddJob(!addJob)} />
    </div>
  );
};

export default Jobs;

const styles = {
  container:
    'relative grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
};
