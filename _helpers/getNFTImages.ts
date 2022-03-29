import { Connection, PublicKey, TransactionResponse } from '@solana/web3.js';
import Moralis from 'moralis';
import {
  getStakingAddressesForCommunity,
  getTokenAddressesForCommunity,
  getStakingInfoForCommunity,
} from '_api/communities';
import { getAddressesInWalletGroup } from '_api/walletGroups';

export const getCommunityNFTImagesForWalletGroup = async (
  walletGroupID: string,
  communityId: string,
  setNFTImages: any
) => {
  let walletAddresses;
  let tokenAddresses;
  let stakingAddresses;
  await Promise.all([
    (walletAddresses = await getAddressesInWalletGroup(walletGroupID)),
    (tokenAddresses = await getTokenAddressesForCommunity(communityId)),
    (stakingAddresses = await getStakingAddressesForCommunity(communityId)),
  ]);
  const images = await (
    await fetch('/api/images/', {
      method: 'POST',
      body: JSON.stringify({
        walletAddresses: walletAddresses,
        tokenAddresses: tokenAddresses,
        stakingAddresses: stakingAddresses,
      }),
    })
  ).json();
  setNFTImages(images);
};

const serverUrl = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID;
Moralis.start({ serverUrl, appId });

export const solStakingWithToken = async (walletAddress: string, communityId: string) => {
  const stakingInfo = await getStakingInfoForCommunity(communityId);
  let allStakedNfts: string[] = [];
  const collectionHashList = await getTokenAddressesForCommunity(communityId);
  const apiUrl = 'https://public-api.solscan.io/account/splTransfers?account=' + walletAddress + '&offset=0&limit=1000';
  const transfers = await (await fetch(apiUrl)).json();
  await Promise.all(
    stakingInfo.map(async (currentStakingInfo) => {
      const stakedNftImages = await getSolStakedNfts(transfers, collectionHashList, currentStakingInfo);
      stakedNftImages.forEach((stakedNftImage) => {
        allStakedNfts.push(stakedNftImage);
      });
    })
  );
  console.log(allStakedNfts);
};
// might need to add programID

const getSolStakedNfts = async (transfers: any, collectionHashList: string[], stakingInfo: any) => {
  const connection = new Connection('https://ssc-dao.genesysgo.net/');
  const unstakedNfts: string[] = [];
  const stakedNfts = new Set('');
  const images: string[] = [];

  await Promise.all(
    transfers.data.map(async (transfer: any) => {
      if (collectionHashList.includes(transfer.tokenAddress)) {
        let tx;
        while (!tx) {
          tx = await connection.getTransaction(transfer.signature[0]);
        }

        await Promise.all(
          tx.transaction.message.instructions.map(async (instruction) => {
            if (instruction.data === stakingInfo.unstakeID) {
              unstakedNfts.push(transfer.tokenAddress);
            }
            if (
              !unstakedNfts.includes(transfer.tokenAddress) &&
              !stakedNfts.has(transfer.tokenAddress) &&
              instruction.data === stakingInfo.stakeID
            ) {
              const image = await getSolImagesByTokenAddress(transfer.tokenAddress).catch((e) => {
                console.log(transfer.tokenAddress, e);
              });
              stakedNfts.add(transfer.tokenAddress);
              images.push(image);
            }
          })
        );
      }
    })
  );
  return images;
};

const getSolImagesByTokenAddress = async (tokenAddress: string) => {
  const nftOptions = {
    network: 'mainnet' as 'mainnet',
    address: tokenAddress,
  };
  const nftMetadata = await Moralis.SolanaAPI.nft.getNFTMetadata(nftOptions);
  return (await (await fetch(nftMetadata.metaplex.metadataUri)).json()).image;
};
