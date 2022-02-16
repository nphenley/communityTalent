import { useMoralis } from 'react-moralis';
import { useRouter } from 'next/router';
import { communityId } from 'hardcoded';
import { useState } from 'react';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, authenticate } = useMoralis();

  const [showOptions, setShowOptions] = useState(false);

  function connect(chain: string) {
    if (chain == 'sol') {
      authenticate({ type: 'sol' });
      setShowOptions(false);
    }
    if (chain == 'eth') {
      authenticate({ signingMessage: 'Please connect to 3Talent' });
      setShowOptions(false);
    }
  }

  const connectOptions = (
    <div>
      <button onClick={() => connect('eth')}>
        Connect on ETH, via Metamask
      </button>
      <button onClick={() => connect('sol')}>
        Connect on Solana, via Phantom
      </button>
    </div>
  );

  const connectButton = (
    <button onClick={() => setShowOptions(true)}>Connect Wallet</button>
  );

  const connectWalletView = (
    <div>
      {connectButton}
      {showOptions ? connectOptions : null}
    </div>
  );

  if (!isAuthenticated) return connectWalletView;

  return isAuthenticated ? (
    <button onClick={() => router.push(`/community/${communityId}`)}>
      go to community
    </button>
  ) : (
    connectWalletView
  );
}

// TODO:
// SideBar moving in and out needs to be animated. ease-in-out duration-300
// Needs to be made responsive to mobile screens, sidebar functionality.
// For now 1 wallet per profile - need to think properly how to do multiple wallets afterwards.
// Actually read NFTs from wallet to see which to do
// Double-check that saving moralis session in local storage is safe lol

// Notes:
// Maybe a bug with tailwind using w- and h- lol
// Use padding instead
