import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProfiles } from '_firebase/APIRequests';
import LoadingSpinner from '_styled/LoadingSpinner';
import { Profile } from '_types/Profile';
import ProfileCard from '../Profile/ProfileCard';

const Talent = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [profiles, setProfiles] = useState<Profile[]>([]);

  const updateProfiles = (profiles: Profile[]) => {
    console.log(profiles);
    setProfiles(profiles);
    setLoadingProfiles(false);
  };

  useEffect(() => {
    getProfiles(communityId, updateProfiles);
  }, [communityId]);

  return loadingProfiles ? (
    <LoadingSpinner />
  ) : (
    <div className='grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-3'>
      {profiles.map((profile) => (
        <div className='flex items-center flex-col' key={profile.id}>
          <ProfileCard profile={profile} />
        </div>
      ))}
    </div>
  );
};

export default Talent;
