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
    <div className='flex justify-center grow bg-gray-800'>
      <form
        className='mt-16 text-cyan-50 flex flex-col max-w-screen-sm w-full p-4'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className='text-center font-bold mb-12 text-3xl'>Create Profile</h1>
        <p className='mb-12 text-center'>
          This is your first time connecting with this wallet, please create a
          profile.
        </p>

        <label>Experience</label>
        <input
          className='bg-gray-600 p-2 text-cyan-50 mt-2 mb-4 '
          {...register('experience')}
        />

        <label>Languages</label>
        <input
          className='bg-gray-600 p-2 mt-2 mb-4 text-cyan-50'
          {...register('languages')}
        />

        <label>Connections</label>
        <input
          className='bg-gray-600 p-2 mt-2 mb-6 text-cyan-50'
          {...register('connections')}
        />

        <div className='flex gap-2 items-center'>
          <label>Looking for work?</label>
          <input
            className='text-black'
            type='checkbox'
            {...register('lfWork')}
          />
        </div>

        <input
          className='bg-cyan-900 p-4 mt-4 hover:bg-cyan-500 hover:cursor-pointer'
          type='submit'
        />
      </form>
    </div>
  );
};

export default CreateProfileView;
