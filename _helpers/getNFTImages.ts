import { doc, getDoc } from 'firebase/firestore';
import { getEthCollectionIdsForCommunity, getSolCollectionIdsForCommunity } from '_api/communities';
import { getAddressesInWalletGroup } from '_api/walletGroups';
import { collectionsFirestore } from '_firebase/config';

export const getCommunityNFTImagesForWalletGroup = async (
  walletGroupID: string,
  communityId: string,
  setNFTImages: any
) => {
  let walletAddresses;
  let ethCollectionIds;
  let solCollectionIds;
  await Promise.all([
    (walletAddresses = await getAddressesInWalletGroup(walletGroupID)),
    (ethCollectionIds = await getEthCollectionIdsForCommunity(communityId)),
    (solCollectionIds = await getSolCollectionIdsForCommunity(communityId)),
  ]);

  const nfts:
    | { tokenId: string; owner: string; staked: boolean; image: string }[]
    | { tokenAddress: string; owner: string; staked: boolean; image: string }[] = [];

  const fuckJavaScript: { walletAddress: string; collectionId: string; collectionType: 'sol' | 'eth' }[] = [];

  for (const walletAddress of walletAddresses) {
    for (const collectionId of ethCollectionIds)
      fuckJavaScript.push({ walletAddress: walletAddress, collectionId: collectionId, collectionType: 'eth' });
    for (const collectionId of solCollectionIds)
      fuckJavaScript.push({ walletAddress: walletAddress, collectionId: collectionId, collectionType: 'sol' });
  }

  await Promise.all(
    fuckJavaScript.map(async (trashLanguage) => {
      const collectionPathName = trashLanguage.collectionType === 'eth' ? 'ethCollections' : 'collections';
      const imagesPathName = trashLanguage.collectionType === 'eth' ? 'ethImages' : 'solImages';
      const collectionRef = await getDoc(
        doc(collectionsFirestore, `${collectionPathName}/${trashLanguage.collectionId}`)
      );
      if (!collectionRef.exists()) return;
      const zeroIndexed = collectionRef.data()!.zeroIndexed;
      const tokens = collectionRef.data()!.tokens;
      const imagesRef = await getDoc(doc(collectionsFirestore, `${imagesPathName}/${trashLanguage.collectionId}`));
      const images = imagesRef.exists() && imagesRef.data() ? imagesRef.data()!.images : [];
      for (let i = zeroIndexed ? 0 : 1; i < tokens.length; i++)
        if (tokens[i].owner === trashLanguage.walletAddress)
          nfts.push({ ...tokens[i], image: images[i] ? images[i] : 'N/A' });
    })
  );

  setNFTImages(nfts.map((token) => token.image));
};
