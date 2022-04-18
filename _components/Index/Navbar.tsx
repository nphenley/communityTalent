import { HomeSection } from 'pages';
import { FaLink, FaUserAlt, FaUsers } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';

type NavBarProps = {
  isAuthenticated: boolean;
  homeSection: HomeSection;
  setHomeSection: any;
};

const NavBar = (props: NavBarProps) => {
  const { logout } = useMoralis();

  const communitiesButton = (
    <button onClick={() => props.setHomeSection(HomeSection.COMMUNITIES)} className={styles.profileSubContainer}>
      <FaUsers size={20} />
      Communities
    </button>
  );

  const linkWalletsButton = (
    <button onClick={() => props.setHomeSection(HomeSection.WALLETGROUPS)} className={styles.profileSubContainer}>
      <FaLink size={14} />
      Link Wallets
    </button>
  );

  const title = <div className='flex justify-center text-xl font-bold'>communityTalent</div>;

  const disconnectButton = (
    <button className='flex justify-end text-md' onClick={() => logout()}>
      Disconnect
    </button>
  );

  const connected = (
    <div className='grid grid-cols-3'>
      <div className='flex gap-4'>
        {props.homeSection !== HomeSection.WALLETGROUPS ? linkWalletsButton : communitiesButton}
      </div>
      {title}
      {disconnectButton}
    </div>
  );

  const disconnected = <div className='flex justify-center'>{title}</div>;

  return <div className='w-full p-8 select-none text-primary'>{props.isAuthenticated ? connected : disconnected}</div>;
};

export default NavBar;

const styles = {
  profileSubContainer: 'flex items-center justify-center gap-2',
};
