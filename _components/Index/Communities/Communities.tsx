import { useEffect, useState } from 'react';
import { Community } from '_types/Community';
import LoadingSpinner from '_styled/LoadingSpinner';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import CommunityButton from '_components/Index/Communities/CommunityButton';

type CommunitiesProps = {
  walletGroupID: string;
};

// TODO:
// Get Communities
const Communities = (props: CommunitiesProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  useEffect(() => {
    setCommunities([{ id: 'sappycoders', image: 'n/a', name: 'sappycoders' }]);
    setLoadingCommunities(false);
  }, [props.walletGroupID]);

  useEffect(() => {
    const filteredCommunities = filterCommunities(communities, searchQuery);
    setFilteredCommunities(filteredCommunities);
  }, [communities, searchQuery]);

  const toolbar = (
    <div className={styles.toolbarContainer}>
      <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
    </div>
  );

  const allCommunitiesDisplay = (
    <div className={styles.sectionContainer}>
      <div className={styles.sectionHeading}>All:</div>
      <div className={styles.communitiesContainer}>
        {filteredCommunities.map((community) => (
          <CommunityButton key={community.id} community={community} walletGroupID={props.walletGroupID} />
        ))}
      </div>
    </div>
  );

  return loadingCommunities ? (
    <LoadingSpinner />
  ) : (
    <div className={styles.container}>
      <div className={styles.heading}>Communities</div>

      {toolbar}

      <div className={styles.sectionsContainer}>{allCommunitiesDisplay}</div>
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
