import CreateProfileForm from '_components/Community/CreateProfileForm';

type DefaultProfileProps = {
  walletAddress: string;
};

const DefaultProfile = (props: DefaultProfileProps) => {
  return (
    <div className={styles.container}>
      {/* <CreateProfileForm /> */}
      This still needs doing properly, creating a profile for your wallet
      address.
    </div>
  );
};

export default DefaultProfile;

const styles = {
  container: 'flex justify-center',
};
