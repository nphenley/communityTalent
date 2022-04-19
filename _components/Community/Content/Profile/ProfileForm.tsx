import { useFieldArray, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { createOrUpdateCommunityProfile } from '_api/profiles';
import { Profile } from '_types/Profile';
import ToggleField from '_styled/Forms/ToggleField';
import SelectField from '_styled/Forms/SelectField';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import LargeInputField from '_styled/Forms/LargeInputField';
import OptionalFormFieldWrapper from '_styled/Forms/OptionalFormFieldWrapper';
import OptionalArrayInputField from '_styled/Forms/OptionalArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';
import LoadingSpinner from '_styled/LoadingSpinner';
import { getProfileFormOptions } from '_api/selectOptions';
import { SelectOption } from '_types/SelectOption';
import { CommunityContext } from '_contexts/CommunityContext';
import { ImageSelectField } from '_styled/Forms/ImageSelectField';
import { WalletGroupContext } from '_contexts/WalletGroupContext';
import { NFTImagesContext } from '_contexts/NFTImagesContext';

type ProfileFormProps = {
  profile?: Profile;
  publicProfile?: Profile;
  onSubmit?: () => void;
};

type ProfileFormSelectOptions = {
  languages: SelectOption[];
  tags: SelectOption[];
  timezones: SelectOption[];
};

const ProfileForm = (props: ProfileFormProps) => {
  const walletGroupID = useContext(WalletGroupContext);
  const communityId = useContext(CommunityContext);
  const imageOptions = useContext(NFTImagesContext);

  const { control, register, unregister, handleSubmit, reset } = useForm<any>();

  const [loadingProfileFormSelectOptions, setLoadingProfileFormSelectOptions] = useState(true);
  const [profileFormSelectOptions, setProfileFormSelectOptions] = useState<ProfileFormSelectOptions>();

  const [profile, setProfile] = useState<Profile | undefined>(props.profile);

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
  const [showLinks, setShowLinks] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);

  useEffect(() => {
    getProfileFormOptions((profileFormSelectOptions: ProfileFormSelectOptions) => {
      setProfileFormSelectOptions(profileFormSelectOptions);
      setLoadingProfileFormSelectOptions(false);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;
    if (profile.discordUsername) setShowDiscord(true);
    if (profile.twitterHandle) setShowTwitter(true);
    if (profile.skills && profile.skills.length) setShowSkills(true);
    if (profile.experience) setShowExperience(true);
    if (profile.languages && profile.languages.length) setShowLanguages(true);
    if (profile.relevantLinks && profile.relevantLinks.length) setShowLinks(true);
    if (profile.timezone) setShowTimezone(true);
    reset(profile);
  }, [profile]);

  const onSubmit = async (data: any) => {
    if (!showDiscord) data.discordUsername = '';
    if (!showTwitter) data.twitterHandle = '';
    if (!showTimezone) data.timezone = '';
    if (!showSkills) data.skills = [];
    if (!showExperience) data.experience = '';
    if (!showLanguages) data.languages = [];
    if (!showLinks) data.relevantLinks = [];

    for (const property in data) if (data[property] === undefined) data[property] = [];
    if (data.twitterHandle && !data.twitterHandle.startsWith('@')) {
      data.twitterHandle = '@' + data.twitterHandle;
    }
    data.relevantLinks.forEach((link: string) => {
      if (!link.startsWith('https://')) {
        const index = data.relevantLinks.indexOf(link);
        data.relevantLinks[index] = 'https://' + link;
      }
    });
    createOrUpdateCommunityProfile(walletGroupID, communityId, data);
    props.onSubmit && props.onSubmit();
  };

  let title;
  let description;
  let importProfileButton;

  if (!profile) {
    title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Create Profile</h1>;
    description = (
      <p className='mb-4 text-center'>This is your first time connecting to this community, please create a profile.</p>
    );
  } else {
    title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Edit Profile</h1>;
    description = (
      <p className='mb-4 text-center'>
        You currently have a profile in this community, please edit it at your leisure.
      </p>
    );
  }

  if (props.publicProfile?.id) {
    title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Create Profile</h1>;
    description = (
      <p className='mb-4 text-center'>
        This is your first time connecting to this community, please create a profile. Would you like to import your
        public profile?
      </p>
    );

    importProfileButton = (
      <button
        onClick={() => setProfile(props.publicProfile)}
        className='p-2 text-white border-2 rounded-lg bg-primary hover:border-primaryDark hover:cursor-pointer'
        type='button'
      >
        Import
      </button>
    );
  }

  return (
    <div className='flex'>
      {loadingProfileFormSelectOptions ? (
        <LoadingSpinner />
      ) : (
        <form className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0' onSubmit={handleSubmit(onSubmit)}>
          {title}
          {description}
          {importProfileButton}

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
            label='Profile Picture'
            formField={
              <ImageSelectField
                control={control}
                defaultValue={profile ? profile.profilePicture : undefined}
                name='profilePicture'
                imageOptions={imageOptions}
              />
            }
          />
          <FormField
            label='Bio'
            formField={
              <LargeInputField register={register} placeholder='Bio' name='bio' required={true} maxLength={160} />
            }
          />
          <FormField
            label='Looking For Project'
            formField={<ToggleField register={register} label='Looking for Project' name='lookingForProject' />}
          />
          <FormField
            label='Tags'
            formField={
              <SelectField
                control={control}
                label='Tags'
                options={profileFormSelectOptions!.tags}
                name='tags'
                defaultValues={profile ? profile.tags : undefined}
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
                  <InputField register={register} placeholder='Twitter Handle' name='twitterHandle' maxLength={16} />
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
                    options={profileFormSelectOptions!.timezones}
                    name='timezone'
                    defaultValue={profile ? profile.timezone : undefined}
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
                  <InputField register={register} placeholder={'Skill'} name={`skills.${index}`} maxLength={50} />
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
                  <LargeInputField register={register} placeholder='Experience' name='experience' maxLength={500} />
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
                    options={profileFormSelectOptions!.languages}
                    name='languages'
                    defaultValues={profile && profile.languages ? profile.languages : []}
                  />
                }
              />
            }
            onHideField={() => unregister('languages')}
            isFieldShown={showLanguages}
            setIsFieldShown={setShowLanguages}
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
                    maxLength={80}
                  />
                }
              />
            ))}
            isFieldShown={showLinks}
            setIsFieldShown={setShowLinks}
          />
          <FormSubmit />
        </form>
      )}
    </div>
  );
};

export default ProfileForm;
