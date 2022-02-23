import { useContext, useState } from 'react';
import { Profile } from '_types/Profile';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import EditProfileCard from '_components/Community/Content/Profile/EditProfileCard';
import { ProfileContext } from '_contexts/ProfileContext';

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const profile = useContext(ProfileContext);

  const profileView = (
    <div className='flex flex-col items-center w-full'>
      <ProfileCard profile={profile!} alwaysExpanded={true} />
      <button
        onClick={() => setEdit(true)}
        className='mt-8 w-20 p-4 bg-primary hover:bg-primaryLight hover:cursor-pointer'
      >
        Edit
      </button>
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      {!edit ? (
        profileView
      ) : (
        <EditProfileCard profile={profile!} setEdit={setEdit} />
      )}
    </div>
  );
};

export default Profile;
