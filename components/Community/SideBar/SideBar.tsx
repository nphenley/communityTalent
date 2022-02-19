import { FaIdCard, FaNetworkWired, FaBriefcase, FaUser } from 'react-icons/fa';
import SideBarIcon from 'components/Community/SideBar/SideBarIcon';
import Image from 'next/image';
import { profileNFTImages } from 'constants/hardcoded';
import { useContext } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';

type SideBarProps = {
  toggleState: number;
  setToggleState: any;
};

// TODO: Don't use profileId
// Use displayName
// So don't just pass profileId in Context, but the entire user's profile.
const SideBar = (props: SideBarProps) => {
  const connectionData = useContext(ConnectionContext);

  return (
    <div className={styles.container}>
      <button className='w-full' onClick={() => props.setToggleState(4)}>
        <SideBarIcon
          icon={
            <div className='rounded-full overflow-hidden flex justify-center mb-4'>
              <Image src={profileNFTImages[3]} height={150} width={150} />
            </div>
          }
          text={connectionData?.profileId}
          active={props.toggleState === 4}
        />
      </button>

      <div className='flex flex-col grow gap-y-6'>
        <button onClick={() => props.setToggleState(1)}>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'JOBS'}
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
