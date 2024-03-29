import { FaBars } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';

type TopBarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: any;
  hideHamburgerMenu?: boolean;
};

const TopBar = (props: TopBarProps) => {
  const { logout } = useMoralis();

  const title = <h1 className='text-xl font-bold'>communityTalent</h1>;

  const hamburgerButton = (
    <div className={styles.hamburgerButtonContainer}>
      <button onClick={() => props.setIsSidebarOpen(true)} className={styles.hamburgerButton}>
        <FaBars size='20' />
      </button>
    </div>
  );

  const disconnectButton = (
    <div className={styles.disconnectButtonContainer}>
      <button onClick={logout} className={styles.disconnectButton}>
        Disconnect
      </button>
    </div>
  );

  return (
    <div className={styles.container}>
      {props.hideHamburgerMenu || props.isSidebarOpen ? null : hamburgerButton}
      {title}
      {disconnectButton}
    </div>
  );
};

export default TopBar;

const styles = {
  container: 'relative py-5 text-primary w-full flex justify-center items-center',
  disconnectButtonContainer: 'absolute right-3 h-full flex items-center',
  disconnectButton: 'p-2 rounded-full',
  hamburgerButtonContainer: 'md:hidden absolute left-5 h-full flex items-center',
  hamburgerButton: 'p-2',
};
