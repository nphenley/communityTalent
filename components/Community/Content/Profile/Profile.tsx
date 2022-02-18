import { useForm } from 'react-hook-form';
import { useContext, useState, useEffect, useMemo } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { editProfile, getUserProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';
import { communityId } from 'hardcoded';
import ProfileView from 'components/Community/Content/Profile/ProfileView';

interface FormInputs {
  experience: string;
  languages: string;
  connections: string;
  lookingForWork: boolean;
}

const Profile = () => {
  const connectionData = useContext(ConnectionContext);
  const [profile, setProfile] = useState<Profile>();
  const [edit, setEdit] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  useEffect(() => {
    getUserProfile(communityId, connectionData?.wallet.address!, setProfile);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setLoadingProfile(false);
  }, [profile]);

  const onSubmit = async (data: any) => {
    if (!profile) {
      return;
    }
    if (!data.experience) {
      data.experience = profile.experience;
    }
    if (!data.languages) {
      data.languages = profile.languages;
    }
    if (!data.connections) {
      data.connections = profile.connections;
    }

    const profileId = await editProfile(connectionData?.profileId!, {
      ...data,
      communityId: profile.communityId,
      dateCreated: profile.dateCreated,
      walletAddresses: profile.walletAddresses,
    } as Profile);

    getUserProfile(communityId, connectionData?.wallet.address!, setProfile);
    setEdit(false);
  };

  return (
    <div className='flex flex-col items-center p-3'>
      <div className='mt-4 '>
        {loadingProfile ? (
          <div>Loading</div>
        ) : !edit ? (
          <ProfileView
            experience={profile!.experience}
            connections={profile!.connections}
            languages={profile!.languages}
            lookingForWork={profile!.lookingForWork}
            setEdit={setEdit}
          />
        ) : (
          <form
            className='flex flex-col w-full max-w-screen-sm p-4 mt-16 text-cyan-50'
            onSubmit={handleSubmit(onSubmit)}
          >
            <label>Experience</label>
            <input
              defaultValue={profile!.experience}
              className='p-2 mt-2 mb-4 bg-gray-600 text-cyan-50'
              {...register('experience', {
                required: 'Field is required',
              })}
            />

            <label>Languages</label>
            <input
              defaultValue={profile!.languages}
              className='p-2 mt-2 mb-4 bg-gray-600 text-cyan-50'
              {...register('languages', { required: 'required' })}
            />

            <label>Connections</label>
            <input
              defaultValue={profile!.connections}
              className='p-2 mt-2 mb-6 bg-gray-600 text-cyan-50'
              {...register('connections')}
            />

            <div className='flex items-center gap-2'>
              <label>Looking for work?</label>
              <input
                defaultChecked={profile!.lookingForWork}
                className='text-black'
                type='checkbox'
                {...register('lookingForWork')}
              />
            </div>

            <input
              className='p-4 mt-4 bg-cyan-900 hover:bg-cyan-500 hover:cursor-pointer'
              type='submit'
            />
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
