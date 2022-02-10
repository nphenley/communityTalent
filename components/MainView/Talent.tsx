import InfoCard from 'components/SideBar/InfoCard';

const Talent = () => {
	return (
		<div className='grid grid-flow-col auto-cols-max'>
			<InfoCard user='user1'></InfoCard>
			<InfoCard user='user2'></InfoCard>
			<InfoCard user='user3'></InfoCard>
		</div>
	);
};

export default Talent;
