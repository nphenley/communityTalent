import InfoCard from 'components/SideBar/InfoCard';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '_firebase/config';
import 'firebase/firestore';
import { randomBytes } from 'crypto';
import { useMoralis } from 'react-moralis';
const Profile = () => {
  const { user } = useMoralis();
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => {
    setDoc(doc(db, 'profiles', randomBytes(10).toString('hex')), {
      dateCreated: Timestamp.now(),
      experience: data.experience,
      languages: data.languages,
      user: user.attributes.ethAddress,
      connections: data.connections,
      lfWork: data.lfWork,
    });
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
