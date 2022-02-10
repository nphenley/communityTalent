import InfoCard from 'components/SideBar/InfoCard';

const Connections = () => {
	return (
		<div className='flex'>
			<InfoCard user='user1'></InfoCard>
			<InfoCard user='user2'></InfoCard>
			<InfoCard user='user3'></InfoCard>
		</div>
	);
};

export default Connections;
