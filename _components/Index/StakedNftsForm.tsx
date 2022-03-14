import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  addStakedCommunityId,
  getAllStakingCommunities,
  removeStakedCommunityId,
} from '_api/communities';
import FormField from '_styled/Forms/FormField';
import FormSubmit from '_styled/Forms/FormSubmit';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';

type StakedNftsFormProps = {
  walletAddress: string;
  userStakedCommunityIds: string[];
  setUserStakedCommunityIds: any;
};

const StakedNftsForm = (props: StakedNftsFormProps) => {
  const [stakingCommunities, setStakingCommunities] = useState<
    { communityId: string; communityName: string }[]
  >([]);
  const [selectOptions, setSelectOptions] =
    useState<{ label: string; value: string }[]>();

  useEffect(() => {
    getAllStakingCommunities(setStakingCommunities);
  }, []);

  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    if (props.userStakedCommunityIds.includes(data.communityId)) {
      removeStakedCommunityId(props.walletAddress, data.communityId);
    } else {
      addStakedCommunityId(props.walletAddress, data.communityId);
    }
  };

  useEffect(() => {
    setSelectOptions(
      stakingCommunities.map((stakingCommunity) => {
        return {
          label: stakingCommunity.communityName,
          value: stakingCommunity.communityId,
        };
      })
    );
  }, [stakingCommunities]);

  return (
    <form
      className='flex flex-col w-full max-w-screen-sm gap-4 sm:px-0'
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormField
        label='Community'
        formField={
          <SelectFieldSingle
            control={control}
            label='Community'
            options={selectOptions}
            name='communityId'
            required={true}
          />
        }
      />

      <FormSubmit text='Toggle Add/Remove' />
    </form>
  );
};
export default StakedNftsForm;
