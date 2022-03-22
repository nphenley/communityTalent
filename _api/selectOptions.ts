import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '_firebase/config';
import { SelectOption } from '_types/SelectOption';

export const getStakingCommunitiesSelectOptions = async (updateSelectOptions: (selectOptions: SelectOption[]) => void) => {
  return getDoc(doc(firestore, 'selectOptions', 'stakingCommunities')).then((docSnap) => {
    let stakingCommunityInfo: SelectOption[] = [];
    docSnap.data()!.array.forEach((stakingCommunity: { communityId: string; communityName: string }) => {
      stakingCommunityInfo.push({
        value: stakingCommunity.communityId,
        label: stakingCommunity.communityName,
      });
    });
    updateSelectOptions(stakingCommunityInfo);
  });
};
