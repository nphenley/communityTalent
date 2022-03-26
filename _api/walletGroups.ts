import { firestore } from '_firebase/config';
import {
  addDoc,
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  arrayUnion,
  Unsubscribe,
  arrayRemove,
  Timestamp,
} from 'firebase/firestore';
import { LinkRequest } from '_types/LinkRequest';

export const subscribeToOrCreateWalletGroupID = (
  walletAddress: string,
  updateWalletGroupID: any
): Unsubscribe => {
  return onSnapshot(
    query(
      collection(firestore, 'walletGroups'),
      where('array', 'array-contains', walletAddress)
    ),
    (query) => {
      if (query.empty)
        return addDoc(collection(firestore, 'walletGroups'), {
          array: [walletAddress],
        });
      updateWalletGroupID(query.docs[0].id);
    }
  );
};

export const getOrCreateWalletGroupID = async (
  walletAddress: string
): Promise<string> => {
  const docs = await getDocs(
    query(
      collection(firestore, 'walletGroups'),
      where('array', 'array-contains', walletAddress)
    )
  );
  let walletGroupID: string;
  if (docs.empty) {
    const docRef = await addDoc(collection(firestore, 'walletGroups'), {
      array: [walletAddress],
    });
    walletGroupID = docRef.id;
  } else {
    walletGroupID = docs.docs[0].id;
  }
  return walletGroupID;
};

export const getAddressesInWalletGroup = async (
  walletGroupID: string
): Promise<string[]> => {
  return getDoc(doc(firestore, 'walletGroups', walletGroupID)).then(
    (docSnap) => {
      return docSnap.exists() ? docSnap.data()!.array : [];
    }
  );
};

export const subscribeToAddressesInWalletGroup = (
  walletGroupID: string,
  updateWalletsInGroup: (walletsInGroup: string[]) => void
) => {
  return onSnapshot(doc(firestore, 'walletGroups', walletGroupID), (snap) => {
    updateWalletsInGroup(snap.exists() ? snap.data()!.array : []);
  });
};

// =========================== Link Requests ===========================

export const subscribeToOutgoingLinkRequests = (
  walletGroupID: string,
  updateOutgoingLinkRequests: (outgoingLinkRequests: LinkRequest[]) => void
) => {
  return onSnapshot(
    query(
      collection(firestore, 'linkRequests'),
      where('requestingWalletGroupID', '==', walletGroupID)
    ),
    async (snap) => {
      let outgoingLinkRequests: LinkRequest[] = [];
      await Promise.all(
        snap.docs.map(async (doc) => {
          const requestedWalletGroupID = doc.data()!.requestedWalletGroupID;
          outgoingLinkRequests.push({
            walletGroupID: requestedWalletGroupID,
            walletAddressesInGroup: await getAddressesInWalletGroup(
              requestedWalletGroupID
            ),
          });
        })
      );
      updateOutgoingLinkRequests(outgoingLinkRequests);
    }
  );
};

export const subscribeToIncomingLinkRequests = (
  walletGroupID: string,
  updateIncomingLinkRequests: (incomingLinkRequests: LinkRequest[]) => void
) => {
  return onSnapshot(
    query(
      collection(firestore, 'linkRequests'),
      where('requestedWalletGroupID', '==', walletGroupID)
    ),
    async (snap) => {
      let incomingLinkRequests: LinkRequest[] = [];
      await Promise.all(
        snap.docs.map(async (doc) => {
          const requestingWalletGroupID = doc.data()!.requestingWalletGroupID;
          incomingLinkRequests.push({
            walletGroupID: requestingWalletGroupID,
            walletAddressesInGroup: await getAddressesInWalletGroup(
              requestingWalletGroupID
            ),
          });
        })
      );
      updateIncomingLinkRequests(incomingLinkRequests);
    }
  );
};

export const createLinkRequest = async (
  requestingWalletGroupID: string,
  requestedWalletAddress: string
): Promise<any> => {
  const requestedWalletGroupID = await getOrCreateWalletGroupID(
    requestedWalletAddress
  );

  return addDoc(collection(firestore, 'linkRequests'), {
    requestingWalletGroupID: requestingWalletGroupID,
    requestedWalletGroupID: requestedWalletGroupID,
    dateCreated: Timestamp.now(),
  });
};

export const deleteLinkRequest = async (
  requestingWalletGroupID: string,
  requestedWalletGroupID: string
) => {
  return getDocs(
    query(
      collection(firestore, 'linkRequests'),
      where('requestingWalletGroupID', '==', requestingWalletGroupID),
      where('requestedWalletGroupID', '==', requestedWalletGroupID)
    )
  ).then((snap) => {
    snap.forEach((doc) => deleteDoc(doc.ref));
  });
};

export const acceptLinkRequest = async (
  requestingWalletGroupID: string,
  requestedWalletGroupID: string
) => {
  const requestingWalletAddresses = await getAddressesInWalletGroup(
    requestingWalletGroupID
  );
  await deleteLinkRequest(requestingWalletGroupID, requestedWalletGroupID);
  await updateDoc(doc(firestore, 'walletGroups', requestedWalletGroupID), {
    array: arrayUnion(...requestingWalletAddresses),
  });
  return deleteDoc(doc(firestore, 'walletGroups', requestingWalletGroupID));
};

export const unlinkWalletAddress = async (
  walletGroupID: string,
  walletAddressToRemove: string
) => {
  return updateDoc(doc(firestore, 'walletGroups', walletGroupID), {
    array: arrayRemove(walletAddressToRemove),
  });
};
