import { FaBars } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';
type TopBarProps = {
  isOpen: boolean;
  setIsOpen: any;
};

const TopBar = (props: TopBarProps) => {
  const title = <h1 className='text-xl'>3TALENT</h1>;

  const { authenticate, isAuthenticated, logout } = useMoralis();

  function loginout(auth) {
    if (auth) {
      logout();
    } else {
      authenticate({ signingMessage: 'Please connect to 3Talent' });
    }
  }

  const connectButton = (
    <button
      onClick={() => loginout(isAuthenticated)}
      className={styles.connectButton}
    >
      {isAuthenticated ? 'Connected' : 'Connect'}
    </button>
  );

  const hamburgerButton = (
    <button
      onClick={() => props.setIsOpen(true)}
      className={styles.hamburgerButton}
    >
      <FaBars size='20' />
    </button>
  );

  return (
    <div className={styles.container}>
      {props.isOpen ? null : hamburgerButton}
      {title}
      {connectButton}
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
