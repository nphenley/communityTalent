import { useRouter } from 'next/router';
import { communityId } from '_constants/hardcoded';
import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import * as SPLToken from '@solana/spl-token';
import { checkMatches } from '_firebase/APIRequests';
import { useEffect, useState } from 'react';
const Communities = () => {
  const router = useRouter();
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const [userCommunities, setUserCommunities] = useState<string[]>([]);
  const getUserNfts = async () => {
    let allAccounts: string[] = [];
    let response = await connection.getTokenAccountsByOwner(
      new PublicKey('GxJukaJRcgzz8HJpdQTBaRiRH2yaBKPuMUtR4r82a1p7'),
      {
        programId: TOKEN_PROGRAM_ID,
      }
    );
    response.value.forEach((e) => {
      const accountInfo = SPLToken.AccountLayout.decode(e.account.data);
      allAccounts.push(new PublicKey(accountInfo.mint).toString());
    });
    return allAccounts;
  };

  const findUserCommunities = async () => {
    const userNfts = await getUserNfts();
    const userComms = await checkMatches(userNfts);
    setUserCommunities(userComms);
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      {userCommunities ? (
        userCommunities.map((community) => (
          <button
            key={community}
            className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
            onClick={() => router.push(`/community/${community}`)}
          >
            {community}
          </button>
        ))
      ) : (
        <div>rip, no communities</div>
      )}
    </div>
  );
};

export default Communities;
