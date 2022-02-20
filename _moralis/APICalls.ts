export const getNfts = async (
  Web3Api: any,
  options: any,
  setNftImages: any
) => {
  const nfts = await Web3Api.account.getNFTs(options);
  let temp: string[] = [];

  nfts.result?.forEach(function (nft) {
    const metadata = JSON.parse(nft.metadata);
    if (metadata) {
      if (metadata.image_url) {
        if (metadata.image_url.includes('ipfs')) {
          metadata.image_url = metadata.image_url.replace(':/', '');
          metadata.image_url = 'https://ipfs.io/' + metadata.image_url;
          console.log(metadata.image_url);
        }
      }
      if (metadata.image) {
        if (metadata.image.includes('ipfs')) {
          metadata.image = metadata.image.replace(':/', '');
          metadata.image = 'https://ipfs.io/' + metadata.image;
          console.log(metadata.image);
        }
      }
    }

    temp.push(metadata);
  });
  setNftImages(temp);
};
