import { getParsedNftAccountsByOwner } from '@nfteyez/sol-rayz';
import { Connection } from '@solana/web3.js';

import { mainNetUrl } from '_constants/solanaConstants';
import { Community } from '_types/Community';

export const getUserNftsSolana = async (connectedWalletAddress: string) => {
  let mint: { tokenAddress: string; image: string }[] = [];
  const nfts = await getParsedNftAccountsByOwner({
    publicAddress: connectedWalletAddress,
    connection: new Connection(mainNetUrl),
  });
  await Promise.all(
    nfts.map(async (nft) => {
      const metadata = await fetch(nft.data.uri);
      const data = await metadata.json();
      mint.push({ tokenAddress: nft.mint, image: data.image });
    })
  );
  return mint;
};

export const getUserNftsEth = async (
  getNFTBalances: any,
  userAddress: string,
  setData: any
) => {
  const nfts = await getNFTBalances({
    params: {
      chain: 'eth',
      address: userAddress,
    },
  });

  let tokenAddresses: string[] = [];
  let nftInfo: { name: string; image: string; tokenAddress: string }[] = [];
  let filteredNftInfo: {
    community: Community;
    image: string;
  }[] = [];
  await Promise.all(
    nfts.result.map(async (nft: any) => {
      if (nft.metadata) {
        const jsonMetadata = JSON.parse(nft.metadata);
        if (jsonMetadata.image.startsWith('ipfs')) {
          jsonMetadata.image =
            'https://ipfs.io/ipfs/' + jsonMetadata.image.replace('ipfs://', '');
        }
        nftInfo.push({
          name: jsonMetadata.collection ? jsonMetadata.collection : nft.name,
          image: jsonMetadata.image,
          tokenAddress: nft.token_address,
        });
      } // else {
      // const metadata = await fetch(nft.token_uri).catch((e) =>
      //   console.log('failed to fetch')
      // );
      // if (!metadata) return;

      // const jsonMetadata = await metadata.json();

      // if (jsonMetadata.image.startsWith('ipfs')) {
      //   jsonMetadata.image =
      //     'https://ipfs.io/ipfs/' + jsonMetadata.image.replace('ipfs://', '');
      // }
      // nftInfo.push({
      //   name: nft.name,
      //   image: jsonMetadata.image,
      //   tokenAddress: nft.token_address,
      // });
      // //}
    })
  );

  nftInfo.forEach((nft) => {
    if (!tokenAddresses.includes(nft.tokenAddress)) {
      filteredNftInfo.push({
        community: { id: nft.tokenAddress, name: nft.name },
        image: nft.image,
      });
      tokenAddresses.push(nft.tokenAddress);
    }
  });
  setData(filteredNftInfo);
};

export const checkEthMatchForCommunity = async (
  getNFTBalances: any,
  userAddress: string,
  communityId: string,
  updateHasRequiredNft: (hasRequiredNft: boolean) => void
) => {
  const nfts = await getNFTBalances({
    params: {
      chain: 'eth',
      address: userAddress,
      token_addresses: communityId,
    },
  });
  if (nfts.total) {
    updateHasRequiredNft(true);
  } else {
    updateHasRequiredNft(false);
  }
};
