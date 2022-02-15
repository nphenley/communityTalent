import SideBar from 'components/SideBar/SideBar';
import MainView from 'components/Content/Content';
import TopBar from 'components/TopBar';
import MobileSideBar from 'components/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { WalletData } from 'types/WalletData';
import { WalletContext } from 'contexts/WalletContext';
import { useMoralis } from 'react-moralis';

const Main = () => {
  const { user, isAuthenticated } = useMoralis();

  const [isOpen, setIsOpen] = useState(false);
  const [toggleState, setToggleState] = useState(1);
  const [walletData, setWalletData] = useState<WalletData>();

  useEffect(() => {
    if (!isAuthenticated) return;
    setWalletData({
      isAuthenticated: isAuthenticated,
      isEth: user!.attributes.ethAddress ? true : false,
      address: !isAuthenticated
        ? ''
        : user!.attributes.ethAddress
        ? user!.attributes.ethAddress
        : user!.attributes.solAddress,
    });
  }, [isAuthenticated]);

  return (
    <WalletContext.Provider value={walletData}>
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
    </WalletContext.Provider>
  );
};
export default Main;
