import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
  useFormState,
} from 'react-hook-form';
import { useState } from 'react';
import { updateProfile } from '_firebase/APIRequests';
import { Profile } from '_types/Profile';
import StyledToggleField from '_styled/StyledToggleField';
import Select from 'react-select';
import { Tags } from '_enums/Tags';
import { Languages } from '_enums/Languages';

type EditProfileViewProps = {
  profile: Profile;
  setEdit: any;
};

// TODO:
// Currently just copied from CreateProfile, should actually make this it's own file.
const EditProfileView = (props: EditProfileViewProps) => {
  const { control, register, handleSubmit } = useForm<any>({
    defaultValues: {
      skills: props.profile.skills ? props.profile.skills : [],
      relevantLinks: props.profile.relevantLinks
        ? props.profile.relevantLinks
        : [],
    },
  });

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

  const { dirtyFields } = useFormState({
    control,
  });

  const [showDiscord, setShowDiscord] = useState(
    props.profile.discordUsername ? true : false
  );
  const [showTwitter, setShowTwitter] = useState(
    props.profile.twitterHandle ? true : false
  );
  const [showSkills, setShowSkills] = useState(
    props.profile.skills && props.profile.skills.length ? true : false
  );
  const [showExperience, setShowExperience] = useState(
    props.profile.experience ? true : false
  );
  const [showLanguages, setShowLanguages] = useState(
    props.profile.languages && props.profile.languages.length ? true : false
  );
  const [showConnections, setShowConnections] = useState(
    props.profile.connections ? true : false
  );
  const [showLinks, setShowLinks] = useState(
    props.profile.relevantLinks && props.profile.relevantLinks.length
      ? true
      : false
  );

  const onSubmit: SubmitHandler<Partial<Profile>> = async (data: any) => {
    for (const property in data)
      if (!dirtyFields[property]) delete data[property];

    if (!showSkills) data.skills = [];
    if (!showExperience) data.experience = '';
    if (!showLanguages) data.languages = [];
    if (!showConnections) data.connections = '';
    if (!showLinks) data.relevantLinks = [];

    updateProfile(props.profile.id, data);
    props.setEdit(false);
  };

  const title = (
    <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
      Update Profile
    </h1>
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
    <div className='flex flex-col items-center w-full pt-12 pb-16 overflow-y-auto grow bg-background'>
      <form
        className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        {title}
        <InputField
          register={register}
          label='Display Name'
          name='displayName'
          defaultValue={props.profile.displayName}
          required={true}
          maxLength={34}
        />
        <LargeInputField
          register={register}
          label='Bio'
          name='bio'
          defaultValue={props.profile.bio}
          required={true}
          maxLength={160}
        />
        <StyledToggleField
          register={register}
          label='Looking for Work'
          name='lookingForWork'
          defaultChecked={props.profile.lookingForWork}
        />
        <SelectField
          control={control}
          label='Tags'
          options={tagsOptions}
          name='tags'
          defaultValues={props.profile.tags ? props.profile.tags : []}
        />
        <OptionalWrapper
          label='Discord Username'
          fieldComponent={
            <InputField
              register={register}
              label='Discord Username'
              name='discordUsername'
              defaultValue={props.profile.discordUsername}
              required={true}
              maxLength={37}
            />
          }
          isFieldShown={showDiscord}
          setIsFieldShown={setShowDiscord}
        />

        <OptionalWrapper
          label='Twitter Handle'
          fieldComponent={
            <InputField
              register={register}
              label='Twitter Handle'
              name='twitterHandle'
              defaultValue={props.profile.twitterHandle}
              required={true}
              maxLength={16}
            />
          }
          isFieldShown={showTwitter}
          setIsFieldShown={setShowTwitter}
        />
        <ArrayInput
          label='Skills'
          fieldName='Skill'
          fields={skillsFields}
          append={skillsAppend}
          remove={skillsRemove}
          isFieldShown={showSkills}
          setIsFieldShown={setShowSkills}
          fieldComponents={skillsFields.map((field, index) => (
            <InputField
              key={field.id}
              register={register}
              label={index === 0 ? 'Skills' : ''}
              name={`skills.${index}`}
              required={false}
              maxLength={50}
            />
          ))}
        />

        <OptionalWrapper
          label='Experience'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Experience'
              name='experience'
              defaultValue={
                props.profile.experience ? props.profile.experience : ''
              }
              required={false}
              maxLength={500}
            />
          }
          isFieldShown={showExperience}
          setIsFieldShown={setShowExperience}
        />

        <OptionalWrapper
          label='Languages'
          fieldComponent={
            <SelectField
              control={control}
              label='Languages'
              options={languagesOptions}
              name='languages'
              defaultValues={
                props.profile.languages ? props.profile.languages : []
              }
            />
          }
          isFieldShown={showLanguages}
          setIsFieldShown={setShowLanguages}
        />
        <OptionalWrapper
          label='Connections'
          fieldComponent={
            <LargeInputField
              register={register}
              label='Connections'
              name='connections'
              defaultValue={
                props.profile.connections ? props.profile.connections : ''
              }
              required={false}
              maxLength={500}
            />
          }
          isFieldShown={showConnections}
          setIsFieldShown={setShowConnections}
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
              required={false}
              maxLength={40}
            />
          ))}
          isFieldShown={showLinks}
          setIsFieldShown={setShowLinks}
        />
        <input
          className='p-4 rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer'
          type='submit'
        />
      </form>
    </div>
  );
};

