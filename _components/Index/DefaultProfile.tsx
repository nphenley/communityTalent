import CreateProfileForm from '_components/Community/CreateProfileForm';

type DefaultProfileProps = {
  connectedWalletAddress: string;
};

const DefaultProfile = (props: DefaultProfileProps) => {
  return (
    <div className={styles.container}>
      <CreateProfileForm />
    </div>
  );
};

export default DefaultProfile;

const styles = {
  container: 'flex justify-center',
};
