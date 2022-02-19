import Image from 'next/image';
import { profileNFTImages } from 'constants/hardcoded';
import { Profile } from 'types/Profile';

type ProfileCardProps = {
  profile: Profile;
  setEdit: any;
};

const ProfileCard = (props: ProfileCardProps) => {
  return (
    <div className='flex flex-col w-full max-w-screen-sm p-4 mt-16 text-cyan-50'>
      <div>Display Name</div>
      <div className='p-2 mt-2 mb-4 bg-gray-900 text-cyan-50'>
        {props.profile.displayName}
      </div>

      <div>Bio</div>
      <div className='p-2 mt-2 mb-6 bg-gray-900 text-cyan-50'>
        {props.profile.bio}
      </div>

      <div className='flex items-center gap-2'>
        <div>Looking for work?</div>
        <input
          readOnly={true}
          checked={props.profile.lookingForWork}
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

export default ProfileCard;
