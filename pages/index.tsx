import { useEffect, useState } from 'react';
import {
	FaIdCard,
	FaNetworkWired,
	FaBriefcase,
	FaUser,
	FaBars,
	FaArrowLeft,
} from 'react-icons/fa';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';

import JobCard from 'components/SideBar/JobCard';
import InfoCard from 'components/SideBar/InfoCard';
import SideBar from 'components/SideBar/SideBar';

initializeApp({
	apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
	authDomain: 'talent-d15b4.firebaseapp.com',
	projectId: 'talent-d15b4',
	storageBucket: 'talent-d15b4.appspot.com',
	messagingSenderId: '691000709770',
	appId: '1:691000709770:web:71617ce4d81358cdd35373',
});

const db = getFirestore();

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);
	const [toggleState, setToggleState] = useState(1);
	const toggleTab = (index) => {
		setToggleState(index);
		console.log(toggleState);
	};

	const [isConnected, setIsConnected] = useState(false);

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
		<div className='flex h-full '>
			{!isOpen ? (
				<button
					onClick={() => setIsOpen(!isOpen)}
					className='fixed top-0 right-0 pr-5'
				>
					<FaBars size='20' />
				</button>
			) : null}

			<SideBar isOpen={isOpen} setIsOpen={setIsOpen} toggleTab={toggleTab} />

			<div className='flex-grow'>
				<div className='py-4 text-xl text-center bg-gray-900 text-cyan-400'>
					Neo Tokyo Directory
					<button
						onClick={() => setIsConnected(true)}
						className={`absolute top-5 right-8 text-base ${
							isConnected ? 'hidden' : 'block'
						}`}
					>
						Connect
					</button>
					<button
						onClick={() => setIsConnected(false)}
						className={`absolute top-5 right-8 text-base ${
							isConnected ? 'block' : 'hidden'
						}`}
					>
						Connected
					</button>
				</div>

				{!isConnected ? (
					<div
						className={`flex bg-gray-800 h-screen text-xl ${
							isConnected ? 'hidden' : 'block'
						}`}
					>
						<div className='m-auto'>nada</div>
					</div>
				) : (
					<div
						className={`bg-gray-800 text-cyan-50 ${
							toggleState === 1 ? 'block' : 'hidden'
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
						toggleState === 2 && isConnected ? 'block' : 'hidden'
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
						toggleState === 3 && isConnected ? 'block' : 'hidden'
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
						toggleState === 4 && isConnected ? 'block' : 'hidden'
					}`}
				>
					profile
				</div>
			</div>
		</div>
	);
}
