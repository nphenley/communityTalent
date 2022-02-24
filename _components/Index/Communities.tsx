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
  const [communities, setCommunities] = useState<Community[]>([]);

  const findUserCommunities = async () => {
    const userNfts = await getUserNftsSolana(props.connectedWalletAddress);
    checkMatches(userNfts, setCommunities);
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      {communities.length ? (
        communities.map((community) => (
          <button
            key={community.communityId}
            className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
            onClick={() => router.push(`/community/${community.communityId}`)}
          >
            {community.name}
          </button>
        ))
      ) : (
        <div>You are not eligible to join any communities!</div>
      )}
    </div>
  );
};

export default Communities;
