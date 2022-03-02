import SideBar from '_components/Community/SideBar/SideBar';
import Content from '_components/Community/Content/Content';
import TopBar from '_components/Community/TopBar';
import MobileSideBar from '_components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from '_types/ConnectionData';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { subscribeToProfile } from '_firebase/APIRequests';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfileForm from '_components/Community/CreateProfileForm';
import LoadingSpinner from '_styled/LoadingSpinner';
import Head from 'next/head';
import { Profile } from '_types/Profile';
import { Networks } from '_enums/Networks';
import { ProfileContext } from '_contexts/ProfileContext';
import { checkEthNftInWallet, checkSolNftInWallet } from '_helpers/getUserNfts';
import { useNFTBalances } from 'react-moralis';
import { Sections } from '_enums/Sections';
import { CommunityContext } from '_contexts/CommunityContext';

const Community = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;

  const { isAuthUndefined, isAuthenticated, user, chainId } = useMoralis();
  const { getNFTBalances } = useNFTBalances();

  const [loadingHasRequiredNft, setLoadingHasRequiredNft] = useState(true);

  const [loadingConnectionData, setLoadingConnectionData] = useState(true);
  const [connectionData, setConnectionData] = useState<ConnectionData>();

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<Profile>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toggleState, setToggleState] = useState<Sections>(Sections.TALENT);

  useEffect(() => {
    if (isAuthUndefined || !router.query.communityId) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    initConnectionData();
  }, [isAuthUndefined, isAuthenticated, router.query]);

  const initConnectionData = async () => {
    setLoadingConnectionData(true);
    setConnectionData({
      network: user!.attributes.ethAddress ? Networks.ETH : Networks.SOL,
      address: user!.attributes.ethAddress
        ? user!.attributes.ethAddress
        : user!.attributes.solAddress,
    });
    setLoadingConnectionData(false);
  };

  useEffect(() => {
    if (!connectionData) return;
    checkUserHasRequiredNft();
  }, [connectionData]);

  const checkUserHasRequiredNft = async () => {
    if (connectionData!.network === Networks.SOL) {
      checkSolNftInWallet(
        connectionData!.address,
        communityId,
        updateHasRequiredNft
      );
    } else {
      checkEthNftInWallet(
        getNFTBalances,
        chainId ? chainId : 'eth',
        connectionData!.address,
        communityId,
        updateHasRequiredNft
      );
    }
  };

  const updateHasRequiredNft = (hasRequiredNft: boolean) => {
    hasRequiredNft ? setLoadingHasRequiredNft(false) : router.push('/');
  };

  useEffect(() => {
    if (!connectionData) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    const unsubscribe = subscribeToProfile(
      communityId,
      connectionData?.address,
      updateProfile
    );
    return unsubscribe;
  }, [connectionData]);

  const updateProfile = (profile: Profile) => {
    setProfile(profile);
    setLoadingProfile(false);
  };

  return (
    <ConnectionContext.Provider value={connectionData}>
      <CommunityContext.Provider value={communityId}>
        <ProfileContext.Provider value={profile}>
          <Head>
            <title>community/{communityId}</title>
            <meta
              name='viewport'
              content='initial-scale=1.0, width=device-width'
            />
          </Head>

          <div className='flex h-screen text-white break-words bg-background'>
            {isAuthUndefined ||
            loadingConnectionData ||
            loadingHasRequiredNft ||
            loadingProfile ? (
              <LoadingSpinner />
            ) : !profile ? (
              <div className='flex flex-col w-full'>
                <TopBar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={undefined}
                  hideHamburgerMenu={true}
                />
                <CreateProfileForm />
              </div>
            ) : (
              <>
                <div className='hidden md:block'>
                  <SideBar
                    toggleState={toggleState}
                    setToggleState={setToggleState}
                  />
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
                  <TopBar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                  />
                  <Content toggleState={toggleState} />
                </div>
              </>
            )}
          </div>
        </ProfileContext.Provider>
      </CommunityContext.Provider>
    </ConnectionContext.Provider>
  );
};
export default Community;
