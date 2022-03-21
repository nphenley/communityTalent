import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  addStakedCommunity,
  getStakingCommunitiesSelectOptions,
  removeStakedCommunity,
  subscribeToStakedCommunities,
} from '_api/communities';
import FormField from '_styled/Forms/FormField';
import FormSubmit from '_styled/Forms/FormSubmit';
import SelectFieldSingle from '_styled/Forms/SelectFieldSingle';
import LoadingSpinner from '_styled/LoadingSpinner';
import { SelectOption } from '_types/SelectOption';
import { AiFillDelete } from 'react-icons/ai';

type StakedNftsFormProps = {
  walletGroupID: string;
};

const StakedNftsForm = (props: StakedNftsFormProps) => {
  const [loadingSelectOptions, setLoadingSelectOptions] = useState(true);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>();

  const [loadingStakedCommunities, setLoadingStakedCommunities] =
    useState(true);
  const [stakedCommunities, setStakedCommunities] = useState<string[]>([]);

  const updateSelectOptions = (selectOptions: SelectOption[]) => {
    setSelectOptions(selectOptions);
    setLoadingSelectOptions(false);
  };

  const updateStakedCommunities = (stakedCommunities: string[]) => {
    setStakedCommunities(stakedCommunities);
    setLoadingStakedCommunities(false);
  };

  useEffect(() => {
    getStakingCommunitiesSelectOptions(updateSelectOptions);
    subscribeToStakedCommunities(props.walletGroupID, updateStakedCommunities);
  }, []);

  const { control, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    addStakedCommunity(props.walletGroupID, data.communityId);
  };

  return loadingSelectOptions || loadingStakedCommunities ? (
    <LoadingSpinner />
  ) : (
    <div className='flex flex-col gap-12 items-center p-5 max-w-screen-sm w-full'>
      <div className='w-full flex flex-col gap-6'>
        <div className='text-center text-primary font-bold'>Add:</div>
        <form
          className='flex flex-col w-full gap-4'
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
          <FormSubmit text='Add' />
        </form>
      </div>

      <div className='flex flex-col gap-4 w-full'>
        <div className='text-center text-primary font-bold'>
          Staked Communities:
        </div>
        <div className='grid grid-cols-2 gap-2'>
          {stakedCommunities.map((stakedCommunity) => (
            <StakedCommunityItem
              key={stakedCommunity}
              walletGroupID={props.walletGroupID}
              stakedCommunity={stakedCommunity}
              label={
                selectOptions!.find((val) => val.value === stakedCommunity)!
                  .label
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default StakedNftsForm;

type StakedCommunityItemProps = {
  walletGroupID: string;
  label: string;
  stakedCommunity: string;
};

const StakedCommunityItem = (props: StakedCommunityItemProps) => {
  return (
    <div className='rounded-lg bg-backgroundDark px-3 py-2 flex justify-between'>
      {props.label}
      <button
        onClick={() =>
          removeStakedCommunity(props.walletGroupID, props.stakedCommunity)
        }
        className='text-grey'
      >
        <AiFillDelete size={18} />
      </button>
    </div>
  );
};
