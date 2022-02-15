import Jobs from 'components/MainView/Jobs/Jobs';
import Talent from 'components/MainView/Talent';
import Connections from 'components/MainView/Connections';
import Profile from 'components/MainView/Profile';
import { useMoralis } from 'react-moralis';
import { useState, useEffect } from 'react';
import { WalletData } from 'types/WalletData';
import { WalletContext } from 'contexts/WalletContext';

type MainViewProps = {
  toggleState: number;
  isOpen: boolean;
  setIsOpen: any;
};

const MainView = (props: MainViewProps) => {
  const { user, isAuthenticated } = useMoralis();

  const [walletData, setWalletData] = useState<WalletData>();

  useEffect(() => {
    if (!isAuthenticated) return;
    setWalletData({
      isEth: user!.attributes.ethAddress ? true : false,
      address: user!.attributes.ethAddress
        ? user!.attributes.ethAddress
        : user!.attributes.solAddress,
    });
  }, [isAuthenticated]);

  const disconnectedView = (
    <div className='flex items-center justify-center h-full'>
      Please connect your wallet.
    </div>
  );

  const connectedView = (
    <WalletContext.Provider value={walletData}>
      {props.toggleState === 1 ? (
        <Jobs />
      ) : props.toggleState === 2 ? (
        <Talent />
      ) : props.toggleState === 3 ? (
        <Connections />
      ) : props.toggleState === 4 ? (
        <Profile />
      ) : null}
    </WalletContext.Provider>
  );

  return (
    <div className='overflow-y-scroll bg-gray-800 grow text-cyan-50'>
      {isAuthenticated ? connectedView : disconnectedView}
    </div>
  );
};

export default MainView;
