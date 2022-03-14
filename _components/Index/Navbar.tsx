import { FaUserAlt, FaUsers } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';

type NavBarProps = {
  isAuthenticated: boolean;
  isShowingProfile: boolean;
  setIsShowingProfile: any;
};

const NavBar = (props: NavBarProps) => {
  const { logout } = useMoralis();

  const profileButton = (
    <div>
      {props.isShowingProfile ? (
        <button
          onClick={() => props.setIsShowingProfile(false)}
          className={styles.profileSubContainer}
        >
          <FaUsers size={20} />
          Communities
        </button>
      ) : (
        <button
          onClick={() => props.setIsShowingProfile(true)}
          className={styles.profileSubContainer}
        >
          <FaUserAlt size={14} />
          Profile
        </button>
      )}
    </div>
  );

  const title = (
    <div className='flex justify-center text-xl font-bold'>communityTalent</div>
  );

  const disconnectButton = (
    <button className='flex justify-end text-md' onClick={() => logout()}>
      Disconnect
    </button>
  );

  const connected = (
    <div className='grid grid-cols-3'>
      {profileButton}
      {title}
      {disconnectButton}
    </div>
  );

  const disconnected = <div className='flex justify-center'>{title}</div>;

  return (
    <div className='w-full p-8'>
      {props.isAuthenticated ? connected : disconnected}
    </div>
  );
};

export default NavBar;

const styles = {
  profileSubContainer: 'flex items-center justify-center gap-2',
};