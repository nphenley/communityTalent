import { useContext, useState } from 'react';
import { Profile } from '_types/Profile';
import ExpandedProfileCard from '_components/Community/Content/Profile/ExpandedProfileCard';
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
    <div className='flex flex-col justify-center w-full max-w-screen-lg gap-4 h-full max-h-[98%]'>
      {editButton}
      <ExpandedProfileCard profile={profile!} />
    </div>
  );

  const editProfileView = (
    <div className='pb-20'>
      <ProfileForm profile={profile} onSubmit={() => setEdit(false)} />
    </div>
  );

  return <div className='h-full flex flex-col items-center'>{!edit ? profileView : editProfileView}</div>;
};

export default Profile;
