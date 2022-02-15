import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';

const Profile = () => {
  const connectionData = useContext(ConnectionContext);

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    createProfile({
      ...data,
      walletAddresses: [connectionData?.wallet.address],
    } as Profile);
  };

  return (
    <div className='flex flex-col items-center m-3 border-4 border-gray-900 shadow-lg'>
      <div className='mt-4 '>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Experience</label>
          <input className='block text-black' {...register('experience')} />

          <label>Languages</label>
          <input className='block text-black' {...register('languages')} />

          <label>Connections</label>
          <input className='block text-black' {...register('connections')} />

          <label>Looking for work?</label>
          <input
            className='block text-black'
            type='checkbox'
            {...register('lfWork')}
          />

          <input type='submit' />
        </form>
      </div>
    </div>
  );
};

export default Profile;
