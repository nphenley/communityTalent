import { firestore } from '_firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const getEthCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let ethCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'ethCollectionIds'));
  docs.forEach((doc) => ethCommunityIds.push(doc.id));
  return ethCommunityIds;
};

export const getSolCollectionIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let solCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'solCollectionIds'));
  docs.forEach((doc) => solCommunityIds.push(doc.id));
  return solCommunityIds;
};
