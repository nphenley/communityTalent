import { useEffect, useState } from 'react';
import LoadingSpinner from '_styled/LoadingSpinner';
import LinkRequestForm from '_components/Index/WalletGroups/LinkRequestForm';
import {
  acceptLinkRequest,
  deleteLinkRequest,
  subscribeToAddressesInWalletGroup,
  subscribeToIncomingLinkRequests,
  subscribeToOutgoingLinkRequests,
  unlinkWalletAddress,
} from '_api/walletGroups';
import { LinkRequest } from '_types/LinkRequest';
import { FaBan, FaCheck, FaUnlink } from 'react-icons/fa';
import { GiPlainCircle } from 'react-icons/gi';

type WalletGroupsProps = {
  walletGroupID: string;
};

const WalletGroups = (props: WalletGroupsProps) => {
  const [loadingWalletsInGroup, setLoadingWalletsInGroups] = useState(true);
  const [walletsInGroup, setWalletsInGroup] = useState<string[]>([]);

  const [loadingOutgoingLinkRequests, setLoadingOutgoingLinkRequests] = useState(false);
  const [outgoingLinkRequests, setOutgoingLinkRequests] = useState<LinkRequest[]>([]);

  const [loadingIncomingLinkRequests, setLoadingIncomingLinkRequests] = useState(false);
  const [incomingLinkRequests, setIncomingLinkRequests] = useState<LinkRequest[]>([]);

  useEffect(() => {
    const unsubToAddressesInWalletGroup = subscribeToAddressesInWalletGroup(
      props.walletGroupID,
      (walletsInGroup: string[]) => {
        setWalletsInGroup(walletsInGroup);
        setLoadingWalletsInGroups(false);
      }
    );
    const unsubToOutgoingLinkRequests = subscribeToOutgoingLinkRequests(
      props.walletGroupID,
      (outgoingLinkRequests: LinkRequest[]) => {
        setOutgoingLinkRequests(outgoingLinkRequests);
        setLoadingOutgoingLinkRequests(false);
      }
    );
    const unsubToIncomingLinkRequests = subscribeToIncomingLinkRequests(
      props.walletGroupID,
      (incomingLinkRequests: LinkRequest[]) => {
        setIncomingLinkRequests(incomingLinkRequests);
        setLoadingIncomingLinkRequests(false);
      }
    );

    return () => {
      unsubToAddressesInWalletGroup();
      unsubToOutgoingLinkRequests();
      unsubToIncomingLinkRequests();
    };
  }, [props.walletGroupID]);

  const walletsInGroupList = (
    <div className='p-12 rounded-lg bg-backgroundDark'>
      <div className='flex justify-center mb-6 font-bold text-primary'>Your Linked Wallets:</div>
      <div className='flex flex-col gap-2'>
        {walletsInGroup
          .sort((a, b) => (a[0] > b[0] ? 1 : -1))
          .map((wallet) => (
            <div key={wallet} className='rounded-lg flex items-center gap-2'>
              <div className='mt-0.5 text-primary'>
                <GiPlainCircle size={6} />
              </div>
              <div className='text-grey'>{wallet}</div>
              <button
                className='ml-6 flex grow flex-row-reverse text-primary'
                onClick={() => unlinkWalletAddress(props.walletGroupID, wallet)}
              >
                <FaUnlink size={14} />
              </button>
            </div>
          ))}
      </div>
    </div>
  );

  const outgoingLinkRequestsList = (
    <div className='bg-backgroundDark p-8 rounded-lg'>
      <div className='flex justify-center mb-5 text-primary font-bold'>Outgoing link requests:</div>
      <div>
        {outgoingLinkRequests.map((linkRequest) => (
          <div key={linkRequest.walletGroupID} className={styles.requestContainer}>
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress} className='flex gap-2 items-center text-grey'>
                <div className='mt-0.5 text-primary'>
                  <GiPlainCircle size={6} />
                </div>
                {walletAddress}
              </div>
            ))}
            <button
              className='flex justify-end w-full mt-2 text-primary'
              onClick={() => deleteLinkRequest(props.walletGroupID, linkRequest.walletGroupID)}
            >
              <FaBan size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const incomingLinkRequestsList = (
    <div className='bg-backgroundDark p-6 rounded-lg'>
      <div className='flex justify-center mb-5 text-primary font-bold'>Incoming link requests:</div>
      <div>
        {incomingLinkRequests.map((linkRequest) => (
          <div key={linkRequest.walletGroupID} className={styles.requestContainer}>
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress} className='flex gap-2 items-center text-grey'>
                <div className='mt-0.5 text-primary'>
                  <GiPlainCircle size={6} />
                </div>
                {walletAddress}
              </div>
            ))}
            <div className='flex justify-end w-full gap-2 mt-2 text-primary'>
              <button onClick={() => acceptLinkRequest(linkRequest.walletGroupID, props.walletGroupID)}>
                <FaCheck size={14} />
              </button>
              <button onClick={() => deleteLinkRequest(linkRequest.walletGroupID, props.walletGroupID)}>
                <FaBan size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return loadingWalletsInGroup || loadingOutgoingLinkRequests || loadingIncomingLinkRequests ? (
    <LoadingSpinner />
  ) : (
    <div className={styles.container}>
      <div className='flex flex-col sm:flex-row gap-4'>
        {outgoingLinkRequests.length !== 0 && outgoingLinkRequestsList}
        {incomingLinkRequests.length !== 0 && incomingLinkRequestsList}
      </div>
      <LinkRequestForm walletGroupID={props.walletGroupID} />
      {walletsInGroupList}
    </div>
  );
};
export default WalletGroups;

const styles = {
  container: 'py-12 flex flex-col items-center gap-20 px-4',
  buttonContainer: 'p-2.5 text-white rounded-lg bg-red hover:bg-primaryLight hover:cursor-pointer',
  deleteButtonContainer: 'p-2.5 text-white rounded-lg hover:cursor-pointer',
  requestContainer: 'bg-backgroundDark py-6 px-4 flex flex-col border-t-4 border-primaryDark',
};
