import { HomeSection } from 'pages';
import { useState } from 'react';
import { FaLink, FaUsers } from 'react-icons/fa';
import { useMoralis } from 'react-moralis';
import Button from '_styled/Button';

type NavBarProps = {
  isAuthenticated: boolean;
  homeSection: HomeSection;
  setHomeSection: any;
};

const NavBar = (props: NavBarProps) => {
  const { logout, authenticate } = useMoralis();

  const [showOptions, setShowOptions] = useState(false);

  const connect = (chain: string) => {
    setShowOptions(false);
    const signingMessage = 'Please authenticate with communityTalent.';
    chain == 'sol'
      ? authenticate({ type: 'sol', signingMessage: signingMessage })
      : authenticate({ type: 'evm', signingMessage: signingMessage });
  };

  const connectOptions = (
    <div className='absolute inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center'>
      <div className='flex flex-col gap-5 p-8 text-white rounded-lg bg-backgroundDark bg'>
        <button className='p-4 rounded-lg bg-primary hover:bg-primaryDark' onClick={() => connect('eth')}>
          Connect on ETH, via Metamask
        </button>
        <button className='p-4 rounded-lg bg-primary hover:bg-primaryDark' onClick={() => connect('sol')}>
          Connect on Solana, via Phantom
        </button>
      </div>
    </div>
  );

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

  const title = <div className='invisible sm:visible flex justify-center text-xl font-bold'>communityTalent</div>;

  const disconnectButton = (
    <button className='flex justify-end items-center text-md' onClick={() => logout()}>
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

  const disconnected = (
    <div className='grid grid-cols-3'>
      <div className='col-start-2'>{title}</div>
      <button className='flex justify-end items-center text-md' onClick={() => setShowOptions(true)}>
        Connect
      </button>

      {showOptions ? connectOptions : null}
    </div>
  );

  return <div className='w-full p-8 select-none text-primary'>{props.isAuthenticated ? connected : disconnected}</div>;
};

export default NavBar;

const styles = {
  profileSubContainer: 'flex items-center justify-center gap-2',
};
