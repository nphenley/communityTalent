import SideBar from 'components/SideBar/SideBar';
import Content from 'components/Content/Content';
import TopBar from 'components/TopBar';
import MobileSideBar from 'components/SideBar/MobileSideBar';
import { useState, useEffect } from 'react';
import { ConnectionData } from 'types/ConnectionData';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { getProfileId } from '_firebase/APIRequests';
import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import CreateProfileView from 'components/CreateProfileView';
import LoadingSpinner from 'styled/LoadingSpinner';

// get communityId from url param
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
      <div className='flex h-screen'>
        {loading || isAuthUndefined ? (
          <LoadingSpinner />
        ) : !connectionData!.profileId ? (
          <CreateProfileView
            communityId={communityId}
            setConnectionData={setConnectionData}
          />
        ) : (
          <>
            <div className='hidden sm:block'>
              <SideBar
                isOpen={isOpen}
                setIsOpen={setIsOpen}
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
