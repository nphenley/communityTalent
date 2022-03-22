import SideBar from '_components/Community/SideBar/SideBar';
import Content from '_components/Community/Content/Content';
import TopBar from '_components/Community/TopBar';
import MobileSideBar from '_components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { subscribeToCommunityProfile } from '_api/profiles';
import { getOrCreateWalletGroupID } from '_api/walletGroups';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfileForm from '_components/ProfileForms/CreateProfileForm';
import LoadingSpinner from '_styled/LoadingSpinner';
import Head from 'next/head';
import { Profile } from '_types/Profile';
import { ProfileContext } from '_contexts/ProfileContext';
import { checkWalletGroupOwnsNFT } from '_helpers/getWalletCommunities';
import { useNFTBalances } from 'react-moralis';
import { Sections } from '_enums/Sections';
import { CommunityContext } from '_contexts/CommunityContext';
import { ProfileType } from '_enums/ProfileType';

const Community = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;

  const { isAuthUndefined, isAuthenticated, user } = useMoralis();
  const { getNFTBalances } = useNFTBalances();

  const [loadingWalletGroupOwnsNFT, setLoadingWalletGroupOwnsNFT] = useState(true);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<Profile>();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toggleState, setToggleState] = useState<Sections>(Sections.TALENT);

  const [walletGroupID, setWalletGroupID] = useState('');

  useEffect(() => {
    if (isAuthUndefined) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
  }, [isAuthUndefined, isAuthenticated]);

  useEffect(() => {
    getOrCreateWalletGroupID(user!.attributes.ethAddress ? user!.attributes.ethAddress : user!.attributes.solAddress, setWalletGroupID);
  }, []);

  // TODO:
  // Check if any wallet in walletGroup contains the required NFT.
  useEffect(() => {
    if (!walletGroupID) return;

    checkWalletGroupOwnsNFT(getNFTBalances, walletGroupID, communityId, updateWalletGroupOwnsNFT);

    const unsubToProfile = subscribeToCommunityProfile(communityId, walletGroupID, updateProfile);
    return unsubToProfile;
  }, [walletGroupID]);

  const updateWalletGroupOwnsNFT = (walletGroupOwnsNFT: boolean) => {
    walletGroupOwnsNFT ? setLoadingWalletGroupOwnsNFT(false) : router.push('/');
  };

  const updateProfile = (profile: Profile) => {
    setProfile(profile);
    setLoadingProfile(false);
  };

  return (
    <CommunityContext.Provider value={communityId}>
      <Head>
        <title>community/{communityId}</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>

      <div className='flex h-screen text-white break-words bg-background'>
        {isAuthUndefined || loadingWalletGroupOwnsNFT || loadingProfile ? (
          <LoadingSpinner />
        ) : !profile ? (
          <div className='flex flex-col w-full'>
            <TopBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={undefined} hideHamburgerMenu={true} />
            <CreateProfileForm type={ProfileType.COMMUNITY} walletGroupID={walletGroupID} />
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
  );
};
export default Community;
