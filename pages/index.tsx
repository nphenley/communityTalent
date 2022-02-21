import { useMoralis } from 'react-moralis';
import Head from 'next/head';

import Communities from 'components/Index/Communities';
import ConnectView from 'components/Index/ConnectView';

export default function Home() {
  const { isAuthenticated } = useMoralis();

  return (
    <div className='flex flex-col h-screen bg-background text-primary'>
      <Head>
        <title>3 Talent</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <NavBar />
      <div className='grow'>
        {isAuthenticated ? <Communities /> : <ConnectView />}
      </div>
    </div>
  );
}

// TODO:
// For now 1 wallet per profile - need to think properly how to do multiple wallets afterwards.
// LoadingSpinner

const NavBar = () => {
  return (
    <div className='w-full text-center uppercase text-xl p-8 font-bold'>
      3 Talent
    </div>
  );
};
