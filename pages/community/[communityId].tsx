import SideBar from 'components/Community/SideBar/SideBar';
import Content from 'components/Community/Content/Content';
import TopBar from 'components/Community/TopBar';
import MobileSideBar from 'components/Community/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from 'types/ConnectionData';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { getProfileId } from '_firebase/APIRequests';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfile from 'components/Community/CreateProfile';
import LoadingSpinner from 'styled/LoadingSpinner';

// Profile should be passed as context around app as it'll be used a lot.
// Aswell as the getProfile() function to easily update the profile state.
const Community = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const { isAuthUndefined, isAuthenticated, user } = useMoralis();
  const [connectionData, setConnectionData] = useState<ConnectionData>();

  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [toggleState, setToggleState] = useState(1);

  const initConnectionData = async () => {
    setLoading(true);
    const isEth = user!.attributes.ethAddress ? true : false;
    const connectedWalletAddress = isEth
      ? user!.attributes.ethAddress
      : user!.attributes.solAddress;

    const profileId = await getProfileId(communityId, connectedWalletAddress);

    setConnectionData({
      wallet: { isEth: isEth, address: connectedWalletAddress },
      profileId: profileId,
    });
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthUndefined || !router.query.communityId) return;
    if (!isAuthenticated) {
      router.push('/');
      return;
    }
    initConnectionData();
  }, [isAuthUndefined, isAuthenticated, router.query]);

  return (
    <ConnectionContext.Provider value={connectionData}>
      <div className='flex h-screen bg-background text-white'>
        {loading || isAuthUndefined ? (
          <LoadingSpinner />
        ) : !connectionData!.profileId ? (
          <div className='flex flex-col w-full'>
            <TopBar
              isOpen={false}
              hideHamburgerMenu={true}
              setIsOpen={undefined}
            />
            <CreateProfile
              communityId={communityId}
              setConnectionData={setConnectionData}
            />
          </div>
        ) : (
          <>
            <div className='hidden sm:block'>
              <SideBar
                toggleState={toggleState}
                setToggleState={setToggleState}
              />
            </div>
            <div className='block sm:hidden'>
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
    </ConnectionContext.Provider>
  );
};
export default Community;
