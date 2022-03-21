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

type WalletGroupsProps = {
  walletGroupID: string;
};

const WalletGroups = (props: WalletGroupsProps) => {
  const [loadingWalletsInGroup, setLoadingWalletsInGroups] = useState(true);
  const [walletsInGroup, setWalletsInGroup] = useState<string[]>([]);

  const [loadingOutgoingLinkRequests, setLoadingOutgoingLinkRequests] =
    useState(true);
  const [outgoingLinkRequests, setOutgoingLinkRequests] = useState<
    LinkRequest[]
  >([]);

  const [loadingIncomingLinkRequests, setLoadingIncomingLinkRequests] =
    useState(true);
  const [incomingLinkRequests, setIncomingLinkRequests] = useState<
    LinkRequest[]
  >([]);

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
    <div>
      <div>wallets in group:</div>
      <div>
        {walletsInGroup.map((wallet) => (
          <div key={wallet} className='flex gap-2'>
            <div>{wallet}</div>
            <button
              onClick={() => unlinkWalletAddress(props.walletGroupID, wallet)}
            >
              unlink
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const outgoingLinkRequestsList = (
    <div>
      <div>outgoing link requests:</div>
      <div>
        {outgoingLinkRequests.map((linkRequest) => (
          <div
            key={linkRequest.walletGroupID}
            className={styles.requestContainer}
          >
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress}>{walletAddress}</div>
            ))}
            <button
              onClick={() =>
                deleteLinkRequest(
                  props.walletGroupID,
                  linkRequest.walletGroupID
                )
              }
            >
              del
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const incomingLinkRequestsList = (
    <div>
      <div>incoming link requests:</div>
      <div>
        {incomingLinkRequests.map((linkRequest) => (
          <div
            key={linkRequest.walletGroupID}
            className={styles.requestContainer}
          >
            {linkRequest.walletAddressesInGroup.map((walletAddress) => (
              <div key={walletAddress}>{walletAddress}</div>
            ))}
            <button
              onClick={() =>
                acceptLinkRequest(
                  linkRequest.walletGroupID,
                  props.walletGroupID
                )
              }
            >
              accept
            </button>
            <button
              onClick={() =>
                deleteLinkRequest(
                  linkRequest.walletGroupID,
                  props.walletGroupID
                )
              }
            >
              del
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  return loadingWalletsInGroup ||
    loadingOutgoingLinkRequests ||
    loadingIncomingLinkRequests ? (
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
  buttonContainer:
    'p-2.5 text-white rounded-lg bg-red hover:bg-primaryLight hover:cursor-pointer',
  deleteButtonContainer:
    'p-2.5 text-white rounded-lg bg-red hover:bg-redLight hover:cursor-pointer',
  requestContainer: 'bg-backgroundDark p-4 rounded-lg',
};
