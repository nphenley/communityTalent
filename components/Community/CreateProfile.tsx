import { SubmitHandler, useForm } from 'react-hook-form';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';
import ToggleField from 'styled/ToggleField';

type CreateProfileViewProps = {
  communityId: string;
  setConnectionData: any;
};

// TODO:
// Optional fields
// Larger Text Area for Bio, Experience, Connections
// Relevant Links
const CreateProfileView = (props: CreateProfileViewProps) => {
  const connectionData = useContext(ConnectionContext);

  const { register, handleSubmit } = useForm<Partial<Profile>>();

  const onSubmit: SubmitHandler<Partial<Profile>> = async (data: any) => {
    const profile: Profile = {
      ...data,
      communityId: props.communityId,
      walletAddresses: [connectionData!.wallet.address],
    };
    const profileId = await createProfile(profile);
    props.setConnectionData({ ...connectionData, profileId: profileId });
  };

  return (
    <div className='flex justify-center bg-background grow'>
      <form
        className='flex flex-col w-full max-w-screen-sm p-6 mt-16 text-white'
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className='mb-12 text-3xl text-primary font-bold text-center'>
          Create Profile
        </h1>
        <p className='mb-12 text-center'>
          This is your first time connecting with this wallet, please create a
          profile.
        </p>

        <div className='flex flex-col gap-6'>
          <InputField
            register={register}
            label='Display Name'
            name='displayName'
          />
          <LargeInputField register={register} label='Bio' name='bio' />
          <ToggleField
            register={register}
            label='Looking for Work'
            name='lookingForWork'
          />
          <input
            className='p-4 bg-primary rounded-lg hover:bg-primaryLight hover:cursor-pointer'
            type='submit'
          />
        </div>
      </form>
    </div>
  );
};

export default CreateProfileView;

type InputFieldProps = {
  register: any;
  label: string;
  name: string;
};

const InputField = (props: InputFieldProps) => {
  return (
    <div className='flex flex-col gap-3 sm:flex-row items-center sm:gap-6'>
      <label>{props.label}</label>
      <input
        className='grow p-3 bg-gray-600 text-white rounded-lg'
        placeholder={props.label}
        {...props.register(props.name)}
      />
    </div>
  );
};

type LargeInputFieldProps = {
  register: any;
  label: string;
  name: string;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-3'>
      <label>{props.label}</label>
      <textarea
        className='grow w-full h-60 sm:h-40 p-5 bg-gray-600 text-white rounded-lg resize-none'
        placeholder={props.label}
        maxLength={300}
        {...props.register(props.name)}
      />
    </div>
  );
};
