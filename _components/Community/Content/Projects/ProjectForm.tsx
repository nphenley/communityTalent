import { createProject } from '_firebase/APIRequests';
import { useForm } from 'react-hook-form';
import { Project } from '_types/Project';
import { useContext } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';
import { Tags } from '_enums/Tags';
import { CommunityContext } from '_contexts/CommunityContext';
import SelectField from '_styled/Forms/SelectField';

type ProjectFormProps = {
  setAddProject: any;
};

const ProjectForm = (props: ProjectFormProps) => {
  const communityId = useContext(CommunityContext);
  const profile = useContext(ProfileContext);

  const { control, register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    createProject(communityId, {
      ...data,
      walletAddress: profile!.walletAddress,
    } as Project);
    props.setAddProject(false);
  };

  const title = (
    <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
      Create Project Posting
    </h1>
  );

  return (
    <div className='fixed'>
      <div className='flex flex-col items-center pt-12 pb-16 px-4 overflow-y-scroll border-4 rounded-lg shadow-lg border-backgroundDark grow bg-background'>
        <form
          className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0'
          onSubmit={handleSubmit(onSubmit)}
        >
          {title}
          <InputField
            register={register}
            label='Title'
            name='title'
            required={true}
            maxLength={34}
          />
          <LargeInputField
            register={register}
            label='Description'
            name='description'
            required={true}
            maxLength={160}
          />
          <SelectField
            control={control}
            label='Tags'
            options={tagsOptions}
            name='tags'
          />

          <input
            className='p-4 rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer'
            type='submit'
          />
        </form>
      </div>
    </div>
  );
};
export default ProjectForm;

type InputFieldProps = {
  register: any;
  label: string;
  name: string;
  required: boolean;
  maxLength: number;
};

const InputField = (props: InputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 focus:outline-none sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <input
        className='w-full p-3 rounded-lg sm:w-fit grow bg-backgroundDark'
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
  required: boolean;
  maxLength?: number;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <textarea
        className='w-full p-5 rounded-lg resize-none sm:w-fit grow h-60 sm:h-40 bg-backgroundDark'
        placeholder={props.label}
        maxLength={props.maxLength ? props.maxLength : 300}
        {...props.register(props.name)}
      />
    </div>
  );
};

const tagsOptions = Object.keys(Tags).map((key) => {
  return {
    value: (Tags as any)[key],
    label: (Tags as any)[key],
  };
});
