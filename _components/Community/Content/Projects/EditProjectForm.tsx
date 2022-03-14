import { updateProject } from '_api/projects';
import { SubmitHandler, useForm, useFormState } from 'react-hook-form';
import { Project } from '_types/Project';
import { useContext, useEffect, useState } from 'react';
import { CommunityContext } from '_contexts/CommunityContext';
import SelectField from '_styled/Forms/SelectField';
import { getFormOptions } from '_api/profiles';

type EditProjectFormProps = {
  project: Project;
  setEditProject: any;
  editProject: boolean;
};

const EditProjectForm = (props: EditProjectFormProps) => {
  const communityId = useContext(CommunityContext);

  const { control, register, handleSubmit } = useForm();

  const { dirtyFields } = useFormState({
    control,
  });

  const onSubmit: SubmitHandler<Partial<Project>> = async (data: any) => {
    for (const property in data)
      if (!dirtyFields[property]) delete data[property];
    await updateProject(communityId, props.project.id!, data);
    props.setEditProject(false);
  };
  const [selectFieldOptions, setSelectFieldOptions] = useState<any>();

  useEffect(() => {
    if (selectFieldOptions) return;
    getFormOptions(setSelectFieldOptions);
  }, []);

  const title = (
    <h1 className='mb-4 text-center text-3xl font-bold text-primary'>
      Edit Project Posting
    </h1>
  );

  return (
    <div className='fixed top-1/2 left-1/2 z-50 w-2/3 -translate-x-1/2 -translate-y-1/2 '>
      <div className='flex grow flex-col items-center overflow-y-scroll rounded-lg border-4 border-backgroundDark bg-background pt-12 pb-16 shadow-lg'>
        <button
          type='button'
          onClick={() => props.setEditProject(false)}
          className='absolute top-0 right-0'
        >
          x
        </button>
        <form
          className='flex w-full max-w-screen-sm flex-col gap-8 px-10 sm:px-0'
          onSubmit={handleSubmit(onSubmit)}
        >
          {title}
          <InputField
            register={register}
            label='Title'
            name='title'
            required={true}
            defaultValue={props.project.title}
            maxLength={34}
          />
          <LargeInputField
            register={register}
            label='Description'
            name='description'
            required={true}
            defaultValue={props.project.description}
            maxLength={160}
          />
          <SelectField
            control={control}
            label='Tags'
            options={selectFieldOptions?.tags}
            name='tags'
            defaultValues={props.project.tags ? props.project.tags : []}
          />

          <input
            className='rounded-lg bg-primary p-4 hover:cursor-pointer hover:bg-primaryLight'
            type='submit'
          />
        </form>
      </div>
    </div>
  );
};
export default EditProjectForm;

type InputFieldProps = {
  register: any;
  label: string;
  name: string;
  required: boolean;
  defaultValue?: string;
  maxLength: number;
};

const InputField = (props: InputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:flex-row sm:gap-0'>
      <label className='text-center text-primary sm:w-1/3'>{props.label}</label>
      <input
        className='w-full grow rounded-lg bg-backgroundDark p-3 sm:w-fit'
        placeholder={props.label}
        {...props.register(props.name)}
        defaultValue={props.defaultValue}
      />
    </div>
  );
};

type LargeInputFieldProps = {
  register: any;
  label: string;
  name: string;
  required: boolean;
  defaultValue?: string;

  maxLength?: number;
};

const LargeInputField = (props: LargeInputFieldProps) => {
  return (
    <div className='flex flex-col items-center gap-4 px-2 sm:flex-row sm:gap-0'>
      <label className='text-center text-primary sm:w-1/3'>{props.label}</label>
      <textarea
        className='h-60 w-full grow resize-none rounded-lg bg-backgroundDark p-5 sm:h-40 sm:w-fit'
        placeholder={props.label}
        maxLength={props.maxLength ? props.maxLength : 300}
        {...props.register(props.name)}
        defaultValue={props.defaultValue}
      />
    </div>
  );
};
