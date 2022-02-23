import { createProject } from '_firebase/APIRequests';
import { useForm } from 'react-hook-form';
import { Project } from '_types/Project';
import { useContext } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';

const ProjectForm = () => {
  const { register, handleSubmit } = useForm();

  const profile = useContext(ProfileContext);

  const onSubmit = (data: any) => {
    createProject({
      ...data,
      tags: ['dev', 'marketing'],
      authors: [profile!.id],
    } as Project);
  };

  return (
    <div className='absolute left-0 right-0 z-40 w-3/4 mx-auto bg-gray-700 rounded shadow-lg h-3/5 top-14 opacity-95'>
      <form onSubmit={handleSubmit(onSubmit)} className='px-6 py-8 '>
        <div className='flex flex-col items-center mb-8'>
          <label className='block mb-1 text-lg font-medium text-gray-300'>
            Title
          </label>
          <input
            {...register('title')}
            className='block w-1/2 p-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg sm:text-xs focus:ring-blue-500 focus:border-blue-500'
          ></input>
        </div>
        <div className='flex flex-col items-center mb-8 '>
          <label className='block mb-1 text-lg font-medium text-gray-300'>
            Description
          </label>
          <textarea
            {...register('description')}
            className='block w-full h-64 p-2 text-lg text-white placeholder-gray-400 align-text-top bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500'
          ></textarea>
        </div>

        <div className='flex flex-col items-center '>
          <button className='px-4 py-2 font-bold bg-gray-900 border-b-4 border-gray-800 rounded text-md'>
            Add
          </button>
        </div>
      </form>
    </div>
  );
};
export default ProjectForm;
