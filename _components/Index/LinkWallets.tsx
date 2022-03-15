import { useFieldArray, useForm } from 'react-hook-form';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import ArrayInputField from '_styled/Forms/ArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import {
  getLinkRequestsForWallet,
  linkWallets,
  removeLinkRequests,
  sendLinkRequest,
} from '_api/profiles';
import { PublicKey } from '@solana/web3.js';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { FaCheck, FaSkullCrossbones } from 'react-icons/fa';
type LinkWalletProps = {
  walletAddress: string;
};

const LinkWallets = (props: LinkWalletProps) => {
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  const { register, handleSubmit, control } = useForm();

  useEffect(() => {
    getLinkRequestsForWallet(props.walletAddress, setReceivedRequests);
  }, []);

  const title = (
    <h1 className='mb-4 text-3xl font-bold text-center text-primary'>
      Link Wallets
    </h1>
  );
  const areValidAddresses = (addresses: string[]) => {
    let validAddresses: boolean = true;
    addresses.forEach((address: string) => {
      const isEthValid = Web3.utils.isAddress(address);
      let isSolValid;
      try {
        let pubkey = new PublicKey(address);
        PublicKey.isOnCurve(pubkey.toBuffer());
        isSolValid = true;
      } catch (error) {
        isSolValid = false;
      }
      if (!isEthValid && !isSolValid) validAddresses = false;
    });
    return validAddresses;
  };
  const onSubmit = async (data: any) => {
    if (!data.wallets.length) return;
    if (areValidAddresses(data.wallets))
      sendLinkRequest(props.walletAddress, data.wallets);
  };
  const {
    fields: walletsFields,
    append: walletsAppend,
    remove: walletsRemove,
  } = useFieldArray({
    control: control,
    name: 'wallets',
  });

  const description = (
    <p className='mb-4 text-center'>
      Enter wallets to send link requests to. You will then need to accept the
      requests on these wallets.
    </p>
  );
  return (
    <div className='flex flex-col items-center pt-12 pb-16 overflow-y-scroll grow bg-background'>
      {receivedRequests.length ? (
        <div className=''>
          <p className='text-center'>
            You have received link requests from the following addresses, please
            accept or deny them.
          </p>

          <div className='grid grid-flow-row gap-2 p-3 m-4 mx-10 '>
            {receivedRequests.map((request) => (
              <div className='rounded-lg bg-backgroundDarker'>
                <div className='grid p-2'>
                  <div className='w-1/2 p-1'>{request}</div>
                  <div className='flex justify-end gap-1.5 mr-2'>
                    <button
                      onClick={() =>
                        linkWallets(
                          props.walletAddress,
                          request,
                          setReceivedRequests
                        )
                      }
                      className='p-2.5 text-white rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer'
                    >
                      <FaCheck size={14} />
                    </button>
                    <button
                      onClick={() =>
                        removeLinkRequests(
                          props.walletAddress,
                          request,
                          setReceivedRequests
                        )
                      }
                      className='p-2.5 text-white rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer'
                    >
                      <FaSkullCrossbones size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form
          className='flex flex-col w-full max-w-screen-sm gap-8 px-10 sm:px-0'
          onSubmit={handleSubmit(onSubmit)}
        >
          {title}
          {description}
          <ArrayInputField
            label='Wallets'
            fieldName='Wallet'
            fields={walletsFields}
            append={walletsAppend}
            remove={walletsRemove}
            fieldComponents={walletsFields.map((field, index) => (
              <FormField
                key={field.id}
                label={index === 0 ? 'Wallets' : ''}
                formField={
                  <InputField
                    register={register}
                    placeholder={'Wallet'}
                    name={`wallets.${index}`}
                    maxLength={50}
                    required={true}
                  />
                }
              />
            ))}
          />
          <FormSubmit text='Request' />
        </form>
      )}
    </div>
  );
};
export default LinkWallets;
