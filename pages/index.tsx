import { useMoralis } from 'react-moralis';
import Head from 'next/head';

import Communities from '_components/Index/Communities';
import ConnectView from '_components/Index/ConnectView';
import { Networks } from '_enums/Networks';

export default function Home() {
  const { isAuthenticated, user } = useMoralis();

  const network: Networks = user?.attributes.ethAddress
    ? Networks.ETH
    : Networks.SOL;

  const connectedWalletAddress =
    network === Networks.ETH
      ? user?.attributes.ethAddress
      : user?.attributes.solAddress;

  return (
    <div className='flex flex-col h-screen bg-background text-primary'>
      <Head>
        <title>Web 3 Talent</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <NavBar />
      <div className='overflow-y-scroll grow'>
        {isAuthenticated ? (
          <>
            <DisconnectButton />
            <Communities
              network={network}
              connectedWalletAddress={connectedWalletAddress}
            />
          </>
        ) : (
          <ConnectView />
        )}
      </div>
    </div>
  );
}

const NavBar = () => {
  return (
    <div className='w-full p-8 text-xl font-bold text-center uppercase'>
      Web 3 Talent
    </div>
  );
};

const DisconnectButton = () => {
  const { logout } = useMoralis();

  return (
    <div className='absolute right-3 top-6'>
      <button onClick={() => logout()} className='p-2 rounded-full'>
        Disconnect
      </button>
    </div>
  );
};
