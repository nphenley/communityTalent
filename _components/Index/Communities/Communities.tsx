import { useEffect, useState } from 'react';
import { Community } from '_types/Community';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import CommunityCard from '_components/Index/Communities/CommunityCard';
import Image from 'next/image';
import Link from 'next/link';
import { privateCommunities } from '_constants/privateCommunities';

type CommunitiesProps = {
  walletGroupID: string;
};

const Communities = (props: CommunitiesProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);

  useEffect(() => {
    // Use Wallet to figure out which communities man's has unlocked
  }, [props.walletGroupID]);

  useEffect(() => {
    const filteredCommunities = filterCommunities(privateCommunities, searchQuery);
    setFilteredCommunities(filteredCommunities);
  }, [searchQuery]);

  const toolbar = (
    <div className={styles.toolbarContainer}>
      <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
    </div>
  );

  const publicCard = (
    <Link href={`community/web3`}>
      <button className='w-[19%] h-72 flex flex-col gap-2 items-center justify-center bg-gradient-to-tr from-backgroundDark to-primaryDark pt-8 px-8 pb-8 rounded-lg'>
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

  return (
    <div className={styles.container}>
      <div className={styles.sectionsContainer}>
        {toolbar}

        <div className={styles.sectionContainer}>
          {publicCard}
          <div className={styles.communitiesContainer}>
            {filteredCommunities.map((community) => (
              <CommunityCard key={community.id} community={community} walletGroupID={props.walletGroupID} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Communities;

const styles = {
  container: 'mx-auto flex w-[85%] max-w-screen-xl flex-col gap-4 rounded-lg items-center',
  toolbarContainer: 'flex flex-row-reverse gap-x-2 w-full',
  sectionsContainer: 'flex flex-col w-full',
  sectionContainer: 'flex flex-col gap-8 p-12 rounded-lg items-center',
  sectionHeading: 'text-xl font-bold text-primary',
  communitiesContainer: 'grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-5 gap-x-4 gap-y-6',
  buttonContainer: 'rounded-lg px-5 font-bold ',
};
