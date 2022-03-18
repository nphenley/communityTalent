import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from 'firebase/firestore';
export const sendLinkRequest = async (
  walletAddress: string,
  requestedWalletAddresses: string[]
) => {
  requestedWalletAddresses.forEach(async (requestedWalletAddress) => {
    const checkIfRequestAlreadyExists = await getDocs(
      query(
        collection(firestore, 'linkWalletRequests'),
        where('sender', '==', walletAddress),
        where('receiver', '==', requestedWalletAddress)
      )
    );
    if (checkIfRequestAlreadyExists.empty) {
      addDoc(collection(firestore, 'linkWalletRequests'), {
        sender: walletAddress,
        receiver: requestedWalletAddress,
      });
    }
  });
};

export const getLinkRequestsForWallet = async (
  walletAddress: string,
  setReceivedRequests: any
) => {
  const requests = await getDocs(
    query(
      collection(firestore, 'linkWalletRequests'),
      where('receiver', '==', walletAddress)
    )
  );
  let received: string[] = [];
  requests.forEach((request) => {
    received.push(request.data().sender);
  });
  setReceivedRequests(received);
};

export const linkWallets = async (
  userAddress: string,
  walletUserIsLinkingTo: string,
  setReceivedRequests: any
) => {
  const userLinkedWalletsDoc = await getDocs(
    query(
      collection(firestore, 'linkedWallets'),
      where('wallets', 'array-contains-any', [
        userAddress,
        walletUserIsLinkingTo,
      ])
    )
  );
  if (userLinkedWalletsDoc.empty) {
    addDoc(collection(firestore, 'linkedWallets'), {
      wallets: [userAddress, walletUserIsLinkingTo],
    });
  } else {
    const userLinkedWalletsArray = userLinkedWalletsDoc.docs[0].data().wallets;
    if (!userLinkedWalletsArray.includes(userAddress))
      userLinkedWalletsArray.push(userAddress);
    else if (!userLinkedWalletsArray.includes(walletUserIsLinkingTo))
      userLinkedWalletsArray.push(walletUserIsLinkingTo);
    updateDoc(userLinkedWalletsDoc.docs[0].ref, {
      wallets: userLinkedWalletsArray,
    });
  }
  await removeLinkRequest(
    userAddress,
    walletUserIsLinkingTo,
    setReceivedRequests
  );
};

export const removeLinkRequest = async (
  userAddress: string,
  walletUserIsLinkingTo: string,
  setReceivedRequests: any
) => {
  const requests = await getDocs(
    query(
      collection(firestore, 'linkWalletRequests'),
      where('receiver', '==', userAddress),
      where('sender', '==', walletUserIsLinkingTo)
    )
  );
  await deleteDoc(requests.docs[0].ref);
  getLinkRequestsForWallet(userAddress, setReceivedRequests);
};

export const getLinkedWallets = async (
  walletAddress: string,
  setLinkedWallets: any
) => {
  const linkedWallets = await getDocs(
    query(
      collection(firestore, 'linkedWallets'),
      where('wallets', 'array-contains', walletAddress)
    )
  );
  if (linkedWallets.empty) {
    setLinkedWallets([walletAddress]);
    return;
  }
  setLinkedWallets(linkedWallets.docs[0].data().wallets);
};

export const unlinkWallets = async (
  walletAddress: string,
  walletUnlinkingFrom: string,
  setLinkedWallets: any
) => {
  const linkedWallets = await getDocs(
    query(
      collection(firestore, 'linkedWallets'),
      where('wallets', 'array-contains', walletAddress)
    )
  );
  await updateDoc(linkedWallets.docs[0].ref, {
    wallets: arrayRemove(walletUnlinkingFrom),
  });
  getLinkedWallets(walletAddress, setLinkedWallets);
};
