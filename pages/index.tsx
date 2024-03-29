import { useMoralis } from 'react-moralis';
import Head from 'next/head';
import Communities from '_components/Index/Communities/Communities';
import { useEffect, useState } from 'react';
import NavBar from '_components/Index/Navbar';
import WalletGroups from '_components/Index/WalletGroups/WalletGroups';
import { subscribeToOrCreateWalletGroupID } from '_api/walletGroups';
import LoadingSpinner from '_styled/LoadingSpinner';
import { Community } from '_types/Community';
import { getCommunitiesForWalletGroup } from '_api/communities';
import About from '_components/Index/LandingPage';

const nextHead = (
  <Head>
    <title>communityTalent</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
  </Head>
);

export enum HomeSection {
  COMMUNITIES,
  WALLETGROUPS,
}

const Home = () => {
  const { isAuthenticated, user } = useMoralis();

  const [homeSection, setHomeSection] = useState<HomeSection>(HomeSection.COMMUNITIES);

  const [loadingWalletGroupID, setLoadingWalletGroupID] = useState(true);
  const [walletGroupID, setWalletGroupID] = useState<string>();

  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);

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

  useEffect(() => {
    if (!walletGroupID) return;
    setLoadingCommunities(true);
    getCommunitiesForWalletGroup(walletGroupID, (communities: Community[]) => {
      setCommunities(communities);
      setLoadingCommunities(false);
    });
  }, [walletGroupID]);

  const connectedView =
    loadingWalletGroupID || loadingCommunities ? (
      <LoadingSpinner />
    ) : homeSection === HomeSection.COMMUNITIES ? (
      <Communities walletGroupID={walletGroupID!} communities={communities} />
    ) : homeSection === HomeSection.WALLETGROUPS ? (
      <WalletGroups walletGroupID={walletGroupID!} />
    ) : null;

  return (
    <div className={styles.container}>
      {nextHead}

      <NavBar isAuthenticated={isAuthenticated} homeSection={homeSection} setHomeSection={setHomeSection} />

      {isAuthenticated ? <div className={styles.contentContainer}>{connectedView}</div> : <About />}
    </div>
  );
};

export default Home;

const styles = {
  container: 'flex flex-col h-screen bg-background text-white',
  contentContainer: 'grow lg:max-w-[96%] mx-auto w-full overflow-y-scroll mb-2',
};
