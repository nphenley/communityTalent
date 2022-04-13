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

type WalletGroupsProps = {
  walletGroupID: string;
};

const WalletGroups = (props: WalletGroupsProps) => {
  const [loadingWalletsInGroup, setLoadingWalletsInGroups] = useState(true);
  const [walletsInGroup, setWalletsInGroup] = useState<string[]>([]);

  const [loadingOutgoingLinkRequests, setLoadingOutgoingLinkRequests] = useState(true);
  const [outgoingLinkRequests, setOutgoingLinkRequests] = useState<LinkRequest[]>([]);

  const [loadingIncomingLinkRequests, setLoadingIncomingLinkRequests] = useState(true);
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
    <div className='px-4 py-3 border-4 rounded-lg border-backgroundDark'>
      <div className='flex justify-center mb-3 text-lg'>Wallets in group:</div>
      <div>
        {walletsInGroup.map((wallet) => (
          <div key={wallet} className='flex justify-between gap-2'>
            <div>{wallet}</div>
            <button onClick={() => unlinkWalletAddress(props.walletGroupID, wallet)}>
              <FaUnlink size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const outgoingLinkRequestsList = (
    <div>
      <div className='flex justify-center mb-2'>Outgoing link requests:</div>
      <div>
        {outgoingLinkRequests.map((linkRequest) => (
          <div key={linkRequest.walletGroupID} className={styles.requestContainer}>
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress}>{walletAddress}</div>
            ))}
            <button
              className='flex justify-end w-full pt-1'
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
    <div>
      <div className='flex justify-center mb-2'>Incoming link requests:</div>
      <div>
        {incomingLinkRequests.map((linkRequest) => (
          <div key={linkRequest.walletGroupID} className={styles.requestContainer}>
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress}>{walletAddress}</div>
            ))}
            <div className='flex justify-end w-full gap-2 pt-1'>
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
      {walletsInGroupList}
      {outgoingLinkRequestsList}
      {incomingLinkRequestsList}
      <LinkRequestForm walletGroupID={props.walletGroupID} />
    </div>
  );
};
export default WalletGroups;

const styles = {
  container: 'flex flex-col items-center gap-12',
  buttonContainer: 'p-2.5 text-white rounded-lg bg-red hover:bg-primaryLight hover:cursor-pointer',
  deleteButtonContainer: 'p-2.5 text-white rounded-lg hover:cursor-pointer',
  requestContainer: 'bg-backgroundDark p-4 rounded-md',
};
