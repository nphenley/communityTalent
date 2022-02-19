import {
  FaIdCard,
  FaNetworkWired,
  FaBriefcase,
  FaUser,
  FaArrowLeft,
} from 'react-icons/fa';
import SideBarIcon from 'components/Community/SideBar/SideBarIcon';
import ProfileIcon from 'components/Community/SideBar/ProfileIcon';
import { profileNFTImages } from 'constants/hardcoded';
import Image from 'next/image';

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: any;
  toggleState: number;
  setToggleState: any;
};

const MobileSideBar = (props: SideBarProps) => {
  let containerClass =
    'absolute w-full z-50 py-2 bg-backgroundDark shadow-lg text-primary flex flex-col gap-14 items-center min-h-screen';
  containerClass += props.isOpen ? ' block' : ' hidden';

  const toggleState = (toggleState: number) => {
    props.setToggleState(toggleState);
    props.setIsOpen(false);
  };

  return (
    <div className={containerClass}>
      <button onClick={() => props.setIsOpen(false)}>
        <SideBarIcon icon={<FaArrowLeft size='20' />} />
      </button>

      <button className='w-full' onClick={() => toggleState(4)}>
        <SideBarIcon
          icon={
            <div className='rounded-full overflow-hidden flex justify-center mb-4'>
              <Image src={profileNFTImages[3]} height={180} width={180} />
            </div>
          }
          text={'Richpepsi'}
          active={props.toggleState === 4}
        />
      </button>

      <div className='flex flex-col grow gap-y-6 w-full'>
        <button onClick={() => toggleState(1)}>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'Jobs'}
            active={props.toggleState === 1}
          />
        </button>

        <button onClick={() => toggleState(2)}>
          <SideBarIcon
            icon={<FaIdCard size='20' />}
            text={'Talent'}
            active={props.toggleState === 2}
          />
        </button>

        <button onClick={() => toggleState(3)}>
          <SideBarIcon
            icon={<FaNetworkWired size='25' />}
            text={'Connections'}
            active={props.toggleState === 3}
          />
        </button>
      </div>
    </div>
  );
};

export default MobileSideBar;
