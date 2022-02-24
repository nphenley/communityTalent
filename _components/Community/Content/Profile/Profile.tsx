import { useContext, useState } from 'react';
import { Profile } from '_types/Profile';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import EditProfileView from '_components/Community/Content/Profile/EditProfileView';
import { ProfileContext } from '_contexts/ProfileContext';

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const profile = useContext(ProfileContext);

  const editButton = (
    <button
      onClick={() => setEdit(true)}
      className='mx-auto w-20 py-3 px-1 bg-primaryDark rounded-lg hover:bg-primary hover:cursor-pointer'
    >
      Edit
    </button>
  );

  const profileView = (
    <div className='grid grid-cols-1 overflow-y-scroll max-w-screen-md w-full gap-4 py-4'>
      {editButton}
      <ProfileCard profile={profile!} alwaysExpanded={true} />
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      {!edit ? (
        profileView
      ) : (
        <EditProfileView profile={profile!} setEdit={setEdit} />
      )}
    </div>
  );
};

export default Profile;
