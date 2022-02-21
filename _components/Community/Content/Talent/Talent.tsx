import InfoCard from '_components/Community/Content/InfoCard';

const Talent = () => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      <InfoCard user='user1'></InfoCard>
      <InfoCard user='user2'></InfoCard>
      <InfoCard user='user3'></InfoCard>
    </div>
  );
};

export default Talent;
