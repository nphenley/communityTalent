import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';
import { useMoralis } from 'react-moralis';

type CreateProfileViewProps = {
  communityId: string;
  setConnectionData: any;
};

const CreateProfileView = (props: CreateProfileViewProps) => {
  const connectionData = useContext(ConnectionContext);
  const { logout } = useMoralis();

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
    <div className='flex flex-col items-center'>
      <button onClick={logout}>Disconnect</button>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Experience</label>
        <input className='text-black' {...register('experience')} />

        <label>Languages</label>
        <input className=' text-black' {...register('languages')} />

        <label>Connections</label>
        <input className='text-black' {...register('connections')} />

        <label>Looking for work?</label>
        <input className='text-black' type='checkbox' {...register('lfWork')} />

        <input type='submit' />
      </form>
    </div>
  );
};

export default CreateProfileView;
