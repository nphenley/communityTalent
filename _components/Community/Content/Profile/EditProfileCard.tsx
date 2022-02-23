import { useForm } from 'react-hook-form';
import StyledToggleField from '_styled/StyledToggleField';
import { Profile } from '_types/Profile';
import { editProfile } from '_firebase/APIRequests';

type EditProfileCardProps = {
  profile: Profile;
  setEdit: any;
};

const EditProfileCard = (props: EditProfileCardProps) => {
  const { register, handleSubmit } = useForm<Partial<Profile>>();

  const onSubmit = async (data: any) => {
    await editProfile(props.profile!.id!, data);
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
        className='p-2 mt-2 mb-4 bg-backgroundDark text-cyan-50'
        {...register('displayName', { required: 'required' })}
      />

      <label>Bio</label>
      <input
        defaultValue={props.profile.bio}
        className='p-2 mt-2 mb-6 bg-backgroundDark text-cyan-50'
        {...register('bio')}
      />

      <StyledToggleField
        register={register}
        label='Looking for Work'
        name='lookingForWork'
        defaultChecked={props.profile.lookingForWork}
      />

      <input
        className='p-4 mt-4 bg-primary hover:bg-primaryLight hover:cursor-pointer'
        type='submit'
      />
    </form>
  );
};

export default EditProfileCard;
