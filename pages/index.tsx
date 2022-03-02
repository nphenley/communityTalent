import { useMoralis } from 'react-moralis';
import Head from 'next/head';
import DefaultProfile from '_components/Index/DefaultProfile';
import Communities from '_components/Index/Communities';
import ConnectView from '_components/Index/ConnectView';
import { Networks } from '_enums/Networks';
import { useState } from 'react';
import NavBar from '_components/Index/Navbar';

export default function Home() {
  const { isAuthenticated, user } = useMoralis();

  const [isShowingProfile, setIsShowingProfile] = useState(false);

  const network: Networks = user?.attributes.ethAddress
    ? Networks.ETH
    : Networks.SOL;

  const connectedWalletAddress =
    network === Networks.ETH
      ? user?.attributes.ethAddress
      : user?.attributes.solAddress;

  return (
    <div className='flex flex-col h-screen bg-background text-primary'>
      <Head>
        <title>communityTalent</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <NavBar
        isAuthenticated={isAuthenticated}
        isShowingProfile={isShowingProfile}
        setIsShowingProfile={setIsShowingProfile}
      />

      <div className='overflow-y-scroll grow'>
        {isAuthenticated ? (
          isShowingProfile ? (
            <DefaultProfile connectedWalletAddress={connectedWalletAddress} />
          ) : (
            <Communities
              network={network}
              connectedWalletAddress={connectedWalletAddress}
            />
          )
        ) : (
          <ConnectView />
        )}
      </div>
    </div>
  );
}
