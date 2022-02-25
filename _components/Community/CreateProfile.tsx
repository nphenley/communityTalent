import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import { useContext, useState } from 'react';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { createProfile } from '_firebase/APIRequests';
import { Profile } from '_types/Profile';
import StyledToggleField from '_styled/StyledToggleField';
import Select from 'react-select';
import { Tags } from '_enums/Tags';
import { Languages } from '_enums/Languages';

type CreateProfileViewProps = {
  communityId: string;
};

// TODO:
// \n in strings not saved to database correctly.

// Note:
// useFieldArray() is for arrays of objects, not arrays of primitive types.
// Bit weird and strange and kind of shitty, seems to work fine though.
const CreateProfileView = (props: CreateProfileViewProps) => {
  const connectionData = useContext(ConnectionContext);

  const { control, register, unregister, handleSubmit } = useForm();

  const {
    fields: skillsFields,
    append: skillsAppend,
    remove: skillsRemove,
  } = useFieldArray({
    control: control,
    name: 'skills',
  });

  const {
    fields: relevantLinksFields,
    append: relevantLinksAppend,
    remove: relevantLinksRemove,
  } = useFieldArray({
    control: control,
    name: 'relevantLinks',
  });

  const onSubmit: SubmitHandler<Partial<Profile>> = async (data: any) => {
    createProfile({
      ...data,
      communityId: props.communityId,
      walletAddresses: [connectionData!.address],
    } as Partial<Profile>);
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

  const tagsOptions = Object.keys(Tags).map((key) => {
    return {
      value: (Tags as any)[key],
      label: (Tags as any)[key],
    };
  });

  const languagesOptions = Object.keys(Languages).map((key) => {
    return {
      value: (Languages as any)[key],
      label: (Languages as any)[key],
    };
  });

  return (
    <div className='flex flex-col items-center grow bg-background overflow-y-auto pt-12 pb-16'>
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
        <StyledToggleField
          register={register}
          label='Looking for Work'
          name='lookingForWork'
        />
        <SelectField
          control={control}
          label='Tags'
          options={tagsOptions}
          name='tags'
        />
        <ArrayInput
          label='Skills'
          fieldName='Skill'
          fields={skillsFields}
          append={skillsAppend}
          remove={skillsRemove}
          fieldComponents={skillsFields.map((field, index) => (
            <InputField
              key={field.id}
              register={register}
              label={index === 0 ? 'Skills' : ''}
              name={`skills.${index}`}
            />
          ))}
        />
        <OptionalWrapper
          label='Experience'
          reset={() => unregister('experience')}
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
          reset={() => unregister('languages')}
          fieldComponent={
            <SelectField
              control={control}
              label='Languages'
              options={languagesOptions}
              name='languages'
            />
          }
        />
        <OptionalWrapper
          label='Connections'
          reset={() => unregister('connections')}
          fieldComponent={
            <LargeInputField
              register={register}
              label='Connections'
              name='connections'
            />
          }
        />
        <ArrayInput
          label='Relevant Links'
          fieldName='Link'
          fields={relevantLinksFields}
          append={relevantLinksAppend}
          remove={relevantLinksRemove}
          fieldComponents={relevantLinksFields.map((field, index) => (
            <InputField
              key={field.id}
              register={register}
              label={index === 0 ? 'Relevant Links' : ''}
              name={`relevantLinks.${index}`}
            />
          ))}
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
          className='mx-2 border-dashed border-2 border-backgroundLight rounded-lg p-6 text-center hover:cursor-pointer font-bold text-backgroundLight'
        >
          + {props.label}
        </div>
      )}
    </div>
  );
};

type ArrayInputProps = {
  fieldName: string;
  label: string;
  fields: any;
  append: any;
  remove: any;
  fieldComponents: any;
};
const ArrayInput = (props: ArrayInputProps) => {
  const addField = () => {
    if (props.fields.length > 20) return;
    props.append(`${props.fieldName} ${props.fields.length + 1}`);
  };

  const removeField = () => {
    if (props.fields.length <= 1) return;
    props.remove(props.fields.length - 1);
  };

  const fieldComponent = (
    <div className='flex flex-col gap-1'>
      {props.fieldComponents}
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
      label={props.label}
      reset={props.remove}
      onShowField={() => props.append(`${props.fieldName} 1`)}
      fieldComponent={fieldComponent}
    />
  );
};

// Using react-select, so can only style <Select /> without tailwind, in globals.css
type SelectFieldProps = {
  control: any;
  name: string;
  label: string;
  options: any;
};
const SelectField = (props: SelectFieldProps) => {
  const onValueChange = (e: any, onChange: any) => {
    let values = [];
    for (const obj of e) values.push(obj.value);
    return onChange(values);
  };

  return (
    <div className='flex flex-col gap-4 sm:gap-0 sm:flex-row items-center px-2'>
      <label className='sm:w-1/3 text-primary text-center'>{props.label}</label>

      <Controller
        control={props.control}
        name={props.name}
        render={({ field: { onChange } }) => (
          <Select
            className='grow'
            classNamePrefix='profile-form'
            onChange={(e) => onValueChange(e, onChange)}
            options={props.options}
            isMulti
          />
        )}
      />
    </div>
  );
};