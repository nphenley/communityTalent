import { FaBars } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';
import { useState } from 'react';

type TopBarProps = {
  isOpen: boolean;
  setIsOpen: any;
};

const TopBar = (props: TopBarProps) => {
  const title = <h1 className='text-xl'>3TALENT</h1>;
  const [showOptions, setShowOptions] = useState(false);

  const { authenticate, isAuthenticated, logout } = useMoralis();

  function loginout(auth: boolean, chain: string) {
    if (auth) {
      logout();
    } else {
      if (chain == 'sol') {
        authenticate({ type: 'sol' });
        setShowOptions(false);
      }
      if (chain == 'eth') {
        authenticate({ signingMessage: 'Please connect to 3Talent' });
        setShowOptions(false);
      }
    }
  }

  const connectOptions = (
    <div className='fixed z-40 w-56 h-32 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg left-1/2 top-1/2'>
      <button onClick={() => loginout(isAuthenticated, 'eth')}>
        Connect with Metamask
      </button>
      <button onClick={() => loginout(isAuthenticated, 'sol')}>
        Connect with Phantom
      </button>
    </div>
  );

  const connectButton = (
    <button
      onClick={() => {
        if (!isAuthenticated) {
          setShowOptions(!showOptions);
        } else {
          loginout(isAuthenticated, 'eth');
        }
      }}
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
      {showOptions ? connectOptions : null}
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
