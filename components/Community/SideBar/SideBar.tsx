import {
  FaIdCard,
  FaNetworkWired,
  FaBriefcase,
  FaUser,
  FaArrowLeft,
} from 'react-icons/fa';
import SideBarIcon from 'components/Community/SideBar/SideBarIcon';
import ProfileIcon from 'components/Community/SideBar/ProfileIcon';

type SideBarProps = {
  isOpen: boolean;
  setIsOpen: any;
  toggleState: number;
  setToggleState: any;
};

const SideBar = (props: SideBarProps) => {
  let containerClass =
    'px-4 py-2 bg-gray-900  shadow-lg text-cyan-400 flex flex-col items-center h-screen';
  containerClass += props.isOpen ? ' hidden sm:flex' : ' hidden';

  return (
    <div className={containerClass}>
      <button className='mb-14' onClick={() => props.setIsOpen(!props.isOpen)}>
        <SideBarIcon icon={<FaArrowLeft size='20' />} />
      </button>

      <div className='flex flex-col grow gap-y-6'>
        <button onClick={() => props.setToggleState(1)}>
          <SideBarIcon
            icon={<FaBriefcase size='20' />}
            text={'Jobs'}
            active={props.toggleState === 1}
          />
        </button>

        <button onClick={() => props.setToggleState(2)}>
          <SideBarIcon
            icon={<FaIdCard size='20' />}
            text={'Talent'}
            active={props.toggleState === 2}
          />
        </button>

        <button onClick={() => props.setToggleState(3)}>
          <SideBarIcon
            icon={<FaNetworkWired size='25' />}
            text={'Connections'}
            active={props.toggleState === 3}
          />
        </button>
      </div>

      <button onClick={() => props.setToggleState(4)}>
        <ProfileIcon icon={<FaUser size='26' />} />
      </button>
    </div>
  );
};

export default SideBar;
