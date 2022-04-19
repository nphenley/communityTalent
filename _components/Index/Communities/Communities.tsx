import { useEffect, useState } from 'react';
import { Community } from '_types/Community';
import SearchBar from '_styled/SearchBar';
import { filterCommunities } from '_helpers/filterCommunities';
import CommunityCard from '_components/Index/Communities/CommunityCard';
import Image from 'next/image';
import Link from 'next/link';
import { privateCommunities } from '_constants/privateCommunities';
import LoadingSpinner from '_styled/LoadingSpinner';

type CommunitiesProps = {
  walletGroupID: string;
  communities: Community[];
};

const Communities = (props: CommunitiesProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(props.communities);

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
    <Link href={`community/all`}>
      <button
        className={
          'w-64 sm:w-[49%] md:w-[33%] lg:w-[24%] xl:w-[19%] py-12 relative flex flex-col items-center justify-center border-4 rounded-lg bg-backgroundDark border-backgroundDark hover:border-primaryDark'
        }
      >
        <div className={'w-[75%]'}>
          <div
            className={`-mt-2 mb-2 h-24 flex flex-col-reverse justify-center text-primary font-bold break-words uppercase leading-relaxed text-lg`}
          >
            All
          </div>
          <div className='relative flex flex-col w-[65%] md:w-[75%] mx-auto grow'>
            <div className='relative flex justify-center overflow-hidden border-4 rounded-full aspect-square border-primary'>
              <Image
                src={'assets/communityTalent.png'}
                layout='fill'
                placeholder={'blur'}
                blurDataURL={'assets/communityTalent.png'}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </button>
    </Link>
  );

  return (
    <div className={styles.container}>
      {toolbar}
      <div className={styles.sectionsContainer}>
        <div className={styles.sectionContainer}>
          <div className='text-primary text-lg font-bold uppercase'>Public:</div>
          {publicCard}

          <div className='mt-12 text-primary text-lg font-bold uppercase'>Private Communities:</div>
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
  container: 'mx-auto max-h-full flex w-[98%] max-w-screen-xl flex-col gap-4 rounded-lg items-center',
  toolbarContainer: 'flex flex-row-reverse gap-x-2 w-full',
  sectionsContainer: 'flex flex-col w-full',
  sectionContainer: 'flex flex-col gap-5 px-10 rounded-lg items-center',
  sectionHeading: 'text-xl font-bold text-primary',
  communitiesContainer:
    'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 pb-24',
  buttonContainer: 'rounded-lg px-5 font-bold ',
};
