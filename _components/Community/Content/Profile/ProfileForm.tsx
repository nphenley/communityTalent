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
import { getCommunityNFTImagesForWalletGroup } from '_helpers/getNFTImages';

type ProfileFormProps = {
  profile?: Profile;
  onSubmit?: () => void;
};

type ProfileFormSelectOptions = {
  languages: SelectOption[];
  tags: SelectOption[];
  timezones: SelectOption[];
};

const ProfileForm = (props: ProfileFormProps) => {
  const communityId = useContext(CommunityContext);
  const walletGroupID = useContext(WalletGroupContext);

  const { control, register, unregister, handleSubmit, reset } = useForm<any>();

  const [loadingProfileFormSelectOptions, setLoadingProfileFormSelectOptions] = useState(true);
  const [profileFormSelectOptions, setProfileFormSelectOptions] = useState<ProfileFormSelectOptions>();

  const [loadingImageOptions, setLoadingImageOptions] = useState(true);
  const [imageOptions, setImageOptions] = useState<string[]>([]);

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

  useEffect(() => {
    getProfileFormOptions((profileFormSelectOptions: ProfileFormSelectOptions) => {
      setProfileFormSelectOptions(profileFormSelectOptions);
      setLoadingProfileFormSelectOptions(false);
    });

    getCommunityNFTImagesForWalletGroup(walletGroupID, communityId, (images: string[]) => {
      setImageOptions(images);
      setLoadingImageOptions(false);
    });
  }, []);

  useEffect(() => {
    if (!props.profile) return;
    if (props.profile.discordUsername) setShowDiscord(true);
    if (props.profile.twitterHandle) setShowTwitter(true);
    if (props.profile.skills && props.profile.skills.length) setShowSkills(true);
    if (props.profile.experience) setShowExperience(true);
    if (props.profile.languages && props.profile.languages.length) setShowLanguages(true);
    if (props.profile.contacts) setShowContacts(true);
    if (props.profile.relevantLinks && props.profile.relevantLinks.length) setShowLinks(true);
    if (props.profile.timezone) setShowTimezone(true);
    reset(props.profile);
  }, [props.profile]);

  const onSubmit = async (data: any) => {
    if (!showDiscord) data.discordUsername = '';
    if (!showTwitter) data.twitterHandle = '';
    if (!showTimezone) data.timezone = '';
    if (!showSkills) data.skills = [];
    if (!showExperience) data.experience = '';
    if (!showLanguages) data.languages = [];
    if (!showContacts) data.contacts = '';
    if (!showLinks) data.relevantLinks = [];

    for (const property in data) if (data[property] === undefined) data[property] = [];

    createOrUpdateCommunityProfile(walletGroupID, communityId, data);
    props.onSubmit && props.onSubmit();
  };

  const title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Create Profile</h1>;

  const description = <p className='mb-4 text-center'>This is your first time connecting to this community, please create a profile.</p>;

  return (
    <div className='flex flex-col items-center'>
      {loadingProfileFormSelectOptions || loadingImageOptions ? (
        <LoadingSpinner />
      ) : (
        <form className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0' onSubmit={handleSubmit(onSubmit)}>
          {title}
          {description}

          <FormField
            label='Display Name'
            formField={<InputField register={register} placeholder='Display Name' name='displayName' required={true} maxLength={34} />}
          />
          <FormField
            label='Profile Picture'
            formField={
              <ImageSelectField
                control={control}
                defaultValue={props.profile ? props.profile.profilePicture : undefined}
                name='profilePicture'
                register={register}
                imageOptions={imageOptions}
              />
            }
          />
          <FormField
            label='Bio'
            formField={<LargeInputField register={register} placeholder='Bio' name='bio' required={true} maxLength={160} />}
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
                defaultValues={props.profile ? props.profile.tags : undefined}
              />
            }
          />
          <OptionalFormFieldWrapper
            label='Discord Username'
            formField={
              <FormField
                label='Discord Username'
                formField={<InputField register={register} placeholder='Discord Username' name='discordUsername' maxLength={37} />}
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
                formField={<InputField register={register} placeholder='Twitter Handle' name='twitterHandle' maxLength={16} />}
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
                    defaultValue={props.profile ? props.profile.timezone : undefined}
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
                formField={<InputField register={register} placeholder={'Skill'} name={`skills.${index}`} maxLength={50} />}
              />
            ))}
          />
          <OptionalFormFieldWrapper
            label='Experience'
            formField={
              <FormField
                label='Experience'
                formField={<LargeInputField register={register} placeholder='Experience' name='experience' maxLength={500} />}
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
                    defaultValues={props.profile && props.profile.languages ? props.profile.languages : []}
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
                formField={<LargeInputField register={register} placeholder='Contacts' name='contacts' maxLength={500} />}
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
                formField={<InputField register={register} placeholder={'Relevant Link'} name={`relevantLinks.${index}`} maxLength={50} />}
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
