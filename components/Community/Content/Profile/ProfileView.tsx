type EditProfileProps = {
  experience: string;
  languages: string;
  connections: string;
  lookingForWork: boolean;
  setEdit: any;
};

const EditProfile = (props: EditProfileProps) => {
  return (
    <div className='flex flex-col w-full max-w-screen-sm p-4 mt-16 text-cyan-50'>
      <div>Experience</div>
      <div className='p-2 mt-2 mb-4 bg-gray-900 text-cyan-50 '>
        {props.experience}
      </div>

      <div>Languages</div>
      <div className='p-2 mt-2 mb-4 bg-gray-900 text-cyan-50'>
        {props.languages}
      </div>

      <div>Connections</div>
      <div className='p-2 mt-2 mb-6 bg-gray-900 text-cyan-50'>
        {props.connections}
      </div>

      <div className='flex items-center gap-2'>
        <div>Looking for work?</div>
        <input
          readOnly={true}
          checked={props.lookingForWork}
          className='text-black'
          type='checkbox'
        />
      </div>
      <button
        onClick={() => props.setEdit(true)}
        className='p-4 mt-4 bg-cyan-900 hover:bg-cyan-500 hover:cursor-pointer'
      >
        Edit
      </button>
    </div>
  );
};

export default EditProfile;
