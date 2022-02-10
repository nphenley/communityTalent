import { useEffect, useState } from 'react';

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

import JobCard from 'components/SideBar/JobCard';
import InfoCard from 'components/SideBar/InfoCard';

initializeApp({
	apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
	authDomain: 'talent-d15b4.firebaseapp.com',
	projectId: 'talent-d15b4',
	storageBucket: 'talent-d15b4.appspot.com',
	messagingSenderId: '691000709770',
	appId: '1:691000709770:web:71617ce4d81358cdd35373',
});

const db = getFirestore();

type MainViewProps = {
	toggleState: number;
	isOpen: boolean;
	setIsOpen: any;
	isConnected: boolean;
	setIsConnected: any;
};

const MainView = (props: MainViewProps) => {
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
		<div className='grow flex justify-center items-center'>
			hey im the main view!
			<br></br>
			toggleState is {props.toggleState} and you are{' '}
			{props.isConnected ? 'connected' : 'not connected'}
			{/* {!props.isConnected ? (
				<div
					className={`flex bg-gray-800 text-xl ${
						props.isConnected ? 'hidden' : 'block'
					}`}
				>
					<div className='m-auto'>nada</div>
				</div>
			) : (
				<div
					className={`bg-gray-800 text-cyan-50 ${
						props.toggleState === 1 ? 'block' : 'hidden'
					}`}
				>
					<div className='grid grid-flow-col auto-cols-max'>
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
				</div>
			)}

			<div
				className={` bg-gray-800 text-cyan-50 ${
					props.toggleState === 2 && props.isConnected ? 'block' : 'hidden'
				}`}
			>
				<div className='grid grid-flow-col auto-cols-max'>
					<InfoCard user='user1'></InfoCard>
					<InfoCard user='user2'></InfoCard>
					<InfoCard user='user3'></InfoCard>
				</div>
			</div>

			<div
				className={` bg-gray-800 text-cyan-50 ${
					props.toggleState === 3 && props.isConnected ? 'block' : 'hidden'
				}`}
			>
				<div className='grid grid-flow-col auto-cols-max'>
					<InfoCard user='user1'></InfoCard>
					<InfoCard user='user2'></InfoCard>
					<InfoCard user='user3'></InfoCard>
				</div>
			</div>

			<div
				className={` bg-gray-800 text-cyan-50 ${
					props.toggleState === 4 && props.isConnected ? 'block' : 'hidden'
				}`}
			>
				profile
			</div> */}
		</div>
	);
};

export default MainView;
