import { useFieldArray, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { ConnectionContext } from '_contexts/ConnectionContext';
import {
  createProfile,
  getFormOptions,
  importDefaultProfileToCommunity,
  updateDefaultProfile,
} from '_api/profiles';
import { Profile } from '_types/Profile';
import ToggleField from '_styled/Forms/ToggleField';
import { CommunityContext } from '_contexts/CommunityContext';
import SelectField from '_styled/Forms/SelectField';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import LargeInputField from '_styled/Forms/LargeInputField';
import OptionalFormFieldWrapper from '_styled/Forms/OptionalFormFieldWrapper';
import OptionalArrayInputField from '_styled/Forms/OptionalArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import { ProfileType } from '_enums/ProfileType';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';

type CreateProfileFormProps = {
  type: ProfileType;
  existingDefaultProfile?: Profile;
  walletAddress?: string;
  setIsShowingProfile?: any;
};

const CreateProfileForm = (props: CreateProfileFormProps) => {
  const connectionData = useContext(ConnectionContext);
  const communityId = useContext(CommunityContext);

  const { control, register, unregister, handleSubmit } = useForm();
  const [selectFieldOptions, setSelectFieldOptions] = useState<any>();

  useEffect(() => {
    if (selectFieldOptions) return;
    getFormOptions(setSelectFieldOptions);
  }, []);
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

  const [showDiscord, setShowDiscord] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showLinks, setShowLinks] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);

  let onSubmit: any;
  let title: any;
  let description: any;

  switch (props.type) {
    case ProfileType.Community:
      onSubmit = async (data: any) => {
        for (const property in data)
          if (
            data[property] === undefined ||
            data[property] === '' ||
            (Array.isArray(data[property]) && !data[property].length)
          )
            delete data[property];
        createProfile(communityId, {
          ...data,
          walletAddress: connectionData!.address,
        } as Profile);
      };
      description = props.existingDefaultProfile ? (
        <div className='flex flex-row-reverse items-center gap-4 mb-4 text-center'>
          <button
            onClick={() =>
              importDefaultProfileToCommunity(
                communityId,
                props.existingDefaultProfile!
              )
            }
            className='px-3 py-2 font-bold text-white rounded-lg bg-primary'
          >
            Import
          </button>
          Would you like to import your default profile?
        </div>
      ) : (
        <p className='mb-4 text-center'>
          This is your first time connecting with this wallet, please create a
          profile.
        </p>
      );
      title = (
        <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
          Create Community Profile
        </h1>
      );
      break;
    case ProfileType.Default:
      onSubmit = async (data: any) => {
        for (const property in data)
          if (
            data[property] === undefined ||
            data[property] === '' ||
            (Array.isArray(data[property]) && !data[property].length)
          )
            delete data[property];
        updateDefaultProfile(props.walletAddress!, { ...data } as Profile);
        props.setIsShowingProfile(false);
      };

      description = (
        <p className='mb-4 text-center'>
          This is your default profile. When joining a new community, you will
          be able to easily import it.
        </p>
      );
      title = (
        <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
          Create Default Profile
        </h1>
      );
      break;
  }

  title = (
    <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
      Create Profile
    </h1>
  );

  return (
    <div className='flex flex-col items-center pt-12 pb-16 overflow-y-scroll grow bg-background'>
      <form
        className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        {title}
        {description}
        <FormField
          label='Display Name'
          formField={
            <InputField
              register={register}
              placeholder='Display Name'
              name='displayName'
              required={true}
              maxLength={34}
            />
          }
        />
        <FormField
          label='Bio'
          formField={
            <LargeInputField
              register={register}
              placeholder='Bio'
              name='bio'
              required={true}
              maxLength={160}
            />
          }
        />
        <FormField
          label='Looking For Project'
          formField={
            <ToggleField
              register={register}
              label='Looking for Project'
              name='lookingForProject'
            />
          }
        />
        <FormField
          label='Tags'
          formField={
            <SelectField
              control={control}
              label='Tags'
              options={selectFieldOptions?.tags}
              name='tags'
            />
          }
        />
        <OptionalFormFieldWrapper
          label='Discord Username'
          formField={
            <FormField
              label='Discord Username'
              formField={
                <InputField
                  register={register}
                  placeholder='Discord Username'
                  name='discordUsername'
                  maxLength={37}
                />
              }
            />
          }
          onHideField={() => unregister('discordUsername')}
          isFieldShown={showDiscord}
          setIsFieldShown={setShowDiscord}
        />
        <OptionalFormFieldWrapper
          label='Twitter Handle'
          formField={
            <FormField
              label='Twitter Handle'
              formField={
                <InputField
                  register={register}
                  placeholder='Twitter Handle'
                  name='twitterHandle'
                  maxLength={16}
                />
              }
            />
          }
          onHideField={() => unregister('twitterHandle')}
          isFieldShown={showTwitter}
          setIsFieldShown={setShowTwitter}
        />
        <OptionalFormFieldWrapper
          label='Timezone'
          formField={
            <FormField
              label='Timezone'
              formField={
                <SelectFieldSingle
                  control={control}
                  label='Timezone'
                  options={selectFieldOptions?.timezones}
                  name='timezone'
                />
              }
            />
          }
          onHideField={() => unregister('timezone')}
          isFieldShown={showTimezone}
          setIsFieldShown={setShowTimezone}
        />
        <OptionalArrayInputField
          label='Skills'
          fieldName='Skill'
          fields={skillsFields}
          append={skillsAppend}
          remove={skillsRemove}
          isFieldShown={showSkills}
          setIsFieldShown={setShowSkills}
          fieldComponents={skillsFields.map((field, index) => (
            <FormField
              key={field.id}
              label={index === 0 ? 'Skills' : ''}
              formField={
                <InputField
                  register={register}
                  placeholder={'Skill'}
                  name={`skills.${index}`}
                  maxLength={50}
                />
              }
            />
          ))}
        />
        <OptionalFormFieldWrapper
          label='Experience'
          formField={
            <FormField
              label='Experience'
              formField={
                <LargeInputField
                  register={register}
                  placeholder='Experience'
                  name='experience'
                  maxLength={500}
                />
              }
            />
          }
          onHideField={() => unregister('experience')}
          isFieldShown={showExperience}
          setIsFieldShown={setShowExperience}
        />
        <OptionalFormFieldWrapper
          label='Languages'
          formField={
            <FormField
              label='Languages'
              formField={
                <SelectField
                  control={control}
                  label='Languages'
                  options={selectFieldOptions?.languages}
                  name='languages'
                />
              }
            />
          }
          onHideField={() => unregister('languages')}
          isFieldShown={showLanguages}
          setIsFieldShown={setShowLanguages}
        />
        <OptionalFormFieldWrapper
          label='Contacts'
          formField={
            <FormField
              label='Contacts'
              formField={
                <LargeInputField
                  register={register}
                  placeholder='Contacts'
                  name='contacts'
                  maxLength={500}
                />
              }
            />
          }
          onHideField={() => unregister('contacts')}
          isFieldShown={showContacts}
          setIsFieldShown={setShowContacts}
        />
        <OptionalArrayInputField
          label='Relevant Links'
          fieldName='Link'
          fields={relevantLinksFields}
          append={relevantLinksAppend}
          remove={relevantLinksRemove}
          fieldComponents={relevantLinksFields.map((field, index) => (
            <FormField
              key={field.id}
              label={index === 0 ? 'Relevant Links' : ''}
              formField={
                <InputField
                  register={register}
                  placeholder={'Relevant Link'}
                  name={`relevantLinks.${index}`}
                  maxLength={50}
                />
              }
            />
          ))}
          isFieldShown={showLinks}
          setIsFieldShown={setShowLinks}
        />
        <FormSubmit />
      </form>
    </div>
  );
};

export default CreateProfileForm;
