import { FaIdCard, FaBriefcase, FaArrowLeft } from 'react-icons/fa';
import SideBarIcon from '_components/Community/SideBar/SideBarIcon';
import Image from 'next/image';
import { useContext } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';
import { Sections } from '_enums/Sections';
import Link from 'next/link';

type SideBarProps = {
  toggleState: Sections;
  setToggleState: any;
};

const SideBar = (props: SideBarProps) => {
  const profile = useContext(ProfileContext);

  return (
    <div className={styles.container}>
      <Link href='/'>
        <button className='flex flex-col items-center w-full py-4 hover:bg-primaryDark'>
          <FaArrowLeft size={20} />
        </button>
      </Link>
      <button className='w-full' onClick={() => props.setToggleState(Sections.PROFILE)}>
        <SideBarIcon
          icon={
            <div className='flex justify-center mb-4 overflow-hidden rounded-full'>
              <Image src={profile!.profilePicture!} height={150} width={150} unoptimized={true} />
            </div>
          }
          text={profile!.displayName}
          active={props.toggleState === Sections.PROFILE}
        />
      </button>

      <div className='flex flex-col grow gap-y-6'>
        <button onClick={() => props.setToggleState(Sections.PROJECTS)}>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'PROJECTS'}
            active={props.toggleState === Sections.PROJECTS}
          />
        </button>

        <button onClick={() => props.setToggleState(Sections.TALENT)}>
          <SideBarIcon icon={<FaIdCard size='20' />} text={'TALENT'} active={props.toggleState === Sections.TALENT} />
        </button>
      </div>
    </div>
  );
};

export default SideBar;

const styles = {
  container: 'select-none py-8 bg-backgroundDark shadow-lg text-primary flex flex-col gap-6 items-center h-screen',
};
