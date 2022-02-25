import { useRouter } from 'next/router';
import { checkMatches } from '_firebase/APIRequests';
import { useEffect, useState } from 'react';
import { getUserNftsSolana, getUserNftsEth } from '_helpers/getUserNfts';
import { Networks } from '_enums/Networks';
import { Community } from '_types/Community';
import { useNFTBalances } from 'react-moralis';

type CommunitiesProps = {
  network: Networks;
  connectedWalletAddress: string;
};

const Communities = (props: CommunitiesProps) => {
  const router = useRouter();
  const [data, setData] = useState<
    { community: Community; image: string; tokenAddress?: string }[]
  >([]);
  const { getNFTBalances } = useNFTBalances();

  const findUserCommunities = async () => {
    if (props.network === Networks.SOL) {
      const userNfts = await getUserNftsSolana(props.connectedWalletAddress);
      checkMatches(userNfts, setData);
    }
    if (props.network === Networks.ETH) {
      await getUserNftsEth(getNFTBalances, setData);
    }
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      <div className='w-full mr-12 border-2 shadow-lg border-primaryDark'>
        <div className='p-3'>All communities:</div>
        {data.length ? (
          data.map((elem) => (
            <button
              key={elem.community.communityId}
              onClick={() => {
                if (props.network === Networks.SOL) {
                  router.push(`community/${elem.community.communityId}`);
                } else {
                  router.push(`community/${elem.tokenAddress!}`);
                }
              }}
            >
              <div className='flex justify-center mb-2 overflow-hidden rounded-full w-44 h-44'>
                <img src={elem.image} height={150} width={150} loading='lazy' />
              </div>
              <div>{elem.community.name}</div>
            </button>
          ))
        ) : (
          <div>You are not eligible to join any communities!</div>
        )}
      </div>
    </div>
  );
};

export default Communities;
