import { useMoralis } from 'react-moralis';
import Head from 'next/head';
import DefaultProfile from '_components/Index/DefaultProfile';
import Communities from '_components/Index/Communities';
import ConnectView from '_components/Index/ConnectView';
import { Networks } from '_enums/Networks';
import { useEffect, useState } from 'react';
import NavBar from '_components/Index/Navbar';
import { WalletContext } from '_contexts/WalletContext';
import { Wallet } from '_types/Wallet';
import { subscribeToWallet } from '_firebase/APIRequests';

export default function Home() {
  const { isAuthenticated, user } = useMoralis();
  const [walletContext, setWalletContext] = useState<Wallet>();
  const [isShowingProfile, setIsShowingProfile] = useState(false);

  const network: Networks = user?.attributes.ethAddress
    ? Networks.ETH
    : Networks.SOL;

  const walletAddress =
    network === Networks.ETH
      ? user?.attributes.ethAddress
      : user?.attributes.solAddress;

  useEffect(() => {
    if (!walletAddress) return;
    const unsubscribe = subscribeToWallet(walletAddress, setWalletContext);
    return () => unsubscribe();
  }, [walletAddress]);

  return (
    <WalletContext.Provider value={walletContext}>
      <div className='flex flex-col h-screen bg-background text-primary'>
        <Head>
          <title>communityTalent</title>
          <meta
            name='viewport'
            content='initial-scale=1.0, width=device-width'
          />
        </Head>

        <NavBar
          isAuthenticated={isAuthenticated}
          isShowingProfile={isShowingProfile}
          setIsShowingProfile={setIsShowingProfile}
        />

        <div className='overflow-y-scroll grow'>
          {!isAuthenticated ? (
            <ConnectView />
          ) : isShowingProfile ? (
            <DefaultProfile walletAddress={walletAddress} />
          ) : (
            <Communities network={network} walletAddress={walletAddress} />
          )}
        </div>
      </div>
    </WalletContext.Provider>
  );
}
