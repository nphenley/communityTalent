import { useFieldArray, useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import { createProject, updateProject } from '_api/projects';
import SelectField from '_styled/Forms/SelectField';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import LargeInputField from '_styled/Forms/LargeInputField';
import OptionalFormFieldWrapper from '_styled/Forms/OptionalFormFieldWrapper';
import OptionalArrayInputField from '_styled/Forms/OptionalArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import LoadingSpinner from '_styled/LoadingSpinner';
import { getProjectFormOptions } from '_api/selectOptions';
import { SelectOption } from '_types/SelectOption';
import { CommunityContext } from '_contexts/CommunityContext';
import { WalletGroupContext } from '_contexts/WalletGroupContext';
import { Project } from '_types/Project';
import { ProfileContext } from '_contexts/ProfileContext';

type ProjectFormProps = {
  project?: Project;
  onSubmit?: () => void;
};

type ProjectFormSelectOptions = {
  languages: SelectOption[];
  tags: SelectOption[];
  timezones: SelectOption[];
};

const ProjectForm = (props: ProjectFormProps) => {
  const walletGroupID = useContext(WalletGroupContext);
  const communityId = useContext(CommunityContext);
  const profile = useContext(ProfileContext);

  const { control, register, unregister, handleSubmit, reset } = useForm<any>();

  const [loadingProjectFormSelectOptions, setLoadingProjectFormSelectOptions] = useState(true);
  const [projectFormSelectOptions, setProjectFormSelectOptions] = useState<ProjectFormSelectOptions>();

  const {
    fields: skillsFields,
    append: skillsAppend,
    remove: skillsRemove,
  } = useFieldArray({
    control: control,
    name: 'skills',
  });

  const [showDiscord, setShowDiscord] = useState(false);
  const [showTwitter, setShowTwitter] = useState(false);
  const [showSkills, setShowSkills] = useState(false);
  const [showExperience, setShowExperience] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  useEffect(() => {
    getProjectFormOptions((projectFormSelectOptions: ProjectFormSelectOptions) => {
      setProjectFormSelectOptions(projectFormSelectOptions);
      setLoadingProjectFormSelectOptions(false);
    });
  }, []);

  useEffect(() => {
    if (!props.project) return;
    if (props.project.discordContact) setShowDiscord(true);
    if (props.project.twitterContact) setShowTwitter(true);
    if (props.project.skills && props.project.skills.length) setShowSkills(true);
    if (props.project.description) setShowExperience(true);
    if (props.project.languages && props.project.languages.length) setShowLanguages(true);
    reset(props.project);
  }, [props.project]);

  const onSubmit = async (data: any) => {
    if (!showDiscord) data.discordUsername = '';
    if (!showTwitter) data.twitterHandle = '';
    if (!showSkills) data.skills = [];
    if (!showExperience) data.experience = '';
    if (!showLanguages) data.languages = [];

    for (const property in data) if (data[property] === undefined) data[property] = [];

    if (props.project) {
      await updateProject(communityId, props.project.id, {
        ...data,
        walletGroupID: walletGroupID,
        creatorDisplayName: profile!.displayName,
      });
    } else {
      await createProject(communityId, {
        ...data,
        upvotes: 1,
        walletGroupID: walletGroupID,
        creatorDisplayName: profile!.displayName,
      });
    }
    props.onSubmit && props.onSubmit();
  };

  let title;

  if (!props.project) {
    title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Create Project</h1>;
  } else {
    title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Edit Project</h1>;
  }

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      {loadingProjectFormSelectOptions ? (
        <LoadingSpinner />
      ) : (
        <form className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0' onSubmit={handleSubmit(onSubmit)}>
          {title}

          <FormField
            label='Role'
            formField={<InputField register={register} placeholder='Role' name='role' required={true} maxLength={34} />}
          />
          <FormField
            label='Description'
            formField={
              <LargeInputField
                register={register}
                placeholder='Description'
                name='description'
                required={true}
                maxLength={200}
              />
            }
          />
          <OptionalFormFieldWrapper
            label='Discord Contact'
            formField={
              <FormField
                label='Discord Contact'
                formField={
                  <InputField register={register} placeholder='Discord Contact' name='discordContact' maxLength={37} />
                }
              />
            }
            onHideField={() => unregister('discordContact')}
            isFieldShown={showDiscord}
            setIsFieldShown={setShowDiscord}
          />
          <OptionalFormFieldWrapper
            label='Twitter Contact'
            formField={
              <FormField
                label='Twitter Contact'
                formField={
                  <InputField register={register} placeholder='Twitter Contact' name='twitterContact' maxLength={16} />
                }
              />
            }
            onHideField={() => unregister('twitterContact')}
            isFieldShown={showTwitter}
            setIsFieldShown={setShowTwitter}
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
            label='Languages'
            formField={
              <FormField
                label='Languages'
                formField={
                  <SelectField
                    control={control}
                    label='Languages'
                    options={projectFormSelectOptions!.languages}
                    name='languages'
                    defaultValues={props.project && props.project.languages ? props.project.languages : []}
                  />
                }
              />
            }
            onHideField={() => unregister('languages')}
            isFieldShown={showLanguages}
            setIsFieldShown={setShowLanguages}
          />
          <FormSubmit />
        </form>
      )}
    </div>
  );
};

export default ProjectForm;

const styles = {
  container:
    'relative bg-background rounded-lg shadow-lg p-12 flex flex-col items-center gap-6 overflow-y-scroll max-h-[88%] w-full',
};
