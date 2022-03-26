import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addStakedCommunity, getStakingCommunities, removeStakedCommunity, subscribeToStakedCommunities } from '_api/communities';
import FormField from '_styled/Forms/FormField';
import FormSubmit from '_styled/Forms/FormSubmit';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';
import LoadingSpinner from '_styled/LoadingSpinner';
import { SelectOption } from '_types/SelectOption';
import { AiFillDelete } from 'react-icons/ai';
import {} from '_api/selectOptions';
import { Community } from '_types/Community';

type StakedNftsFormProps = {
  walletGroupID: string;
};

const StakedNftsForm = (props: StakedNftsFormProps) => {
  const [loadingSelectOptions, setLoadingSelectOptions] = useState(true);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>();

  const [loadingStakingCommunities, setLoadingStakingCommunities] = useState(true);
  const [stakingCommunities, setStakingCommunities] = useState<Community[]>([]);

  const [loadingStakedCommunities, setLoadingStakedCommunities] = useState(true);
  const [stakedCommunities, setStakedCommunities] = useState<Community[]>([]);

  useEffect(() => {
    getStakingCommunities((stakingCommunities: Community[]) => {
      setStakingCommunities(stakingCommunities);
      setLoadingStakingCommunities(false);
    });

    subscribeToStakedCommunities(props.walletGroupID, (stakedCommunities: Community[]) => {
      setStakedCommunities(stakedCommunities);
      setLoadingStakedCommunities(false);
    });
  }, []);

  useEffect(() => {
    const selectOptions: SelectOption[] = [];

    stakingCommunities.forEach((community) => {
      selectOptions.push({
        label: community.name,
        value: community.id,
      });
    });

    setSelectOptions(selectOptions);
    setLoadingSelectOptions(false);
  }, [stakingCommunities]);

  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    addStakedCommunity(props.walletGroupID, data.communityId);
  };

  return loadingSelectOptions || loadingStakingCommunities || loadingStakedCommunities ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col gap-12 items-center p-5 max-w-screen-sm w-full'>
      <div className='w-full flex flex-col gap-6'>
        <div className='text-center text-primary font-bold'>Add:</div>
        <form className='flex flex-col w-full gap-4' onSubmit={handleSubmit(onSubmit)}>
          <FormField
            label='Community'
            formField={<SelectFieldSingle control={control} label='Community' options={selectOptions} name='communityId' required={true} />}
          />
          <FormSubmit text='Add' />
        </form>
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <div className='text-center text-primary font-bold'>Staked Communities:</div>
        <div className='grid grid-cols-2 gap-2'>
          {stakedCommunities.map((stakedCommunity) => (
            <StakedCommunityItem key={stakedCommunity.id} walletGroupID={props.walletGroupID} stakedCommunity={stakedCommunity} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default StakedNftsForm;

type StakedCommunityItemProps = {
  walletGroupID: string;
  stakedCommunity: Community;
};

const StakedCommunityItem = (props: StakedCommunityItemProps) => {
  return (
    <div className='rounded-lg bg-backgroundDark px-3 py-2 flex justify-between'>
      {props.stakedCommunity.name}
      <button onClick={() => removeStakedCommunity(props.walletGroupID, props.stakedCommunity.id)} className='text-grey'>
        <AiFillDelete size={18} />
      </button>
    </div>
  );
};