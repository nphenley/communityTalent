export const openseaApiCall = async (
  walletAddress: string,
  tokenAddress: string
) => {
  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'X-API-KEY': '7d5d2f9f7391463dadb8c3fca6b2662d',
    },
  };
  var apiUrl =
    'https://api.opensea.io/api/v1/assets?owner=' +
    walletAddress +
    '&owner=' +
    walletAddress +
    '&order_by=pk&order_direction=desc&asset_contract_address=' +
    tokenAddress +
    '&limit=1';

  const response = await fetch(apiUrl, options);
  const nftInWallet = await response.json();
  return nftInWallet.assets[0].image_url;
};
