import { useEffect, useState } from 'react';
import { Community } from '_types/Community';
import LoadingSpinner from '_styled/LoadingSpinner';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import CommunityCard from '_components/Index/Communities/CommunityCard';
import Image from 'next/image';
import Link from 'next/link';

type CommunitiesProps = {
  walletGroupID: string;
};

// TODO:
// Get Communities
// Make sure all the images are the same size in the cards
const Communities = (props: CommunitiesProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [loadingCommunities, setLoadingCommunities] = useState(true);
  const [communities, setCommunities] = useState<Community[]>([]);

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  useEffect(() => {
    setCommunities([
      { id: 'doodles', image: 'assets/doodles.png', name: 'Doodles', isOwnedByUser: true },
      { id: 'coolcats', image: 'assets/coolcat.png', name: 'Cool Cats', isOwnedByUser: true },
      { id: 'chimpions', image: 'assets/chimpions.png', name: 'Chimpions', isOwnedByUser: true },
      {
        id: 'boredapeyachtclub',
        image: 'assets/boredapeyachtclub.png',
        name: 'BAYC',
        isOwnedByUser: true,
      },
      { id: 'chimpions2', image: 'assets/chimpions.png', name: 'Chimpions', isOwnedByUser: true },
      { id: 'sappyseals7', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals9', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'chimpions3', image: 'assets/chimpions.png', name: 'Chimpions', isOwnedByUser: false },
      { id: 'sappyseals10', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals11', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals12', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals13', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals14', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals15', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
      { id: 'sappyseals16', image: 'assets/sappyseals.png', name: 'Sappy Seals', isOwnedByUser: false },
    ]);
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

  const publicCard = (
    <Link href={`community/web3`}>
      <button className='flex flex-col gap-2 items-center justify-center bg-gradient-to-t from-backgroundDark to-primaryDark pt-8 px-8 pb-8 rounded-lg'>
        <div className={`text-primary text-2xl font-bold break-all stroke-black`}>All</div>
        <div className='flex justify-center overflow-hidden rounded-full'>
          <Image
            src={'assets/communityTalent.png'}
            height={150}
            width={150}
            placeholder={'blur'}
            blurDataURL={'assets/communityTalent.png'}
            unoptimized={true}
          />
        </div>
      </button>
    </Link>
  );

  const allCommunitiesDisplay = (
    <div className={styles.sectionContainer}>
      <div className={styles.communitiesContainer}>
        {publicCard}
        {filteredCommunities.map((community) => (
          <CommunityCard key={community.id} community={community} walletGroupID={props.walletGroupID} />
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
  container: 'mx-auto flex w-[85%] max-w-screen-xl flex-col gap-12 rounded-lg items-center',
  heading: 'text-2xl text-primary font-bold text-center',
  toolbarContainer: 'flex flex-row-reverse gap-x-2 w-full',
  sectionsContainer: 'flex flex-col gap-12',
  sectionContainer: 'flex flex-col gap-14 p-12 rounded-lg',
  sectionHeading: 'text-xl font-bold text-primary',
  communitiesContainer: 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-5 gap-x-4 gap-y-6',
  buttonContainer: 'rounded-lg px-5 font-bold ',
};
