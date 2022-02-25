import { FaIdCard, FaNetworkWired, FaBriefcase } from 'react-icons/fa';
import SideBarIcon from '_components/Community/SideBar/SideBarIcon';
import Image from 'next/image';
import { profileNFTImages } from '_constants/dev';
import { useContext } from 'react';
import { ProfileContext } from '_contexts/ProfileContext';

type SideBarProps = {
  toggleState: number;
  setToggleState: any;
};

const SideBar = (props: SideBarProps) => {
  const profile = useContext(ProfileContext);

  return (
    <div className={styles.container}>
      <button className='w-full' onClick={() => props.setToggleState(4)}>
        <SideBarIcon
          icon={
            <div className='rounded-full overflow-hidden flex justify-center mb-4'>
              <Image src={profileNFTImages[3]} height={150} width={150} />
            </div>
          }
          text={profile!.displayName}
          active={props.toggleState === 4}
        />
      </button>

      <div className='flex flex-col grow gap-y-6'>
        <button onClick={() => props.setToggleState(1)}>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'PROJECTS'}
            active={props.toggleState === 1}
          />
        </button>

        <button onClick={() => props.setToggleState(2)}>
          <SideBarIcon
            icon={<FaIdCard size='20' />}
            text={'TALENT'}
            active={props.toggleState === 2}
          />
        </button>

        <button onClick={() => props.setToggleState(3)}>
          <SideBarIcon
            icon={<FaNetworkWired size='25' />}
            text={'CONNECTIONS'}
            active={props.toggleState === 3}
          />
        </button>
      </div>
    </div>
  );
};

export default SideBar;

const styles = {
  container:
    'py-16 bg-backgroundDark shadow-lg text-primary flex flex-col gap-8 items-center h-screen',
};
