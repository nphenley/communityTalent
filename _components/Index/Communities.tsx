import { useRouter } from 'next/router';
import {
  checkMatches,
  pinCommunity,
  unpinCommunity,
} from '_firebase/APIRequests';
import { useEffect, useState } from 'react';
import { getUserNftsSolana, getUserNftsEth } from '_helpers/getUserNfts';
import { Networks } from '_enums/Networks';
import { Community } from '_types/Community';
import { useMoralis, useNFTBalances } from 'react-moralis';
import LoadingSpinner from '_styled/LoadingSpinner';
import Image from 'next/image';
import { validChainIds } from '_constants/validChainIds';

type CommunitiesProps = {
  network: Networks;
  connectedWalletAddress: string;
};

const Communities = (props: CommunitiesProps) => {
  const router = useRouter();
  const { getNFTBalances } = useNFTBalances();
  const { chainId } = useMoralis();

  const [loadingData, setLoadingData] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  const [communities, setCommunities] = useState<Community[]>([]);
  const [pinnedCommunities, setPinnedCommunities] = useState<Community[]>([]);

  const updateData = (
    communities: Community[],
    pinnedCommunities: Community[]
  ) => {
    setCommunities(communities);
    setPinnedCommunities(pinnedCommunities);
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
          updateData,
          chainId ? chainId : 'eth'
        );
        break;
    }
  };

  useEffect(() => {
    console.log(chainId);
  }, [chainId]);

  useEffect(() => {
    if (!chainId) {
      setLoadingData(false);
    } else if (validChainIds.includes(chainId)) {
      findUserCommunities();
    }
  }, [chainId]);

  return loadingData ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col max-w-[90%] pt-12 pb-20 mx-auto w-full gap-4 rounded-lg'>
      <div className='text-2xl font-bold text-center'>Communities</div>
      <div className='flex flex-row-reverse gap-x-2'>
        <button
          onClick={() => setIsPinning(!isPinning)}
          className={styles.buttonContainer}
        >
          Pin
        </button>
        {pinnedCommunities.length ? (
          <button
            className={styles.buttonContainer}
            onClick={() => setShowAll(!showAll)}
          >
            Show All
          </button>
        ) : null}
      </div>

      <div className='flex flex-col gap-12'>
        {pinnedCommunities.length ? (
          <div>
            <div className={styles.sectionHeading}>Pinned:</div>

            <div className={styles.communitiesContainer}>
              {pinnedCommunities.map((pinnedCommunity) => (
                <div className='relative'>
                  {isPinning && (
                    <button
                      onClick={() =>
                        unpinCommunity(
                          props.connectedWalletAddress,
                          pinnedCommunity.id,
                          findUserCommunities
                        )
                      }
                    >
                      -
                    </button>
                  )}
                  <CommunityButton
                    key={pinnedCommunity.id}
                    community={pinnedCommunity}
                    router={router}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {showAll || !pinnedCommunities.length ? (
          <div>
            <div className={styles.sectionHeading}>All:</div>
            {communities.length ? (
              <div className={styles.communitiesContainer}>
                {communities.map((community) => (
                  <div className='relative'>
                    {isPinning && (
                      <button
                        onClick={() =>
                          pinCommunity(
                            props.connectedWalletAddress,
                            community.id,
                            findUserCommunities
                          )
                        }
                      >
                        +
                      </button>
                    )}
                    <CommunityButton
                      key={community.id}
                      community={community}
                      router={router}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div>You are not eligible to join any communities!</div>
            )}
          </div>
        ) : null}
      </div>
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
      className='flex flex-col items-center mx-auto space-y-3'
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
  sectionHeading: 'text-xl font-bold',
  communitiesContainer:
    'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 gap-x-0 gap-y-12',
  buttonContainer:
    'rounded-lg px-3 py-2 bg-backgroundDark text-backgroundLight font-bold ',
};
