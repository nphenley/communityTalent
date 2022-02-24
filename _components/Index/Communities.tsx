import { useRouter } from 'next/router';
import { communityId } from '_constants/hardcoded';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as SPLToken from '@solana/spl-token';
import { checkMatches } from '_firebase/APIRequests';
import { useContext, useEffect, useState } from 'react';
import { ConnectionData } from '_types/ConnectionData';
import { ConnectionContext } from '_contexts/ConnectionContext';
import { useMoralis } from 'react-moralis';
import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';

const Communities = () => {
  const { user } = useMoralis();
  const router = useRouter();
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const [userCommunities, setUserCommunities] = useState<string[]>([]);

  const getUserNfts = async () => {
    let mint: string[] = [];
    const nfts = await getParsedNftAccountsByOwner({
      publicAddress: 'GxJukaJRcgzz8HJpdQTBaRiRH2yaBKPuMUtR4r82a1p7',
      connection: connection,
    });
    nfts.forEach((nft) => {
      mint.push(nft.mint);
    });
    return mint;
  };

  const findUserCommunities = async () => {
    const userNfts = await getUserNfts();
    console.log(userNfts);
    const userComms = await checkMatches(userNfts);

    setUserCommunities(userComms);
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  useEffect(() => {
    console.log(
      'length:',
      userCommunities.length,
      'userCommunities[0]:',
      userCommunities[0],
      'userCommunitiies:',
      JSON.stringify(userCommunities)
    );
  }, [userCommunities]);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      {userCommunities.length ? (
        userCommunities.map((community) => (
          <div>
            <button
              key={community}
              className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
              onClick={() => router.push(`/community/${community}`)}
            >
              {community}
            </button>
            <span>1</span>
          </div>
        ))
      ) : (
        <div>rip, no communities</div>
      )}
    </div>
  );
};

export default Communities;
