import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProfiles } from '_api/profiles';
import LoadingSpinner from '_styled/LoadingSpinner';
import { Profile } from '_types/Profile';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import { filterProfiles } from '_helpers/filterProfiles';
import SearchBar from '_styled/SearchBar';

const Talent = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const filteredProfiles = filterProfiles(profiles, searchQuery);
    setFilteredProfiles(filteredProfiles);
  }, [searchQuery]);

  const updateProfiles = (profiles: Profile[]) => {
    setProfiles(profiles);
    setFilteredProfiles(profiles);
    setLoadingProfiles(false);
  };

  useEffect(() => {
    getProfiles(communityId, updateProfiles);
  }, [communityId]);

  return loadingProfiles ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col gap-2 lg:gap-4'>
      <div className='flex justify-center lg:justify-end'>
        <SearchBar onChange={(e: any) => setSearchQuery(e.target.value)} placeholder='Search' />
      </div>
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5'>
        {filteredProfiles.map((profile) => (
          <div className='flex flex-col items-center' key={profile.id}>
            <ProfileCard profile={profile} />
          </div>
        ))}
        {filteredProfiles.map((profile) => (
          <div className='flex flex-col items-center' key={profile.id}>
            <ProfileCard profile={profile} />
          </div>
        ))}
        {filteredProfiles.map((profile) => (
          <div className='flex flex-col items-center' key={profile.id}>
            <ProfileCard profile={profile} />
          </div>
        ))}
        {filteredProfiles.map((profile) => (
          <div className='flex flex-col items-center' key={profile.id}>
            <ProfileCard profile={profile} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Talent;
