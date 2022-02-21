import { useContext, useState } from 'react';
import { Profile } from '_types/Profile';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import EditProfileCard from '_components/Community/Content/Profile/EditProfileCard';
import { ProfileContext } from '_contexts/ProfileContext';

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const profile = useContext(ProfileContext);

  return (
    <div className='flex flex-col items-center'>
      <div className='mt-4 '>
        {!edit ? (
          <ProfileCard profile={profile!} setEdit={setEdit} />
        ) : (
          <EditProfileCard profile={profile!} setEdit={setEdit} />
        )}
      </div>
    </div>
  );
};

export default Profile;
