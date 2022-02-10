import {
	FaIdCard,
	FaNetworkWired,
	FaBriefcase,
	FaUser,
	FaBars,
	FaArrowLeft,
} from 'react-icons/fa';
import SideBarIcon from 'components/SideBar/SideBarIcon';
import ProfileIcon from 'components/SideBar/ProfileIcon';

type SideBarProps = {
	isOpen: boolean;
	setIsOpen: any;
	toggleTab: any;
};

const SideBar = (props: SideBarProps) => {
	return (
		<div
			className={`border-4 border-black lg:block hidden m-0 text-center z-10 bg-gray-900 shadow-lg w-1/10 text-cyan-400 ${
				props.isOpen ? 'translate-x-0' : '-translate-x-full'
			} ease-in-out duration-300`}
		>
			<div className='flex flex-col items-center h-full'>
				<div className='flex flex-col gap-y-4 grow'>
					<button className='' onClick={() => props.setIsOpen(!props.isOpen)}>
						<SideBarIcon icon={<FaArrowLeft size='20' />} />
					</button>
					<button onClick={() => props.toggleTab(1)}>
						<SideBarIcon icon={<FaBriefcase size='20' />} text={'JOBS'} />
					</button>

					<button onClick={() => props.toggleTab(2)}>
						<SideBarIcon icon={<FaIdCard size='20' />} text={'TALENT'} />
					</button>

					<button onClick={() => props.toggleTab(3)}>
						<SideBarIcon
							icon={<FaNetworkWired size='20' />}
							text={'CONNECTIONS'}
						/>
					</button>
				</div>
				<button className='' onClick={() => props.toggleTab(4)}>
					<ProfileIcon icon={<FaUser size='40' />} />
				</button>
			</div>
		</div>
	);
};

export default SideBar;
