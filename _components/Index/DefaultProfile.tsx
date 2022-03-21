import { useEffect, useState } from 'react';
import { subscribeToDefaultProfile } from '_api/profiles';
import CreateProfileForm from '_components/ProfileForms/CreateProfileForm';
import EditProfileForm from '_components/ProfileForms/EditProfileForm';
import { ProfileType } from '_enums/ProfileType';
import { Profile } from '_types/Profile';

type DefaultProfileProps = {
  walletGroupID: string;
  onSubmit: any;
};

const DefaultProfile = (props: DefaultProfileProps) => {
  const [defaultProfile, setDefaultProfile] = useState<Profile>();

  useEffect(() => {
    subscribeToDefaultProfile(props.walletGroupID, setDefaultProfile);
  }, []);

  return (
    <div className={styles.container}>
      {defaultProfile ? (
        <EditProfileForm
          onSubmit={props.onSubmit}
          profile={defaultProfile}
          type={ProfileType.DEFAULT}
        />
      ) : (
        <CreateProfileForm
          walletGroupID={props.walletGroupID}
          onSubmit={props.onSubmit}
          type={ProfileType.DEFAULT}
        />
      )}
    </div>
  );
};

export default DefaultProfile;

const styles = {
  container: 'flex justify-center',
};
