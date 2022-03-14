export const checkIfUserStillHasStakedNft = async (
  walletAddress: string,
  tokenAddress: string,
  stakingAddress: string
) => {
  const userTransfersOfNft = await getUserTransfersOfNft(
    walletAddress,
    tokenAddress
  );
  let unstakedNftIds: string[] = [];
  let hasRequiredNft = false;
  userTransfersOfNft.forEach((transfer: any) => {
    if (transfer.from === stakingAddress && transfer.to === walletAddress) {
      unstakedNftIds.push(transfer.tokenID);
    }
    if (
      transfer.to === stakingAddress &&
      transfer.from === walletAddress &&
      !unstakedNftIds.includes(transfer.tokenID)
    ) {
      hasRequiredNft = true;
    }
  });
  return hasRequiredNft;
};

const getUserTransfersOfNft = async (
  walletAddress: string,
  tokenAddress: string
) => {
  const apiUrl =
    'https://api.etherscan.io/api?module=account&action=tokennfttx&contractaddress=' +
    tokenAddress +
    '&address=' +
    walletAddress +
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
