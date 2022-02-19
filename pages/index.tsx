import { useMoralis } from 'react-moralis';

import Communities from 'components/Index/Communities';
import ConnectView from 'components/Index/ConnectView';

export default function Home() {
  const { isAuthenticated } = useMoralis();

  return (
    <div className='flex flex-col h-screen bg-gray-800 text-cyan-500'>
      <NavBar />
      <div className='grow'>
        {isAuthenticated ? <Communities /> : <ConnectView />}
      </div>
    </div>
  );
}

// TODO:
// SideBar moving in and out needs to be animated. ease-in-out duration-300
// Needs to be made responsive to mobile screens, sidebar functionality.
// For now 1 wallet per profile - need to think properly how to do multiple wallets afterwards.
// Actually read NFTs from wallet to see which to do
// LoadingSpinner

// Notes:
// Maybe a bug with tailwind using w- and h- lol
// Use padding instead

const NavBar = () => {
  return (
    <div className='w-full text-center uppercase text-xl p-8 bg-gray-900 font-bold'>
      3 Talent
    </div>
  );
};
