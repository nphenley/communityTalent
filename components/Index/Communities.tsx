import { useRouter } from 'next/router';
import { communityId } from 'constants/hardcoded';
import { useEffect, useState } from 'react';
import { useMoralisWeb3Api, useNFTBalances } from 'react-moralis';
import { getNfts } from '_moralis/APICalls';
import LoadingSpinner from 'styled/LoadingSpinner';
import Image from 'next/image';

const Communities = () => {
  const router = useRouter();
  const Web3Api = useMoralisWeb3Api();
  const [nftImages, setNftImages] = useState<string[]>([]);
  const [loadingNfts, setLoadingNfts] = useState(true);

  useEffect(() => {
    console.log(nftImages);
    if (!nftImages.length) return;
    setLoadingNfts(false);
  }, [nftImages]);

  const options = {
    chain: 'eth',
    address: '0x5487Bde943cC667D18FA5D1C7445A10CbB3a6e8D',
    limit: 5,
  };

  // useEffect(() => {
  //   getNfts()
  // }, []);

  return (
    <div className='flex flex-wrap gap-12 p-12'>
      <button
        className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>
      <button
        className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>
      <button
        className='text-white rounded-full bg-primary h-44 w-44 hover:bg-primaryLight'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>

      <button onClick={() => getNfts(Web3Api, options, setNftImages)}>
        click
      </button>

      <div>
        {loadingNfts ? (
          <LoadingSpinner />
        ) : (
          <div className='grid grid-flow-col'>
            {nftImages.map((nft) => (
              <div>
                {nft && nft.image && <img src={nft.image}></img>}
                {nft && nft.image_url && <img src={nft.image_url}></img>}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='flex flex-row'></div>
    </div>
  );
};

export default Communities;
