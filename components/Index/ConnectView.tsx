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
    <div className='absolute inset-0 flex items-center justify-center'>
      <div className='flex flex-col gap-2 p-6 text-white bg-backgroundDark rounded-lg bg'>
        <button
          className='p-4 rounded-lg bg-primary hover:bg-primaryLight'
          onClick={() => connect('eth')}
        >
          Connect on ETH, via Metamask
        </button>
        <button
          className='p-4 rounded-lg bg-primary hover:bg-primaryLight'
          onClick={() => connect('sol')}
        >
          Connect on Solana, via Phantom
        </button>
      </div>
    </div>
  );

  return (
    <div className='flex items-center justify-center w-full h-full'>
      <StyledButton
        text={'Connect Wallet'}
        onClick={() => setShowOptions(true)}
      />
      {showOptions ? connectOptions : null}
    </div>
  );
};

export default ConnectView;
