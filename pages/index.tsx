import { useState } from 'react';
import { useMoralis, MoralisProvider } from 'react-moralis';
import SideBar from 'components/SideBar/SideBar';
import MainView from 'components/MainView/MainView';
import TopBar from 'components/TopBar';
import MobileSideBar from 'components/SideBar/MobileSideBar';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [toggleState, setToggleState] = useState(1);

  return (
    <MoralisProvider
      appId={process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID}
      serverUrl={process.env.NEXT_PUBLIC_MORALIS_SERVER_URL}
    >
      <div className='flex h-screen'>
        <div className='hidden sm:block'>
          <SideBar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            toggleState={toggleState}
            setToggleState={setToggleState}
          />
        </div>
        <div className='block sm:hidden'>
          <MobileSideBar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            toggleState={toggleState}
            setToggleState={setToggleState}
          />
        </div>

        <div className='flex flex-col grow'>
          <TopBar isOpen={isOpen} setIsOpen={setIsOpen} />

          <MainView
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            toggleState={toggleState}
          />
        </div>
      </div>
    </MoralisProvider>
  );
}

// TODO:
// SideBar moving in and out needs to be animated. ease-in-out duration-300
// Needs to be made responsive to mobile screens, sidebar functionality.

// Notes:
// Maybe a bug with tailwind using w- and h- lol
// Use padding instead
