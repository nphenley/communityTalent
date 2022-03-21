import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  pinCommunity,
  unpinCommunity,
  subscribeToStakedCommunities,
} from '_api/communities';
import { getCommunities } from '_helpers/getUserNfts';
import { Community } from '_types/Community';
import { useNFTBalances } from 'react-moralis';
import LoadingSpinner from '_styled/LoadingSpinner';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import StakedCommunitiesForm from '_components/Index/StakedCommunitiesForm';

type CommunitiesProps = {
  walletGroupID: string;
};

const Communities = (props: CommunitiesProps) => {
  const { getNFTBalances } = useNFTBalances();

  const [loadingData, setLoadingData] = useState(false);

  const [showAll, setShowAll] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [communities, setCommunities] = useState<Community[]>([]);

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(
    []
  );

  const [showStakedCommunitiesForm, setShowStakedCommunitiesForm] =
    useState(false);

  useEffect(() => {
    // getLinkedWallets(props.walletGroupID, setLinkedWallets);
  }, []);

  // useEffect(() => {
  //   if (!linkedWallets) return;
  //   checkForIdsInLinkedWallets(props.walletGroupID, linkedWallets);
  // }, [linkedWallets]);

  // useEffect(() => {
  //   if (!stakedCommunityIds || !pinnedCommunityIds || !linkedWallets) return;
  //   getCommunities(
  //     getNFTBalances,
  //     linkedWallets,
  //     updateData,
  //     chainId!,
  //     stakedCommunityIds,
  //     pinnedCommunityIds
  //   );
  // }, [chainId, pinnedCommunityIds, stakedCommunityIds]);

  // const updateData = (
  //   communities: Community[],
  //   pinnedCommunities: Community[]
  // ) => {
  //   setCommunities(communities);
  //   setFilteredCommunities(communities);
  //   setPinnedCommunities(pinnedCommunities);
  //   setLoadingData(false);
  // };

  useEffect(() => {
    const filteredCommunities = filterCommunities(communities, searchQuery);
    setFilteredCommunities(filteredCommunities);
  }, [searchQuery]);

  // useEffect(() => {
  //   if (!linkedWallets) return;
  //   const unsubscribePinned = subscribeToPinnedCommunityIds(
  //     props.walletGroupID,
  //     setPinnedCommunityIds
  //   );

  //   return unsubscribePinned;
  // }, [linkedWallets]);

  // useEffect(() => {
  //   if (!linkedWallets) return;
  //   const unsubscribeStaked = subscribeToStakedCommunityIds(
  //     props.walletGroupID,
  //     setStakedCommunityIds
  //   );

  //   return unsubscribeStaked;
  // }, [linkedWallets]);

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
      onClick={() => setShowStakedCommunitiesForm(!showStakedCommunitiesForm)}
      className={styles.buttonContainer.concat(
        showStakedCommunitiesForm
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
    <div className='mx-auto flex w-full max-w-[90%] flex-col gap-4 rounded-lg pt-12 pb-20 items-center'>
      <div className='text-2xl text-primary font-bold text-center'>
        Communities
      </div>

      <div className='flex flex-row-reverse gap-x-2 w-full'>
        {pinButton}
        {!isPinning ? showAllButton : null}
        {stakedNftsButton}
        <SearchBar
          onChange={(e: any) => setSearchQuery(e.target.value)}
          placeholder='Search'
        />
      </div>

      {showStakedCommunitiesForm && (
        <StakedCommunitiesForm walletGroupID={props.walletGroupID} />
      )}

      <div className='flex flex-col gap-12'>
        {communities.filter((val) => val.pinned).length ? (
          <div>
            <div className={styles.sectionHeading}>Pinned:</div>
            <div className={styles.communitiesContainer}>
              {communities
                .filter((val) => val.pinned)
                .map((pinnedCommunity) => (
                  <div className='relative' key={pinnedCommunity.id}>
                    {isPinning && (
                      <button
                        className='absolute top-0 right-0'
                        onClick={() =>
                          unpinCommunity(
                            props.walletGroupID,
                            pinnedCommunity.id
                          )
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

        {showAll || isPinning ? (
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
                          pinCommunity(props.walletGroupID, community.id)
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
