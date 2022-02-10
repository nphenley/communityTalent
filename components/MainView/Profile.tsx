import InfoCard from "components/SideBar/InfoCard";

const Profile = () => {
  return (
    <div className="flex">
      <InfoCard user="user1"></InfoCard>
      <InfoCard user="user2"></InfoCard>
      <InfoCard user="user3"></InfoCard>
    </div>
  );
};

export default Profile;
