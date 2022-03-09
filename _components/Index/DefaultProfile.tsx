import CreateProfileForm from '_components/ProfileForms/CreateProfileForm';
import EditProfileForm from '_components/ProfileForms/EditProfileForm';
import { ProfileType } from '_enums/ProfileType';
import { Profile } from '_types/Profile';

type DefaultProfileProps = {
  walletAddress: string;
  setIsShowingProfile: any;
  existingDefaultProfile: Profile | undefined;
};

const DefaultProfile = (props: DefaultProfileProps) => {
  return (
    <div className={styles.container}>
      {!props.existingDefaultProfile ? (
        <CreateProfileForm
          walletAddress={props.walletAddress}
          setIsShowingProfile={props.setIsShowingProfile}
          type={ProfileType.Default}
        />
      ) : (
        <EditProfileForm
          setIsShowingProfile={props.setIsShowingProfile}
          profile={props.existingDefaultProfile}
          type={ProfileType.Default}
        />
      )}
    </div>
  );
};

export default DefaultProfile;

const styles = {
  container: 'flex justify-center',
};
