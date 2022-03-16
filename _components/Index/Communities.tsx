import {
  checkForIdsInLinkedWallets,
  pinCommunity,
  subscribeToPinnedCommunityIds,
  subscribeToStakedCommunityIds,
  unpinCommunity,
} from '_api/communities';
import { useEffect, useState } from 'react';
import { getCommunities } from '_helpers/getUserNfts';
import { Networks } from '_enums/Networks';
import { Community } from '_types/Community';
import { useMoralis, useNFTBalances } from 'react-moralis';
import LoadingSpinner from '_styled/LoadingSpinner';
import Image from 'next/image';
import { validChainIds } from '_constants/validChainIds';
import Link from 'next/link';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import StakedNftsForm from '_components/Index/StakedNftsForm';
import { getLinkedWallets } from '_api/linkWallets';

type CommunitiesProps = {
  network: Networks;
  walletAddress: string;
};

const Communities = (props: CommunitiesProps) => {
  const { getNFTBalances } = useNFTBalances();
  const { chainId } = useMoralis();

  const [loadingData, setLoadingData] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [communities, setCommunities] = useState<Community[]>([]);
  const [stakedCommunityIds, setStakedCommunityIds] = useState<string[]>();
  const [pinnedCommunityIds, setPinnedCommunityIds] = useState<string[]>();
  const [pinnedCommunities, setPinnedCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );
  const [showStakedNftsMenu, setShowStakedNftsMenu] = useState(false);
  const [linkedWallets, setLinkedWallets] = useState();
  useEffect(() => {
    getLinkedWallets(props.walletAddress, setLinkedWallets);
  }, []);

  useEffect(() => {
    if (!linkedWallets) return;
    checkForIdsInLinkedWallets(props.walletAddress, linkedWallets);
  }, [linkedWallets]);

  useEffect(() => {
    if (!stakedCommunityIds || !pinnedCommunityIds || !linkedWallets) return;
    if (
      (chainId && validChainIds.includes(chainId)) ||
      props.network === Networks.SOL
    ) {
      getCommunities(
        getNFTBalances,
        linkedWallets,
        updateData,
        chainId!,
        stakedCommunityIds,
        pinnedCommunityIds
      );
    } else {
      console.log(chainId);
      setLoadingData(false);
    }
  }, [chainId, pinnedCommunityIds, stakedCommunityIds]);

  const updateData = (
    communities: Community[],
    pinnedCommunities: Community[]
  ) => {
    setCommunities(communities);
    setFilteredCommunities(communities);
    setPinnedCommunities(pinnedCommunities);
    setLoadingData(false);
  };

  useEffect(() => {
    const filteredCommunities = filterCommunities(communities, searchQuery);
    setFilteredCommunities(filteredCommunities);
  }, [searchQuery]);

  useEffect(() => {
    if (!linkedWallets) return;
    const unsubscribePinned = subscribeToPinnedCommunityIds(
      props.walletAddress,
      setPinnedCommunityIds
    );

    return unsubscribePinned;
  }, [linkedWallets]);

  useEffect(() => {
    if (!linkedWallets) return;
    const unsubscribeStaked = subscribeToStakedCommunityIds(
      props.walletAddress,
      setStakedCommunityIds
    );

    return unsubscribeStaked;
  }, [linkedWallets]);

  const showAllButton = (
    <button
      className={styles.buttonContainer.concat(
        showAll
          ? ' bg-primary text-white'
          : ' bg-backgroundDark text-backgroundLight'
      )}
      onClick={() => setShowAll(!showAll)}
    >
      Show All
    </button>
  );

  const pinButton = (
    <button
      onClick={() => setIsPinning(!isPinning)}
      className={styles.buttonContainer.concat(
        isPinning
          ? ' bg-primary text-white'
          : ' bg-backgroundDark text-backgroundLight'
      )}
    >
      Pin
    </button>
  );

  const stakedNftsButton = (
    <button
      onClick={() => setShowStakedNftsMenu(!showStakedNftsMenu)}
      className={styles.buttonContainer.concat(
        showStakedNftsMenu
          ? ' bg-primary text-white'
          : ' bg-backgroundDark text-backgroundLight'
      )}
    >
      Staked
    </button>
  );

  return loadingData ? (
    <LoadingSpinner />
  ) : (
    <div className='mx-auto flex w-full max-w-[90%] flex-col gap-4 rounded-lg pt-12 pb-20'>
      <div className='text-2xl font-bold text-center'>Communities</div>
      <div className='flex flex-row-reverse gap-x-2'>
        {pinButton}
        {pinnedCommunities.length && !isPinning ? showAllButton : null}
        {stakedNftsButton}
        <SearchBar
          onChange={(e: any) => setSearchQuery(e.target.value)}
          placeholder='Search'
        />
      </div>

      {!showStakedNftsMenu ? null : (
        <StakedNftsForm
          setUserStakedCommunityIds={setStakedCommunityIds}
          walletAddress={props.walletAddress}
          userStakedCommunityIds={stakedCommunityIds!}
        />
      )}

      <div className='flex flex-col gap-12'>
        {pinnedCommunities.length ? (
          <div>
            <div className={styles.sectionHeading}>Pinned:</div>
            <div className={styles.communitiesContainer}>
              {pinnedCommunities.map((pinnedCommunity) => (
                <div className='relative' key={pinnedCommunity.id}>
                  {isPinning && (
                    <button
                      className='absolute top-0 right-0'
                      onClick={() =>
                        unpinCommunity(props.walletAddress, pinnedCommunity.id)
                      }
                    >
                      -
                    </button>
                  )}
                  <CommunityButton community={pinnedCommunity} />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showAll || isPinning || !pinnedCommunities.length ? (
          <div>
            <div className={styles.sectionHeading}>All:</div>
            {filteredCommunities.length ? (
              <div className={styles.communitiesContainer}>
                {filteredCommunities.map((community) => (
                  <div className='relative' key={community.id}>
                    {isPinning && (
                      <button
                        className='absolute top-0 right-0'
                        onClick={() =>
                          pinCommunity(props.walletAddress, community.id)
                        }
                      >
                        +
                      </button>
                    )}
                    <CommunityButton community={community} />
                  </div>
                ))}
              </div>
            ) : (
              <div>No communities available.</div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Communities;

type CommunityButtonProps = {
  community: Community;
};
const CommunityButton = (props: CommunityButtonProps) => {
  return (
    <Link href={`community/${props.community.id}`}>
      <button
        className='flex flex-col items-center mx-auto space-y-3'
        key={props.community.id}
      >
        <div className='flex justify-center overflow-hidden rounded-full'>
          <Image
            src={props.community.image}
            height={150}
            width={150}
            placeholder={'blur'}
            blurDataURL={props.community.image}
            unoptimized={true}
          />
        </div>
        <div className='font-medium break-all'>{props.community.name}</div>
      </button>
    </Link>
  );
};

const styles = {
  sectionHeading: 'text-xl font-bold',
  communitiesContainer:
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 gap-x-0 gap-y-12',
  buttonContainer: 'rounded-lg px-5 font-bold ',
};
