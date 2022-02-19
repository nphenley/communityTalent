import { useContext, useState, useEffect, useMemo } from 'react';
import { ConnectionContext } from 'contexts/ConnectionContext';
import { getProfile } from '_firebase/APIRequests';
import { Profile } from 'types/Profile';
import { communityId } from 'constants/hardcoded';
import ProfileCard from 'components/Community/Content/Profile/ProfileCard';
import EditProfileCard from 'components/Community/Content/Profile/EditProfileCard';
import LoadingSpinner from 'styled/LoadingSpinner';

const Profile = () => {
  const connectionData = useContext(ConnectionContext);
  const [profile, setProfile] = useState<Profile>();
  const [edit, setEdit] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    getProfile(communityId, connectionData?.wallet.address!, setProfile);
  }, []);

  useEffect(() => {
    if (!profile) return;
    setLoadingProfile(false);
  }, [profile]);

  return (
    <div className='flex flex-col items-center'>
      <div className='mt-4 '>
        {loadingProfile ? (
          <LoadingSpinner />
        ) : !edit ? (
          <ProfileCard profile={profile!} setEdit={setEdit} />
        ) : (
          <EditProfileCard
            profile={profile!}
            setEdit={setEdit}
            getProfile={async () =>
              getProfile(
                communityId,
                connectionData?.wallet.address!,
                setProfile
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
