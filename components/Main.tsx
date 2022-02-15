import SideBar from 'components/SideBar/SideBar';
import MainView from 'components/Content/Content';
import TopBar from 'components/TopBar';
import MobileSideBar from 'components/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from 'types/ConnectionData';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { useMoralis } from 'react-moralis';

const Main = () => {
  const { user, isAuthenticated } = useMoralis();

  const [isOpen, setIsOpen] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [connectionData, setConnectionData] = useState<ConnectionData>();

  useEffect(() => {
    if (!isAuthenticated) return;
    setConnectionData({
      isAuthenticated: isAuthenticated,
      wallet: {
        isEth: user!.attributes.ethAddress ? true : false,
        address: !isAuthenticated
          ? ''
          : user!.attributes.ethAddress
          ? user!.attributes.ethAddress
          : user!.attributes.solAddress,
      },
    });
  }, [isAuthenticated]);

  return (
    <ConnectionContext.Provider value={connectionData}>
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
    </ConnectionContext.Provider>
  );
};
export default Main;
