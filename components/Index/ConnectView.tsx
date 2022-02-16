import { useMoralis } from 'react-moralis';
import { useState } from 'react';
import StyledButton from 'styled/StyledButton';

const ConnectView = () => {
  const { authenticate } = useMoralis();

  const [showOptions, setShowOptions] = useState(false);

  const connect = (chain: string) => {
    setShowOptions(false);
    chain == 'sol'
      ? authenticate({ type: 'sol' })
      : authenticate({ signingMessage: 'Please connect to 3Talent' });
  };

  const connectOptions = (
    <div className='absolute inset-0 flex justify-center items-center'>
      <div className='flex flex-col gap-2 p-2 rounded-lg bg bg-gray-900 p-6 text-white'>
        <button
          className='border-2 border-gray-800 p-4 rounded-lg bg-cyan-900 hover:bg-cyan-500'
          onClick={() => connect('eth')}
        >
          Connect on ETH, via Metamask
        </button>
        <button
          className='border-2 border-gray-800 p-4 rounded-lg bg-cyan-900 hover:bg-cyan-500'
          onClick={() => connect('sol')}
        >
          Connect on Solana, via Phantom
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex w-full h-full justify-center items-center'>
      <StyledButton
        text={'Connect Wallet'}
        onClick={() => setShowOptions(true)}
      />
      {showOptions ? connectOptions : null}
    </div>
  );
};

export default ConnectView;
