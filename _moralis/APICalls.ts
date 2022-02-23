import { url } from 'inspector';
import { urlToHttpOptions } from 'url';

export const getNftsByContract = async (
  Web3Api: any,
  options: any,
  setNftImages: any,
  token_addresses: string[]
) => {
  let allNfts: string[] = [];
  var processed = 0;
  token_addresses.forEach(async (token_address) => {
    await metadataByContract(Web3Api, token_address, allNfts);
    processed++;
    if (processed === token_addresses.length) {
      setNftImages(allNfts);
    }
  });
};

export const getNfts = async (
  Web3Api: any,
  setNftImages: any,
  options: any
) => {
  let allNfts: string[] = [];

  const nfts = await Web3Api.account.getNFTs(options);
  console.log(nfts);
  nfts.result?.forEach((nft) => {
    if (nft.metadata) {
      const metadata = JSON.parse(nft.metadata);

      if (metadata.image_url) {
        if (metadata.image_url.includes('ipfs://')) {
          metadata.image_url = metadata.image_url.replace(':/', '');
          metadata.image_url = 'https://ipfs.io/' + metadata.image_url;
          metadata['name'] = nft.name;
        }
      }
      if (metadata.image) {
        if (metadata.image.includes('ipfs://')) {
          metadata.image = metadata.image.replace(':/', '');
          metadata.image = 'https://ipfs.io/' + metadata.image;
          metadata['name'] = nft.name;
        }
      }
      allNfts.push(metadata);
    } else {
      const nullMetadata = {
        name: nft.name,
        image:
          'https://aeroclub-issoire.fr/wp-content/uploads/2020/05/image-not-found-300x225.jpg',
      };
      allNfts.push(JSON.parse(JSON.stringify(nullMetadata)));
    }

    // let url = fixURL(nft.token_uri);
    // console.log(nft.token_uri);

    // fetch(url, {
    //   mode: 'cors',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   },
    // })
    //   .then((response) => response.json())
    //   .catch(() => console.log(url))
    //   .then((data) => {
    //     if (data) {
    //       console.log(data.image || data.image_url);
    //     }
    //   });
  });
  setNftImages(allNfts);
};

// const fixURL = (url: string) => {
//   if (url && url.startsWith('ipfs')) {
//     return 'https://ipfs.moralis.io:2053/ipfs' + url.split('ipfs://ipfs/');
//   } else {
//     return url + '?format=json';
//   }
// };

const metadataByContract = async (
  Web3Api: any,
  token_address: string,
  allNfts: string[]
) => {
  const nfts = await Web3Api.account.getNFTsForContract({
    address: '0x5487Bde943cC667D18FA5D1C7445A10CbB3a6e8D',
    token_address: token_address,
  });
  nfts.result?.forEach((nft) => {
    const metadata = JSON.parse(nft.metadata);
    if (metadata) {
      if (metadata.image_url) {
        if (metadata.image_url.includes('ipfs')) {
          metadata.image_url = metadata.image_url.replace(':/', '');
          metadata.image_url = 'https://ipfs.io/' + metadata.image_url;
        }
      }
      if (metadata.image) {
        if (metadata.image.includes('ipfs')) {
          metadata.image = metadata.image.replace(':/', '');
          metadata.image = 'https://ipfs.io/' + metadata.image;
        }
      }
    }

    allNfts.push(metadata);
  });
};
