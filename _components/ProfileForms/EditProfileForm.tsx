import { useFieldArray, useForm, useFormState } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import {
  getFormOptions,
  updateCommunityProfile,
  updateDefaultProfile,
} from '_api/profiles';
import { Profile } from '_types/Profile';
import ToggleField from '_styled/Forms/ToggleField';
import { CommunityContext } from '_contexts/CommunityContext';
import SelectField from '_styled/Forms/SelectField';
import InputField from '_styled/Forms/InputField';
import FormField from '_styled/Forms/FormField';
import LargeInputField from '_styled/Forms/LargeInputField';
import OptionalFormFieldWrapper from '_styled/Forms/OptionalFormFieldWrapper';
import OptionalArrayInputField from '_styled/Forms/OptionalArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import { ProfileType } from '_enums/ProfileType';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';
import { ProfilePicField } from '_styled/Forms/ProfilePicField';
import { getNftImagesForCommunityProfile } from '_helpers/getUserNfts';
import { getLinkedWallets } from '_api/walletGroups';

type EditProfileFormProps = {
  profile: Profile;
  type: ProfileType;
  setEdit?: any;
  onSubmit?: any;
};

const EditProfileForm = (props: EditProfileFormProps) => {
  let communityId: string;
  if (props.type === ProfileType.COMMUNITY) {
    communityId = useContext(CommunityContext);
  }
  const [linkedWallets, setLinkedWallets] = useState();
  const [userNftImages, setUserNftImages] = useState();
  const [selectFieldOptions, setSelectFieldOptions] = useState<any>();
  const { control, register, handleSubmit } = useForm<any>({
    defaultValues: {
      tags: props.profile.tags ? props.profile.tags : [],
      skills: props.profile.skills ? props.profile.skills : [],
      relevantLinks: props.profile.relevantLinks
        ? props.profile.relevantLinks
        : [],
      timezone: props.profile.timezone ? props.profile.timezone : '',
    },
  });

  if (props.type === ProfileType.COMMUNITY) {
    useEffect(() => {
      if (!linkedWallets) return;
      getNftImagesForCommunityProfile(
        linkedWallets,
        communityId,
        setUserNftImages
      );
    }, [linkedWallets]);
  }

  useEffect(() => {
    getFormOptions(setSelectFieldOptions);
    getLinkedWallets(props.profile.id, setLinkedWallets);
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
  const [showContacts, setShowContacts] = useState(
    props.profile.contacts ? true : false
  );
  const [showLinks, setShowLinks] = useState(
    props.profile.relevantLinks && props.profile.relevantLinks.length
      ? true
      : false
  );
  const [showTimezone, setShowTimezone] = useState(
    props.profile.timezone ? true : false
  );

  let onSubmit: any;
  let title: any;

  switch (props.type) {
    case ProfileType.COMMUNITY:
      onSubmit = async (data: any) => {
        for (const property in data)
          if (!dirtyFields[property]) delete data[property];

        if (!showSkills) data.skills = [];
        if (!showExperience) data.experience = '';
        if (!showLanguages) data.languages = [];
        if (!showContacts) data.contacts = '';
        if (!showLinks) data.relevantLinks = [];
        if (!showTimezone) data.timezone = '';

        updateCommunityProfile(communityId, props.profile.id!, data);
        props.setEdit(false);
      };

      title = (
        <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
          Update Community Profile
        </h1>
      );

      break;

    case ProfileType.DEFAULT:
      onSubmit = async (data: any) => {
        if (!showSkills) data.skills = [];
        if (!showExperience) data.experience = '';
        if (!showLanguages) data.languages = [];
        if (!showContacts) data.contacts = '';
        if (!showLinks) data.relevantLinks = [];
        if (!showTimezone) data.timezone = '';

        updateDefaultProfile(props.profile.id, data);
        props.onSubmit();
      };

      title = (
        <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
          Update Default Profile
        </h1>
      );
      break;
  }

  return (
    <div className='flex flex-col items-center w-full pt-12 pb-16 overflow-y-scroll grow bg-background'>
      <form
        className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0'
        onSubmit={handleSubmit(onSubmit)}
      >
        {title}
        <FormField
          label='Display Name'
          formField={
            <InputField
              register={register}
              placeholder='Display Name'
              name='displayName'
              defaultValue={props.profile.displayName}
              required={true}
              maxLength={34}
            />
          }
        />
        {props.type === ProfileType.COMMUNITY ? (
          <FormField
            label='Profile Pic'
            formField={
              <ProfilePicField
                control={control}
                defaultValue={props.profile.profilePic}
                name='profilePic'
                register={register}
                userNftImages={userNftImages ? userNftImages : []}
              />
            }
          />
        ) : null}

        <FormField
          label='Bio'
          formField={
            <LargeInputField
              register={register}
              placeholder='Bio'
              name='bio'
              defaultValue={props.profile.bio}
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
              defaultChecked={props.profile.lookingForProject}
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
              defaultValues={props.profile.tags ? props.profile.tags : []}
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
                  defaultValue={props.profile.discordUsername}
                  required={true}
                  maxLength={37}
                />
              }
            />
          }
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
                  defaultValue={props.profile.twitterHandle}
                  required={true}
                  maxLength={16}
                />
              }
            />
          }
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
                  defaultValue={
                    props.profile.timezone ? props.profile.timezone : ''
                  }
                  name='timezone'
                />
              }
            />
          }
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
                  required={false}
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
                  defaultValue={
                    props.profile.experience ? props.profile.experience : ''
                  }
                  required={false}
                  maxLength={500}
                />
              }
            />
          }
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
                  defaultValues={
                    props.profile.languages ? props.profile.languages : []
                  }
                />
              }
            />
          }
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
                  defaultValue={
                    props.profile.contacts ? props.profile.contacts : ''
                  }
                  required={false}
                  maxLength={500}
                />
              }
            />
          }
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
                  required={false}
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

export default EditProfileForm;
