import SideBar from '_components/Community/SideBar/SideBar';
import Content from '_components/Community/Content/Content';
import TopBar from '_components/Community/TopBar';
import MobileSideBar from '_components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { subscribeToCommunityProfile } from '_api/profiles';
import { subscribeToOrCreateWalletGroupID } from '_api/walletGroups';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import LoadingSpinner from '_styled/LoadingSpinner';
import Head from 'next/head';
import { Profile } from '_types/Profile';
import { ProfileContext } from '_contexts/ProfileContext';
import { useNFTBalances } from 'react-moralis';
import { Sections } from '_enums/Sections';
import { CommunityContext } from '_contexts/CommunityContext';
import { WalletGroupContext } from '_contexts/WalletGroupContext';
import { doesWalletGroupOwnNFT } from '_helpers/doesWalletGroupOwnNFT';
import ProfileForm from '_components/Community/Content/Profile/ProfileForm';

const Community = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;

  const { isAuthUndefined, isAuthenticated, user } = useMoralis();
  const { getNFTBalances } = useNFTBalances();

  const [loadingWalletGroupOwnsNFT, setLoadingWalletGroupOwnsNFT] = useState(true);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<Profile>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toggleState, setToggleState] = useState<Sections>(Sections.PROFILE);

  const [walletGroupID, setWalletGroupID] = useState('');

  useEffect(() => {
    if (isAuthUndefined) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }

    const unsub = subscribeToOrCreateWalletGroupID(
      user!.attributes.ethAddress ? user!.attributes.ethAddress : user!.attributes.solAddress,
      (walletGroupID: string) => {
        setWalletGroupID(walletGroupID);
      }
    );

    return unsub;
  }, [isAuthUndefined, isAuthenticated]);

  useEffect(() => {
    if (!walletGroupID) return;

    (async () => {
      (await doesWalletGroupOwnNFT(getNFTBalances, walletGroupID, communityId)) ? setLoadingWalletGroupOwnsNFT(false) : router.push('/');
    })();

    const unsubToProfile = subscribeToCommunityProfile(communityId, walletGroupID, (profile: Profile) => {
      setProfile(profile);
      setLoadingProfile(false);
    });

    return unsubToProfile;
  }, [walletGroupID]);

  return (
    <WalletGroupContext.Provider value={walletGroupID}>
      <CommunityContext.Provider value={communityId}>
        <Head>
          <title>community/{communityId}</title>
          <meta name='viewport' content='initial-scale=1.0, width=device-width' />
        </Head>

        <div className={styles.container}>
          {isAuthUndefined || loadingWalletGroupOwnsNFT || loadingProfile ? (
            <LoadingSpinner />
          ) : !profile ? (
            <div className={styles.noProfileContainer}>
              <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={undefined} hideHamburgerMenu={true} />
              <ProfileForm />
            </div>
          ) : (
            <ProfileContext.Provider value={profile}>
              <div className='hidden md:block'>
                <SideBar toggleState={toggleState} setToggleState={setToggleState} />
              </div>
              <div className='block md:hidden'>
                <MobileSideBar
                  isOpen={isSidebarOpen}
                  setIsOpen={setIsSidebarOpen}
                  toggleState={toggleState}
                  setToggleState={setToggleState}
                />
              </div>

              <div className='flex flex-col grow'>
                <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <Content toggleState={toggleState} />
              </div>
            </ProfileContext.Provider>
          )}
        </div>
      </CommunityContext.Provider>
    </WalletGroupContext.Provider>
  );
};
export default Community;

const styles = {
  container: 'flex h-screen text-white break-words bg-background',
  noProfileContainer: 'flex flex-col gap-10 w-full overflow-y-scroll pb-20',
};
