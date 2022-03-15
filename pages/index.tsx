import { useMoralis } from 'react-moralis';
import Head from 'next/head';
import DefaultProfile from '_components/Index/DefaultProfile';
import Communities from '_components/Index/Communities';
import ConnectView from '_components/Index/ConnectView';
import { Networks } from '_enums/Networks';
import { useEffect, useState } from 'react';
import NavBar from '_components/Index/Navbar';
import { subscribeToDefaultProfile } from '_api/profiles';
import { Profile } from '_types/Profile';
import LinkWallets from '_components/Index/LinkWallets';

export default function Home() {
  const { isAuthenticated, user } = useMoralis();
  const [isShowingProfile, setIsShowingProfile] = useState(false);
  const [isShowingLinkWallets, setIsShowingLinkWallets] = useState(false);
  const [existingDefaultProfile, setExistingDefaultProfile] =
    useState<Profile>();
  const network: Networks = user?.attributes.ethAddress
    ? Networks.ETH
    : Networks.SOL;

  const walletAddress =
    network === Networks.ETH
      ? user?.attributes.ethAddress
      : user?.attributes.solAddress;

  useEffect(() => {
    if (!walletAddress) return;
    const unsubscribe = subscribeToDefaultProfile(
      walletAddress,
      setExistingDefaultProfile
    );

    return unsubscribe;
  }, [walletAddress]);

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
        isShowingLinkWallets={isShowingLinkWallets}
        setIsShowingLinkWallets={setIsShowingLinkWallets}
      />

      <div className='overflow-y-scroll grow'>
        {!isAuthenticated ? (
          <ConnectView />
        ) : isShowingProfile ? (
          <DefaultProfile
            walletAddress={walletAddress}
            setIsShowingProfile={setIsShowingProfile}
            existingDefaultProfile={existingDefaultProfile}
          />
        ) : isShowingLinkWallets ? (
          <LinkWallets walletAddress={walletAddress} />
        ) : (
          <Communities network={network} walletAddress={walletAddress} />
        )}
      </div>
    </div>
  );
}
