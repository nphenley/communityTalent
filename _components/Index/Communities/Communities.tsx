import { useEffect, useState } from 'react';
import { addTokenAddresses, subscribeToPinnedCommunityIds, subscribeToStakedCommunities } from '_api/communities';
import { Community } from '_types/Community';
import { useNFTBalances } from 'react-moralis';
import LoadingSpinner from '_styled/LoadingSpinner';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import StakedCommunitiesForm from '_components/Index/Communities/StakedCommunitiesForm';
import CommunityButton from '_components/Index/Communities/CommunityButton';
import { getWalletCommunities } from '_helpers/getWalletCommunities';
import { solStakingWithToken } from '_helpers/getNFTImages';

type CommunitiesProps = {
  walletGroupID: string;
};

const Communities = (props: CommunitiesProps) => {
  const { getNFTBalances } = useNFTBalances();

  const [showAll, setShowAll] = useState(false);
  const [isPinning, setIsPinning] = useState(false);
  const [showStakedCommunitiesForm, setShowStakedCommunitiesForm] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const [loadingPinnedCommunityIds, setLoadingPinnedCommunityIds] = useState(true);
  const [pinnedCommunityIds, setPinnedCommunityIds] = useState<string[]>([]);
  const [pinnedCommunities, setPinnedCommunities] = useState<Community[]>([]);

  const [loadingStakedCommunities, setLoadingStakedCommunities] = useState(true);
  const [stakedCommunities, setStakedCommunities] = useState<Community[]>([]);

  const [loadingWalletCommunities, setLoadingWalletCommunities] = useState(true);
  const [walletCommunities, setWalletCommunities] = useState<Community[]>([]);

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  useEffect(() => {
    solStakingWithToken('8ysBSwG9d6Rnt4zE5RERh8XmfKNGWhakoJa93sVx5DM9', 'ssc');
  }, []);

  useEffect(() => {
    const unsubToPinnedCommunityIds = subscribeToPinnedCommunityIds(props.walletGroupID, (ids: string[]) => {
      setPinnedCommunityIds(ids);
      setLoadingPinnedCommunityIds(false);
    });

    const unsubToStakedCommunities = subscribeToStakedCommunities(
      props.walletGroupID,
      (stakedCommunities: Community[]) => {
        setStakedCommunities(stakedCommunities);
        setLoadingStakedCommunities(false);
      }
    );

    (async () => {
      setLoadingWalletCommunities(true);
      const walletCommunities = await getWalletCommunities(getNFTBalances, props.walletGroupID);
      setWalletCommunities(walletCommunities);
      setLoadingWalletCommunities(false);
    })();

    return () => {
      unsubToPinnedCommunityIds();
      unsubToStakedCommunities();
    };
  }, [props.walletGroupID]);

  useEffect(() => {
    const filteredCommunities = filterCommunities(walletCommunities.concat(stakedCommunities), searchQuery);
    setFilteredCommunities(filteredCommunities);
  }, [walletCommunities, stakedCommunities, searchQuery]);

  useEffect(() => {
    const pinnedCommunities = filteredCommunities.filter((community) => pinnedCommunityIds.includes(community.id));
    setPinnedCommunities(pinnedCommunities);
  }, [pinnedCommunityIds, filteredCommunities]);

  const showAllButton = (
    <button
      className={styles.buttonContainer.concat(
        showAll ? ' bg-primary text-white' : ' bg-backgroundDark text-backgroundLight'
      )}
      onClick={() => setShowAll(!showAll)}
    >
      Show All
    </button>
  );

  const isPinningButton = (
    <button
      onClick={() => setIsPinning(!isPinning)}
      className={styles.buttonContainer.concat(
        isPinning ? ' bg-primary text-white' : ' bg-backgroundDark text-backgroundLight'
      )}
    >
      Pin
    </button>
  );

  const stakedNftsButton = (
    <button
      onClick={() => setShowStakedCommunitiesForm(!showStakedCommunitiesForm)}
      className={styles.buttonContainer.concat(
        showStakedCommunitiesForm ? ' bg-primary text-white' : ' bg-backgroundDark text-backgroundLight'
      )}
    >
      Staked
    </button>
  );

  const toolbar = (
    <div className={styles.toolbarContainer}>
      {isPinningButton}
      {!isPinning || !pinnedCommunities.length ? showAllButton : null}
      {stakedNftsButton}
      <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
    </div>
  );

  const pinnedCommunitiesDisplay = (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeading}>Pinned:</div>
      <div className={styles.communitiesContainer}>
        {pinnedCommunities.map((pinnedCommunity) => (
          <CommunityButton
            key={pinnedCommunity.id}
            community={pinnedCommunity}
            pinningState={isPinning ? 'unpin' : 'none'}
            walletGroupID={props.walletGroupID}
          />
        ))}
      </div>
    </div>
  );

  const allCommunitiesDisplay = (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeading}>All:</div>
      <div className={styles.communitiesContainer}>
        {filteredCommunities.map((community) => (
          <CommunityButton
            key={community.id}
            community={community}
            pinningState={isPinning ? 'pin' : 'none'}
            walletGroupID={props.walletGroupID}
          />
        ))}
      </div>
    </div>
  );

  return loadingPinnedCommunityIds || loadingWalletCommunities || loadingStakedCommunities ? (
    <LoadingSpinner />
  ) : (
    <div className={styles.container}>
      <div className={styles.heading}>Communities</div>

      {toolbar}

      {showStakedCommunitiesForm && <StakedCommunitiesForm walletGroupID={props.walletGroupID} />}

      <div className={styles.sectionsContainer}>
        {pinnedCommunities.length ? pinnedCommunitiesDisplay : null}
        {(showAll || isPinning || !pinnedCommunities.length) && filteredCommunities.length
          ? allCommunitiesDisplay
          : null}
      </div>
    </div>
  );
};

export default Communities;

const styles = {
  container: 'mx-auto flex w-full max-w-[90%] flex-col gap-12 rounded-lg items-center',
  heading: 'text-2xl text-primary font-bold text-center',
  toolbarContainer: 'flex flex-row-reverse gap-x-2 w-full',
  sectionsContainer: 'flex flex-col gap-12',
  sectionContainer: 'flex flex-col gap-14',
  sectionHeading: 'text-xl font-bold text-primary',
  communitiesContainer:
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 gap-x-24 gap-y-12',
  buttonContainer: 'rounded-lg px-5 font-bold ',
};
