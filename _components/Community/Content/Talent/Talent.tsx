import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProfiles } from '_api/profiles';
import SearchBar from '_styled/SearchBar';
import LoadingSpinner from '_styled/LoadingSpinner';
import { Profile } from '_types/Profile';
import { filterProfiles } from '_helpers/filterProfiles';
import ExpandedProfileCard from '_components/Community/Content/Profile/ExpandedProfileCard';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';

const Talent = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [expandedProfile, setExpandedProfile] = useState<Profile>();

  useEffect(() => {
    const filteredProfiles = filterProfiles(profiles, searchQuery);
    setFilteredProfiles(filteredProfiles);
  }, [profiles, searchQuery]);

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

      <div className='grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-3 4xl:grid-cols-4 5xl:grid-cols-5'>
        {filteredProfiles.map((profile) => (
          <div
            key={profile.id}
            className='border-background border-4 hover:border-primaryDark rounded-lg'
            onClick={() => setExpandedProfile(profile)}
          >
            <ProfileCard profile={profile} />
          </div>
        ))}
      </div>

      {expandedProfile && (
        <div
          className='absolute inset-0 bg-black bg-opacity-90 flex justify-center'
          onClick={() => setExpandedProfile(undefined)}
        >
          <div className='max-w-screen-md w-[95%] flex items-center'>
            <ExpandedProfileCard profile={expandedProfile} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Talent;
