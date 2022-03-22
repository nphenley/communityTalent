import { useMoralis } from 'react-moralis';
import Head from 'next/head';
import DefaultProfile from '_components/Index/DefaultProfile';
import Communities from '_components/Index/Communities/Communities';
import ConnectView from '_components/Index/ConnectView';
import { useEffect, useState } from 'react';
import NavBar from '_components/Index/Navbar';
import WalletGroups from '_components/Index/WalletGroups/WalletGroups';
import { subscribeToOrCreateWalletGroupID } from '_api/walletGroups';
import LoadingSpinner from '_styled/LoadingSpinner';

const nextHead = (
  <Head>
    <title>communityTalent</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
  </Head>
);

export enum HomeSection {
  COMMUNITIES,
  DEFAULTPROFILE,
  WALLETGROUPS,
}

const Home = () => {
  const { isAuthenticated, user } = useMoralis();

  const [homeSection, setHomeSection] = useState<HomeSection>(HomeSection.COMMUNITIES);

  const [loadingWalletGroupID, setLoadingWalletGroupID] = useState(true);
  const [walletGroupID, setWalletGroupID] = useState<string>();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    subscribeToOrCreateWalletGroupID(
      user.attributes.ethAddress ? user.attributes.ethAddress : user.attributes.solAddress,
      (walletGroupID: string) => {
        setWalletGroupID(walletGroupID);
        setLoadingWalletGroupID(false);
      }
    );
  }, [isAuthenticated, user]);

  const connectedView = loadingWalletGroupID ? (
    <LoadingSpinner />
  ) : homeSection === HomeSection.COMMUNITIES ? (
    <Communities walletGroupID={walletGroupID!} />
  ) : homeSection === HomeSection.WALLETGROUPS ? (
    <WalletGroups walletGroupID={walletGroupID!} />
  ) : (
    <DefaultProfile
      walletGroupID={walletGroupID!}
      onSubmit={() => setHomeSection(HomeSection.COMMUNITIES)}
    />
  );

  return (
    <div className='flex flex-col h-screen bg-background text-white'>
      {nextHead}

      <NavBar
        isAuthenticated={isAuthenticated}
        homeSection={homeSection}
        setHomeSection={setHomeSection}
      />

      <div className='overflow-y-scroll grow lg:max-w-[96%] mx-auto w-full py-4'>
        {isAuthenticated ? connectedView : <ConnectView />}
      </div>
    </div>
  );
};

export default Home;
