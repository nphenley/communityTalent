import { openseaPushUserImages } from './getUserNfts';

export const checkIfUserStillHasStakedNft = async (
  walletGroupID: string,
  tokenAddress: string,
  stakingAddress: string
) => {
  const userTransfersOfNft = await getUserTransfersOfNft(
    walletGroupID,
    tokenAddress
  );
  let unstakedNftIds: string[] = [];
  let hasRequiredNft = false;
  userTransfersOfNft.forEach((transfer: any) => {
    if (transfer.from === stakingAddress && transfer.to === walletGroupID) {
      unstakedNftIds.push(transfer.tokenID);
    }
    if (
      transfer.to === stakingAddress &&
      transfer.from === walletGroupID &&
      !unstakedNftIds.includes(transfer.tokenID)
    ) {
      hasRequiredNft = true;
    }
  });
  return hasRequiredNft;
};

export const getStakedNftImages = async (
  walletGroupID: string,
  tokenAddress: string,
  stakingAddress: string,
  images: string[]
) => {
  const userTransfersOfNft = await getUserTransfersOfNft(
    walletGroupID,
    tokenAddress
  );
  let unstakedNftIds: string[] = [];
  let stakedNftIds: string[] = [];
  userTransfersOfNft.forEach((transfer: any) => {
    if (transfer.from === stakingAddress && transfer.to === walletGroupID) {
      unstakedNftIds.push(transfer.tokenID);
    }
    if (
      transfer.to === stakingAddress &&
      transfer.from === walletGroupID &&
      !unstakedNftIds.includes(transfer.tokenID)
    ) {
      stakedNftIds.push(transfer.tokenID);
    }
  });
  let stakedNftsString = '';
  if (!stakedNftIds) return;

  stakedNftIds.forEach((id) => {
    stakedNftsString += 'token_ids=' + id + '&';
  });

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  var apiUrl =
    'https://api.opensea.io/api/v1/assets?' +
    stakedNftsString +
    'owner=' +
    stakingAddress +
    '&owner=' +
    stakingAddress +
    '&order_by=pk&order_direction=desc&asset_contract_address=' +
    tokenAddress +
    '&limit=50';
  const response = await fetch(apiUrl, options);
  const nftsInWallet = await response.json();
  nftsInWallet.assets.forEach((nft: any) => {
    images.push(nft.image_url);
  });
  if (nftsInWallet.next) {
    apiUrl += '&cursor=' + nftsInWallet.next;

    await openseaPushUserImages(apiUrl, images);
  }
};

const getUserTransfersOfNft = async (
  walletGroupID: string,
  tokenAddress: string
) => {
  const apiUrl =
    'https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=' +
    tokenAddress +
    '&address=' +
    walletGroupID +
    '&page=1&offset=10000&sort=desc&apikey=UU7BPMNMSJAP95U8JT7NN6HVD2ZTH7ZVHE';
  const response = await fetch(apiUrl);
  const transfers = await response.json();
  return transfers.result;
};

export const getImageForStakingCommunity = async (tokenAddress: string) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  var apiUrl = 'https://api.opensea.io/api/v1/asset_contract/' + tokenAddress;

  const response = await fetch(apiUrl, options);
  const contractInfo = await response.json();
  return contractInfo.image_url;
};
