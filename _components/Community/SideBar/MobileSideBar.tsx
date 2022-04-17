import { FaIdCard, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import SideBarIcon from '_components/Community/SideBar/SideBarIcon';
import Image from 'next/image';
import { useContext } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';
import { Sections } from '_enums/Sections';

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: any;
  toggleState: Sections;
  setToggleState: any;
};

const MobileSideBar = (props: SideBarProps) => {
  const profile = useContext(ProfileContext);

  let containerClass =
    'select-none absolute w-full z-50 bg-backgroundDark shadow-lg text-primary flex flex-col items-center min-h-screen ease-in-out duration-300';
  containerClass += props.isOpen ? ' translate-x-0' : ' -translate-x-full';

  const toggleState = (toggleState: Sections) => {
    props.setToggleState(toggleState);
    props.setIsOpen(false);
  };

  return (
    <div className={containerClass}>
      <button className='w-full' onClick={() => props.setIsOpen(false)}>
        <SideBarIcon icon={<FaArrowLeft size='20' />} />
      </button>

      <button className='flex justify-center w-full mt-4 mb-8' onClick={() => toggleState(Sections.PROFILE)}>
        <SideBarIcon
          icon={
            <div className='flex justify-center mb-1 overflow-hidden rounded-full'>
              <Image src={profile!.profilePicture!} height={150} width={150} unoptimized={true} />
            </div>
          }
          text={profile!.displayName}
          active={props.toggleState === Sections.PROFILE}
        />
      </button>

      <div className='flex flex-col items-center w-full grow gap-y-6'>
        <button onClick={() => toggleState(Sections.PROJECTS)} className='w-full'>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'Projects'}
            active={props.toggleState === Sections.PROJECTS}
          />
        </button>

        <button onClick={() => toggleState(Sections.TALENT)} className='w-full'>
          <SideBarIcon icon={<FaIdCard size='20' />} text={'Talent'} active={props.toggleState === Sections.TALENT} />
        </button>
      </div>
    </div>
  );
};

export default MobileSideBar;
