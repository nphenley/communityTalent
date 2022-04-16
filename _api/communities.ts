import { firestore } from '_firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export const getEthCommunityIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let ethCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'ethCommunityIds'));
  docs.forEach((doc) => ethCommunityIds.push(doc.id));
  return ethCommunityIds;
};

export const getSolCommunityIdsForCommunity = async (communityId: string): Promise<string[]> => {
  let solCommunityIds: string[] = [];
  const docs = await getDocs(collection(firestore, 'communities', communityId, 'solCommunityIds'));
  docs.forEach((doc) => solCommunityIds.push(doc.id));
  return solCommunityIds;
};
