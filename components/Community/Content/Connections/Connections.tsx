import InfoCard from 'components/Community/Content/InfoCard';

const Connections = () => {
  return (
    <div className='grid grid-cols-3 gap-2 p-2'>
      <InfoCard user='user1'></InfoCard>
      <InfoCard user='user2'></InfoCard>
      <InfoCard user='user3'></InfoCard>
    </div>
  );
};

export default Connections;
