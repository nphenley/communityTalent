import { updateProject } from '_firebase/APIRequests';
import {
  Controller,
  SubmitHandler,
  useForm,
  useFormState,
} from 'react-hook-form';
import { Project } from '_types/Project';
import Select from 'react-select';

import { Tags } from '_enums/Tags';
import { useContext } from 'react';
import { CommunityContext } from '_contexts/CommunityContext';

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

  const title = (
    <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
      Edit Project Posting
    </h1>
  );

  return (
    <div className='fixed z-50 w-2/3 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 '>
      <div className='flex flex-col items-center pt-12 pb-16 overflow-y-scroll border-4 rounded-lg shadow-lg border-backgroundDark grow bg-background'>
        <button
          type='button'
          onClick={() => props.setEditProject(false)}
          className='absolute top-0 right-0'
        >
          x
        </button>
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
            options={tagsOptions}
            name='tags'
            defaultValues={props.project.tags ? props.project.tags : []}
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
    <div className='flex flex-col items-center gap-4 px-2 focus:outline-none sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <input
        className='w-full p-3 rounded-lg sm:w-fit grow bg-backgroundDark'
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
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>
      <textarea
        className='w-full p-5 rounded-lg resize-none sm:w-fit grow h-60 sm:h-40 bg-backgroundDark'
        placeholder={props.label}
        maxLength={props.maxLength ? props.maxLength : 300}
        {...props.register(props.name)}
        defaultValue={props.defaultValue}
      />
    </div>
  );
};

type SelectFieldProps = {
  control: any;
  name: string;
  label: string;
  defaultValues: string[];
  options: any;
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
    <div className='flex flex-col items-center gap-4 px-2 sm:gap-0 sm:flex-row'>
      <label className='text-center sm:w-1/3 text-primary'>{props.label}</label>

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
  );
};

const tagsOptions = Object.keys(Tags).map((key) => {
  return {
    value: (Tags as any)[key],
    label: (Tags as any)[key],
  };
});
