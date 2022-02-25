import { useRouter } from 'next/router';
import { checkMatches } from '_firebase/APIRequests';
import { useEffect, useState } from 'react';
import { getUserNftsSolana } from '_helpers/getUserNfts';
import { Networks } from '_enums/Networks';
import { Community } from '_types/Community';

type CommunitiesProps = {
  network: Networks;
  connectedWalletAddress: string;
};

const Communities = (props: CommunitiesProps) => {
  const router = useRouter();
  const [data, setData] = useState<{ community: Community; image: string }[]>(
    []
  );

  const findUserCommunities = async () => {
    const userNfts = await getUserNftsSolana(props.connectedWalletAddress);
    checkMatches(userNfts, setData);
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      {data.length ? (
        data.map((elem) => (
          <button
            key={elem.community.communityId}
            onClick={() =>
              router.push(`community/${elem.community.communityId}`)
            }
          >
            <div className='flex justify-center overflow-hidden rounded-full'>
              <img src={elem.image} height={150} width={150} />
            </div>
            {elem.community.name}
          </button>
        ))
      ) : (
        <div>You are not eligible to join any communities!</div>
      )}
    </div>
  );
};

export default Communities;
