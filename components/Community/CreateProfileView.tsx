import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';

type CreateProfileViewProps = {
  communityId: string;
  setConnectionData: any;
};

const CreateProfileView = (props: CreateProfileViewProps) => {
  const connectionData = useContext(ConnectionContext);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const profileId = await createProfile({
      ...data,
      communityId: props.communityId,
      walletAddresses: [connectionData!.wallet.address],
    } as Profile);
    props.setConnectionData({ ...connectionData, profileId: profileId });
  };

  return (
    <div className='flex justify-center bg-gray-800 grow'>
      <form
        className='flex flex-col w-full max-w-screen-sm p-4 mt-16 text-cyan-50'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className='mb-12 text-3xl font-bold text-center'>Create Profile</h1>
        <p className='mb-12 text-center'>
          This is your first time connecting with this wallet, please create a
          profile.
        </p>

        <label>Experience</label>
        <input
          className='p-2 mt-2 mb-4 bg-gray-600 text-cyan-50 '
          {...register('experience')}
        />

        <label>Languages</label>
        <input
          className='p-2 mt-2 mb-4 bg-gray-600 text-cyan-50'
          {...register('languages')}
        />

        <label>Connections</label>
        <input
          className='p-2 mt-2 mb-6 bg-gray-600 text-cyan-50'
          {...register('connections')}
        />

        <div className='flex items-center gap-2'>
          <label>Looking for work?</label>
          <input
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
    </div>
  );
};

export default CreateProfileView;
