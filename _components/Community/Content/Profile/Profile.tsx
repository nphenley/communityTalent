import { useContext, useState } from 'react';
import { Profile } from '_types/Profile';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import { ProfileContext } from '_contexts/ProfileContext';
import ProfileForm from '_components/Community/Content/Profile/ProfileForm';

const Profile = () => {
  const [edit, setEdit] = useState(false);

  const profile = useContext(ProfileContext);

  const editButton = (
    <button
      onClick={() => setEdit(true)}
      className='w-20 px-1 py-3 mx-auto rounded-lg bg-primaryDark hover:bg-primary hover:cursor-pointer'
    >
      Edit
    </button>
  );

  const profileView = (
    <div className='grid w-full max-w-screen-md grid-cols-1 gap-4 py-4 overflow-y-scroll'>
      {editButton}
      <ProfileCard profile={profile!} alwaysExpanded={true} />
    </div>
  );

  return (
    <div className='flex flex-col items-center justify-center h-full'>
      {!edit ? profileView : <ProfileForm profile={profile} onSubmit={() => setEdit(false)} />}
    </div>
  );
};

export default Profile;
