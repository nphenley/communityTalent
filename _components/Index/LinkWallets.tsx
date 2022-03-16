import { useFieldArray, useForm } from 'react-hook-form';
import FormField from '_styled/Forms/FormField';
import InputField from '_styled/Forms/InputField';
import ArrayInputField from '_styled/Forms/ArrayInputField';
import FormSubmit from '_styled/Forms/FormSubmit';
import {
  getLinkedWallets,
  getLinkRequestsForWallet,
  linkWallets,
  removeLinkRequests,
  sendLinkRequest,
  unlinkWallets,
} from '_api/linkWallets';
import { PublicKey } from '@solana/web3.js';
import Web3 from 'web3';
import { useEffect, useState } from 'react';
import { FaCheck, FaSkullCrossbones, FaUnlink } from 'react-icons/fa';
type LinkWalletProps = {
  walletAddress: string;
};

const LinkWallets = (props: LinkWalletProps) => {
  const [receivedRequests, setReceivedRequests] = useState<string[]>([]);
  const [linkedWallets, setLinkedWallets] = useState<string[]>([]);
  const { register, handleSubmit, control } = useForm();

  useEffect(() => {
    getLinkedWallets(props.walletAddress, setLinkedWallets);
    getLinkRequestsForWallet(props.walletAddress, setReceivedRequests);
  }, []);

  const title = (
    <h1 className='my-3 text-3xl font-bold text-center text-primary'>
      Link Wallets
    </h1>
  );
  const validateAddresses = (addresses: string[]) => {
    let validAddresses: boolean = true;
    addresses.forEach((address: string) => {
      const isEthValid = Web3.utils.isAddress(address);
      if (isEthValid) {
        const index = addresses.indexOf(address);
        addresses[index] = addresses[index].toLowerCase();
        return;
      }
      let isSolValid;
      try {
        let pubkey = new PublicKey(address);
        PublicKey.isOnCurve(pubkey.toBuffer());
        isSolValid = true;
      } catch (error) {
        isSolValid = false;
      }
      if (!isSolValid) validAddresses = false;
    });
    if (validAddresses === true) {
      return addresses;
    } else return [];
  };
  const onSubmit = async (data: any) => {
    if (!data.wallets.length) return;
    const validatedAddresses = validateAddresses(data.wallets);
    sendLinkRequest(props.walletAddress, validatedAddresses);
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
      {linkedWallets.length ? (
        <div className=''>
          <p>This address is currently linked to these wallets:</p>
          <div className='grid grid-flow-row gap-1.5'>
            {linkedWallets.map((wallet: string) => (
              <div>
                {!(wallet === props.walletAddress) ? (
                  <div className='flex'>
                    <p className='p-1 rounded-lg bg-backgroundDark'>{wallet}</p>
                    <button
                      onClick={() => {
                        unlinkWallets(
                          props.walletAddress,
                          wallet,
                          setLinkedWallets
                        );
                      }}
                      className='ml-4'
                    >
                      <FaUnlink size={14} />
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
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
                      className={styles.buttonContainer}
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
                      className={styles.buttonContainer}
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

const styles = {
  buttonContainer:
    'p-2.5 text-white rounded-lg bg-primary hover:bg-primaryLight hover:cursor-pointer',
};