export default EditProfileView;

type InputFieldProps = {
  register: any;
  label: string;
  name: string;
  defaultValue?: string;
  required: boolean;
  maxLength: number;
};

const InputField = (props: InputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <input
        className='w-full p-3 rounded-lg sm:w-fit grow bg-backgroundDark'
        placeholder={props.label}
        defaultValue={props.defaultValue}
        maxLength={props.maxLength}
        {...props.register(props.name, {
          required: props.required,
          maxLength: props.maxLength,
        })}
      />
    </div>
  );
};

type LargeInputFieldProps = {
  register: any;
  label: string;
  name: string;
  defaultValue: string;
  required: boolean;
  maxLength: number;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <textarea
        className='w-full p-5 rounded-lg resize-none sm:w-fit grow h-60 sm:h-40 bg-backgroundDark'
        placeholder={props.label}
        maxLength={props.maxLength}
        defaultValue={props.defaultValue}
        {...props.register(props.name, {
          required: props.required,
          maxLength: props.maxLength,
        })}
      />
    </div>
  );
};

type OptionalWrapperProps = {
  fieldComponent: any;
  onShowField?: any;
  label: string;
  isFieldShown: boolean;
  setIsFieldShown: any;
};
const OptionalWrapper = (props: OptionalWrapperProps) => {
  const hideField = () => {
    props.setIsFieldShown(false);
  };

  const showField = () => {
    props.setIsFieldShown(true);
    if (props.onShowField) props.onShowField();
  };

  return (
    <div className='relative'>
      {props.isFieldShown ? (
        <>
          {props.fieldComponent}
          <button
            className='absolute text-3xl font-bold rounded-lg -top-2 sm:-top-1 right-5 text-backgroundLight'
            onClick={hideField}
          >
            -
          </button>
        </>
      ) : (
        <div
          onClick={showField}
          className='p-6 mx-2 font-bold text-center border-2 border-dashed rounded-lg border-backgroundLight hover:cursor-pointer text-backgroundLight'
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
  isFieldShown: boolean;
  setIsFieldShown: any;
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
      <div className='flex justify-center gap-2 mt-2 text-primary'>
        <button
          className='px-3 py-1 font-bold rounded-lg bg-backgroundDark'
          onClick={addField}
          type='button'
        >
          +
        </button>
        <button
          className='px-3 py-1 font-bold rounded-lg bg-backgroundDark'
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
      onShowField={() => props.append(`${props.fieldName} 1`)}
      fieldComponent={fieldComponent}
      isFieldShown={props.isFieldShown}
      setIsFieldShown={props.setIsFieldShown}
    />
  );
};

// Using react-select, so can only style <Select /> without tailwind, in globals.css
// Getting default values is sus here too, should be using the enums.
type SelectFieldProps = {
  control: any;
  name: string;
  label: string;
  options: any;
  defaultValues: string[];
};
const SelectField = (props: SelectFieldProps) => {
  const onValueChange = (e: any, onChange: any) => {
    let values = [];
    for (const obj of e) values.push(obj.value);
    return onChange(values);
  };

  const defaultValues = props.defaultValues.map((val) => {
    return {
      value: val,
      label: val,
    };
  });

  return (
    <div className='grid grid-cols-1 items-center sm:grid-cols-3 px-2 space-y-2 -mt-1'>
      <label className='text-center text-primary'>{props.label}</label>
      <div className='col-span-2'>
        <Controller
          control={props.control}
          name={props.name}
          render={({ field: { onChange } }) => (
            <Select
              className='grow'
              classNamePrefix='profile-form'
              onChange={(e) => onValueChange(e, onChange)}
              options={props.options}
              defaultValue={defaultValues}
              isMulti
            />
          )}
        />
      </div>
    </div>
  );
};
