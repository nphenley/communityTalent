import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { useContext, useState } from 'react';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from '_types/Profile';
import ToggleField from '_styled/ToggleField';

type CreateProfileViewProps = {
  communityId: string;
};

// TODO:
// More Fitting Input Fields
const CreateProfileView = (props: CreateProfileViewProps) => {
  const connectionData = useContext(ConnectionContext);

  const { control, register, unregister, handleSubmit } =
    useForm<Partial<Profile>>();

  const onSubmit: SubmitHandler<Partial<Profile>> = async (data: any) => {
    // createProfile({
    //   ...data,
    //   communityId: props.communityId,
    //   walletAddresses: [connectionData!.address],
    // } as Partial<Profile>);
    console.log(data);
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
        <SkillsInput
          control={control}
          unregister={unregister}
          register={register}
        />
        <OptionalWrapper
          label='Experience'
          reset={unregister}
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
          reset={unregister}
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
          reset={unregister}
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
          reset={unregister}
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
  maxLength?: number;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row items-center px-2'>
      <label className='sm:w-1/3 text-primary text-center'>{props.label}</label>
      <textarea
        className='w-full sm:w-fit grow h-60 sm:h-40 p-5 bg-backgroundDark rounded-lg resize-none'
        placeholder={props.label}
        maxLength={props.maxLength ? props.maxLength : 300}
        {...props.register(props.name)}
      />
    </div>
  );
};

type OptionalWrapperProps = {
  fieldComponent: any;
  reset: any;
  onShowField?: any;
  label: string;
};
const OptionalWrapper = (props: OptionalWrapperProps) => {
  const [isFieldShown, setIsFieldShown] = useState(false);

  const hideField = () => {
    props.reset();
    setIsFieldShown(false);
  };

  const showField = () => {
    setIsFieldShown(true);
    if (props.onShowField) props.onShowField();
  };

  return (
    <div className='relative'>
      {isFieldShown ? (
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
          onClick={showField}
          className='border-dashed border-2 border-backgroundLight rounded-lg p-6 text-center hover:cursor-pointer font-bold text-backgroundLight'
        >
          + {props.label}
        </div>
      )}
    </div>
  );
};

type SkillsInputProps = {
  unregister: any;
  register: any;
  control: any;
};
const SkillsInput = (props: SkillsInputProps) => {
  const { fields, append, remove } = useFieldArray({
    control: props.control,
    name: 'skills',
  });

  const addField = () => {
    if (fields.length > 20) return;
    append(`Skill ${fields.length + 1}`);
  };

  const removeField = () => {
    if (fields.length <= 1) return;
    remove(fields.length - 1);
  };

  const fieldComponent = (
    <div className='flex flex-col gap-1'>
      {fields.map((field, index) => (
        <InputField
          key={field.id}
          register={props.register}
          label={index === 0 ? 'Skills' : ''}
          name={`skills.${index}`}
        />
      ))}

      <div className='mt-2 text-primary flex justify-center gap-2'>
        <button
          className='font-bold px-3 py-1 bg-backgroundDark rounded-lg'
          onClick={addField}
          type='button'
        >
          +
        </button>
        <button
          className='font-bold px-3 py-1 bg-backgroundDark rounded-lg'
          onClick={removeField}
          type='button'
        >
          -
        </button>
      </div>
    </div>
  );

  return (
    <OptionalWrapper
      label='Skills'
      reset={remove}
      onShowField={() => append('Skill 1')}
      fieldComponent={fieldComponent}
    />
  );
};
