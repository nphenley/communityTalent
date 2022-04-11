import { createProject } from '_api/projects';
import { useForm } from 'react-hook-form';
import { Project } from '_types/Project';
import { useContext, useEffect, useState } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';
import { CommunityContext } from '_contexts/CommunityContext';
import SelectField from '_styled/Forms/SelectField';
import { getProjectFormOptions } from '_api/selectOptions';
import FormSubmit from '_styled/Forms/FormSubmit';
import ToggleField from '_styled/Forms/ToggleField';
import FormField from '_styled/Forms/FormField';
import LargeInputField from '_styled/Forms/LargeInputField';
import InputField from '_styled/Forms/InputField';

type ProjectFormProps = {
  setAddProject: any;
  setProjects: any;
};

const ProjectForm = (props: ProjectFormProps) => {
  const communityId = useContext(CommunityContext);
  const profile = useContext(ProfileContext);

  const { control, register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    createProject(
      communityId,
      {
        ...data,
        walletGroupID: profile!.id,
        displayName: profile?.displayName,
        admin: profile?.admin,
      } as Project,
      props.setProjects
    );
    props.setAddProject(false);
  };

  const [selectFieldOptions, setSelectFieldOptions] = useState<any>();

  useEffect(() => {
    if (selectFieldOptions) return;
    getProjectFormOptions(setSelectFieldOptions);
  }, []);

  const title = <h1 className='mb-4 text-3xl font-bold text-center text-primary'>Create Project Posting</h1>;

  return (
    <div className='fixed'>
      <div className='flex flex-col items-center px-4 pt-12 pb-16 overflow-y-scroll border-4 rounded-lg shadow-lg grow border-backgroundDark bg-background'>
        <form className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0' onSubmit={handleSubmit(onSubmit)}>
          {title}
          <FormField
            label='Title'
            formField={
              <InputField register={register} placeholder='Title' name='title' required={true} maxLength={60} />
            }
          />
          <FormField
            label='Description'
            formField={
              <LargeInputField
                register={register}
                placeholder='Description'
                name='description'
                required={true}
                maxLength={160}
              />
            }
          />
          <FormField
            label='Tags'
            formField={<SelectField control={control} label='Tags' options={selectFieldOptions?.tags} name='tags' />}
          />
          <FormField label='Hiring' formField={<ToggleField register={register} label='Hiring' name='hiring' />} />
          <FormSubmit />
        </form>
      </div>
    </div>
  );
};
export default ProjectForm;
