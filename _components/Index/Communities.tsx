import { useRouter } from 'next/router';
import { checkMatches } from '_firebase/APIRequests';
import { useEffect, useState } from 'react';
import { getUserNftsSolana, getUserNftsEth } from '_helpers/getUserNfts';
import { Networks } from '_enums/Networks';
import { Community } from '_types/Community';
import { useNFTBalances } from 'react-moralis';
import LoadingSpinner from '_styled/LoadingSpinner';
import Image from 'next/image';

type CommunitiesProps = {
  network: Networks;
  connectedWalletAddress: string;
};

const Communities = (props: CommunitiesProps) => {
  const router = useRouter();
  const { getNFTBalances } = useNFTBalances();

  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState<Community[]>([]);

  const updateData = (data: Community[]) => {
    setData(data);
    setLoadingData(false);
  };

  const findUserCommunities = async () => {
    switch (props.network) {
      case Networks.SOL:
        const userNfts = await getUserNftsSolana(props.connectedWalletAddress);
        checkMatches(userNfts, updateData);
        break;

      case Networks.ETH:
        await getUserNftsEth(
          getNFTBalances,
          props.connectedWalletAddress,
          updateData
        );
        break;
    }
  };

  useEffect(() => {
    findUserCommunities();
  }, []);

  return loadingData ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col max-w-[90%] pt-12 pb-20 mx-auto w-full gap-12 rounded-lg'>
      <div className={styles.heading}>Pinned Communities:</div>
      {data.length ? (
        <div className={styles.communitiesContainer}>
          {data.map((elem) => (
            <CommunityButton key={elem.id} community={elem} router={router} />
          ))}
        </div>
      ) : (
        <div>You are not eligible to join any communities!</div>
      )}
    </div>
  );
};

export default Communities;

type CommunityButtonProps = {
  community: Community;
  router: any;
};
const CommunityButton = (props: CommunityButtonProps) => {
  return (
    <button
      className='mx-auto space-y-3 flex-col flex items-center'
      key={props.community.id}
      onClick={() => {
        props.router.push(`community/${props.community.id}`);
      }}
    >
      <div className='flex justify-center overflow-hidden rounded-full'>
        <Image
          src={props.community.image}
          height={150}
          width={150}
          placeholder={'blur'}
          blurDataURL={props.community.image}
          unoptimized={true}
        />
      </div>
      <div className='font-medium break-all'>{props.community.name}</div>
    </button>
  );
};

const styles = {
  heading: 'text-xl font-bold text-center',
  communitiesContainer:
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 gap-x-0 gap-y-12',
};
