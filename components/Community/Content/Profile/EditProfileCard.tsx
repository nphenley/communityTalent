import { ConnectionContext } from 'contexts/ConnectionContext';
import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { Profile } from 'types/Profile';
import { editProfile } from '_firebase/APIRequests';

type EditProfileCardProps = {
  profile: Profile;
  getProfile: any;
  setEdit: any;
};

const EditProfileCard = (props: EditProfileCardProps) => {
  const connectionData = useContext(ConnectionContext);

  const { register, handleSubmit } = useForm<Partial<Profile>>();

  const onSubmit = async (data: any) => {
    await editProfile(connectionData?.profileId!, data);
    await props.getProfile();
    props.setEdit(false);
  };

  return (
    <form
      className='flex flex-col w-full max-w-screen-sm p-4 mt-16 text-cyan-50'
      onSubmit={handleSubmit(onSubmit)}
    >
      <label>Display Name</label>
      <input
        defaultValue={props.profile.displayName}
        className='p-2 mt-2 mb-4 bg-gray-600 text-cyan-50'
        {...register('displayName', { required: 'required' })}
      />

      <label>Bio</label>
      <input
        defaultValue={props.profile.bio}
        className='p-2 mt-2 mb-6 bg-gray-600 text-cyan-50'
        {...register('bio')}
      />

      <div className='flex items-center gap-2'>
        <label>Looking for work?</label>
        <input
          defaultChecked={props.profile.lookingForWork}
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
  );
};

export default EditProfileCard;
