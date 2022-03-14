import SideBar from '_components/Community/SideBar/SideBar';
import Content from '_components/Community/Content/Content';
import TopBar from '_components/Community/TopBar';
import MobileSideBar from '_components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from '_types/ConnectionData';
import { ConnectionContext } from '_contexts/ConnectionContext';
import {
  checkForExistingDefaultProfile,
  subscribeToProfile,
} from '_api/profiles';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfileForm from '_components/ProfileForms/CreateProfileForm';
import LoadingSpinner from '_styled/LoadingSpinner';
import Head from 'next/head';
import { Profile } from '_types/Profile';
import { Networks } from '_enums/Networks';
import { ProfileContext } from '_contexts/ProfileContext';
import { checkNftIsInWallet } from '_helpers/getUserNfts';
import { useNFTBalances } from 'react-moralis';
import { Sections } from '_enums/Sections';
import { CommunityContext } from '_contexts/CommunityContext';
import { ProfileType } from '_enums/ProfileType';

const Community = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;

  const { isAuthUndefined, isAuthenticated, user, chainId } = useMoralis();
  const { getNFTBalances } = useNFTBalances();

  const [loadingHasRequiredNft, setLoadingHasRequiredNft] = useState(true);

  const [loadingConnectionData, setLoadingConnectionData] = useState(true);
  const [connectionData, setConnectionData] = useState<ConnectionData>();

  const [profile, setProfile] = useState<Profile>();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [existingDefaultProfile, setExistingDefaultProfile] =
    useState<Profile>();
  const [loadingDefaultProfile, setLoadingDefaultProfile] = useState(true);

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
  const updateHasRequiredNft = (hasRequiredNft: boolean) => {
    hasRequiredNft ? setLoadingHasRequiredNft(false) : router.push('/');
  };

  useEffect(() => {
    if (!connectionData) return;

    checkNftIsInWallet(
      getNFTBalances,
      connectionData.address,
      communityId,
      updateHasRequiredNft,
      connectionData.network,
      chainId
    );
  }, [connectionData]);

  useEffect(() => {
    if (!connectionData) {
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    const unsubscribe = subscribeToProfile(
      communityId,
      connectionData.address,
      updateProfile
    );
    checkForExistingDefaultProfile(
      connectionData.address,
      setExistingDefaultProfile
    );

    return unsubscribe;
  }, [connectionData]);

  const updateProfile = (profile: Profile) => {
    setProfile(profile);
    setLoadingProfile(false);
  };

  useEffect(() => {
    setLoadingDefaultProfile(false);
  }, [existingDefaultProfile]);

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
            loadingProfile ||
            loadingDefaultProfile ? (
              <LoadingSpinner />
            ) : !profile ? (
              <div className='flex flex-col w-full'>
                <TopBar
                  isSidebarOpen={isSidebarOpen}
                  setIsSidebarOpen={undefined}
                  hideHamburgerMenu={true}
                />
                <CreateProfileForm
                  type={ProfileType.Community}
                  existingDefaultProfile={existingDefaultProfile}
                />
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
