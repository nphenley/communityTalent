import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

import JobCard from 'components/SideBar/JobCard';

initializeApp({
	apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
	authDomain: 'talent-d15b4.firebaseapp.com',
	projectId: 'talent-d15b4',
	storageBucket: 'talent-d15b4.appspot.com',
	messagingSenderId: '691000709770',
	appId: '1:691000709770:web:71617ce4d81358cdd35373',
});

const db = getFirestore();

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
		<div className='flex'>
			{jobs.map((job) => (
				<JobCard
					key={job.id}
					title={job.title}
					user={job.user}
					description={job.description}
					tags={job.tags}
				></JobCard>
			))}
		</div>
	);
};

export default Jobs;
