import { SubmitHandler, useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
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

  const { register, unregister, handleSubmit } = useForm<Partial<Profile>>();

  const onSubmit: SubmitHandler<Partial<Profile>> = async (data: any) => {
    console.log(data);
    // const profile: Profile = {
    //   ...data,
    //   communityId: props.communityId,
    //   walletAddresses: [connectionData!.wallet.address],
    // };
    // const profileId = await createProfile(profile);
    // props.setConnectionData({ ...connectionData, profileId: profileId });
  };

  const title = (
    <h1 className='mb-4 text-3xl text-primary font-bold text-center'>
      Create Profile
    </h1>
  );

  const description = (
    <p className='mb-4 text-center'>
      This is your first time connecting with this wallet, please create a
      profile.
    </p>
  );

  return (
    <div className='flex flex-col items-center grow bg-background overflow-y-scroll pt-12 pb-16'>
      <form
        className='flex flex-col w-full gap-8 max-w-screen-sm px-10 sm:px-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        {title}
        {description}
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
        <InputField register={register} label='Tags' name='tags' />
        <OptionalWrapper
          label='Skills'
          unregister={unregister}
          name='skills'
          fieldComponent={
            <LargeInputField register={register} label='Skills' name='skills' />
          }
        />
        <OptionalWrapper
          label='Experience'
          unregister={unregister}
          name='experience'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Experience'
              name='experience'
            />
          }
        />
        <OptionalWrapper
          label='Languages'
          unregister={unregister}
          name='languages'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Languages'
              name='languages'
            />
          }
        />
        <OptionalWrapper
          label='Connections'
          unregister={unregister}
          name='connections'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Connections'
              name='connections'
            />
          }
        />
        <OptionalWrapper
          label='Relevant Links'
          unregister={unregister}
          name='relevantLinks'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Relevant Links'
              name='relevantLinks'
            />
          }
        />
        <input
          className='p-4 bg-primary rounded-lg hover:bg-primaryLight hover:cursor-pointer'
          type='submit'
        />
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
    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row items-center px-2'>
      <label className='sm:w-1/3 text-primary text-center'>{props.label}</label>
      <input
        className='w-full sm:w-fit grow p-3 bg-backgroundDark rounded-lg'
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
    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row items-center px-2'>
      <label className='sm:w-1/3 text-primary text-center'>{props.label}</label>
      <textarea
        className='w-full sm:w-fit grow h-60 sm:h-40 p-5 bg-backgroundDark rounded-lg resize-none'
        placeholder={props.label}
        maxLength={300}
        {...props.register(props.name)}
      />
    </div>
  );
};

type OptionalWrapperProps = {
  fieldComponent: any;
  unregister: any;
  name: string;
  label: string;
};
const OptionalWrapper = (props: OptionalWrapperProps) => {
  const [showField, setShowField] = useState(false);

  const hideField = () => {
    props.unregister(props.name);
    setShowField(false);
  };

  return (
    <div className='relative'>
      {showField ? (
        <>
          {props.fieldComponent}
          <button
            className='absolute -top-2 sm:-top-1 right-5 rounded-lg text-backgroundLight font-bold text-3xl'
            onClick={hideField}
          >
            -
          </button>
        </>
      ) : (
        <div
          onClick={() => setShowField(true)}
          className='border-dashed border-2 border-backgroundLight rounded-lg p-6 text-center hover:cursor-pointer font-bold text-backgroundLight'
        >
          + {props.label}
        </div>
      )}
    </div>
  );
};
