type DefaultProfileProps = {
  connectedWalletAddress: string;
};

const DefaultProfile = (props: DefaultProfileProps) => {
  return (
    <div className={styles.container}>
      your wallet is {props.connectedWalletAddress}
    </div>
  );
};

export default DefaultProfile;

const styles = {
  container: 'flex justify-center',
};
