import { useForm } from 'react-hook-form';
import { Timestamp, addDoc, collection } from 'firebase/firestore';
import { db } from '_firebase/config';
import 'firebase/firestore';
import { useContext } from 'react';
import { WalletContext } from 'contexts/WalletContext';

const Profile = () => {
  const walletData = useContext(WalletContext);

  const { register, handleSubmit } = useForm();

  const createProfile = (data: any) => {
    addDoc(collection(db, 'profiles'), {
      dateCreated: Timestamp.now(),
      experience: data.experience,
      languages: data.languages,
      user: walletData?.address,
      connections: data.connections,
      lfWork: data.lfWork,
    });
  };

  return (
    <div className='flex flex-col items-center m-3 border-4 border-gray-900 shadow-lg'>
      <div className='mt-4 '>
        <form onSubmit={handleSubmit(createProfile)}>
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
