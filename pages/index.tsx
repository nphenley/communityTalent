import { useState } from 'react';

import SideBar from 'components/SideBar/SideBar';
import MainView from 'components/MainView/MainView';
import TopBar from 'components/TopBar';

export default function Home() {
	const [isOpen, setIsOpen] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [toggleState, setToggleState] = useState(1);

	return (
		<div className='flex h-screen'>
			<SideBar
				isOpen={isOpen}
				setIsOpen={setIsOpen}
				setToggleState={setToggleState}
			/>

			<div className='grow flex flex-col'>
				<TopBar
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					isConnected={isConnected}
					setIsConnected={setIsConnected}
				/>

				<MainView
					isOpen={isOpen}
					setIsOpen={setIsOpen}
					isConnected={isConnected}
					setIsConnected={setIsConnected}
					toggleState={toggleState}
				/>
			</div>
		</div>
	);
}

// TODO:
// SideBar moving in and out needs to be animated. ease-in-out duration-300
// Add in content to MainView
// Needs to be made responsive to mobile screens
