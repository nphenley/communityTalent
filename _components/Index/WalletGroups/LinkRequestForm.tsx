import { useForm } from 'react-hook-form';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import { createLinkRequest, getOrCreateWalletGroupID } from '_api/walletGroups';
import { isWalletAddressValid } from '_helpers/isWalletAddressValid';

type LinkRequestFormProps = {
  walletGroupID: string;
};

const LinkRequestForm = (props: LinkRequestFormProps) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<{ walletAddress: string }>();

  const onSubmit = async (data: { walletAddress: string }) => {
    if (props.walletGroupID === (await getOrCreateWalletGroupID(data.walletAddress))) {
      setError('walletAddress', {
        type: 'walletAlreadyInGroup',
        message: 'This wallet already belongs to this Wallet Group.',
      });
    } else if (!isWalletAddressValid(data.walletAddress)) {
      setError('walletAddress', {
        type: 'walletInvalid',
        message: 'Please submit a valid Wallet Address.',
      });
    } else {
      if (isWalletAddressValid(data.walletAddress) === 'eth') {
        const lowerCasedEthAddress = data.walletAddress.toLowerCase();
        createLinkRequest(props.walletGroupID, lowerCasedEthAddress);
      } else {
        createLinkRequest(props.walletGroupID, data.walletAddress);
      }
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.heading}>Send Link Request</div>

      <div className='flex gap-2 w-full items-center justify-between'>
        <div className='grow'>
          <FormField
            label='Wallet Address'
            formField={
              <InputField
                register={register}
                placeholder='Wallet Address'
                name='walletAddress'
                maxLength={100}
                required={true}
              />
            }
          />
        </div>

        <FormSubmit text='Submit' />
      </div>

      {errors.walletAddress && <div className={styles.errorText}>{errors.walletAddress.message}</div>}
    </form>
  );
};

export default LinkRequestForm;

const styles = {
  container: 'flex flex-col w-full max-w-screen-sm gap-10',
  heading: 'text-3xl font-bold text-center text-primary',
  errorText: 'text-red text-center',
};
