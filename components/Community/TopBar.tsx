import { FaBars } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';

type TopBarProps = {
  isOpen: boolean;
  setIsOpen: any;
};

const TopBar = (props: TopBarProps) => {
  const { logout } = useMoralis();

  const title = <h1 className='text-xl'>3TALENT</h1>;

  const hamburgerButton = (
    <button
      onClick={() => props.setIsOpen(true)}
      className={styles.hamburgerButton}
    >
      <FaBars size='20' />
    </button>
  );

  const disconnectButton = (
    <button onClick={logout} className={styles.connectButton}>
      Disconnect
    </button>
  );

  return (
    <div className={styles.container}>
      {props.isOpen ? null : hamburgerButton}
      {title}
      {disconnectButton}
    </div>
  );
};

export default TopBar;

const styles = {
  container:
    'relative py-5 bg-gray-900 text-cyan-400 flex justify-center items-center',
  connectButton: 'absolute top-5 right-8',
  hamburgerButton: 'absolute top-5 left-8',
};
