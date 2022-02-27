import SideBar from '_components/Community/SideBar/SideBar';
import Content from '_components/Community/Content/Content';
import TopBar from '_components/Community/TopBar';
import MobileSideBar from '_components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from '_types/ConnectionData';
import { ConnectionContext } from '_contexts/ConnectionContext';
import {
  checkForExistingProfile,
  checkMatchForCommunity,
  subscribeToProfile,
} from '_firebase/APIRequests';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfile from '_components/Community/CreateProfile';
import LoadingSpinner from '_styled/LoadingSpinner';
import Head from 'next/head';
import { Profile } from '_types/Profile';
import { Networks } from '_enums/Networks';
import { ProfileContext } from '_contexts/ProfileContext';
import {
  checkEthMatchForCommunity,
  getUserNftsSolana,
} from '_helpers/getUserNfts';
import { useNFTBalances } from 'react-moralis';
import { Sections } from '_enums/Sections';

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
  const [oldProfile, setOldProfile] = useState<Profile>();

  const [isOpen, setIsOpen] = useState(false);
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
    if (loadingHasRequiredNft || connectionData!.network === Networks.SOL)
      return;
    checkForExistingProfile(connectionData!.address, setOldProfile);
  }, [loadingHasRequiredNft]);

  useEffect(() => {
    if (!connectionData) return;
    checkUserHasRequiredNft();
  }, [connectionData]);

  const checkUserHasRequiredNft = async () => {
    if (connectionData!.network === Networks.SOL) {
      const userNfts = await getUserNftsSolana(connectionData!.address!);
      checkMatchForCommunity(userNfts, communityId, updateHasRequiredNft);
    } else {
      checkEthMatchForCommunity(
        getNFTBalances,
        chainId ? chainId : 'eth',
        connectionData!.address,
        communityId,
        updateHasRequiredNft
      );
    }
  };

  const updateHasRequiredNft = (hasRequiredNft: boolean) => {
    if (!hasRequiredNft) {
      router.push('/');
    } else {
      setLoadingHasRequiredNft(false);
    }
  };

  useEffect(() => {
    if (!connectionData) {
      setLoadingProfile(false);
      return;
    }
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
                isOpen={false}
                hideHamburgerMenu={true}
                setIsOpen={undefined}
              />
              <CreateProfile communityId={communityId} />
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
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  toggleState={toggleState}
                  setToggleState={setToggleState}
                />
              </div>

              <div className='flex flex-col grow'>
                <TopBar isOpen={isOpen} setIsOpen={setIsOpen} />

                <Content
                  isOpen={isOpen}
                  setIsOpen={setIsOpen}
                  toggleState={toggleState}
                />
              </div>
            </>
          )}
        </div>
      </ProfileContext.Provider>
    </ConnectionContext.Provider>
  );
};
export default Community;
