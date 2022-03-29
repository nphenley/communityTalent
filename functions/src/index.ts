import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const firebaseConfig = {
  apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
  authDomain: 'talent-d15b4.firebaseapp.com',
  projectId: 'talent-d15b4',
  storageBucket: 'talent-d15b4.appspot.com',
  messagingSenderId: '691000709770',
  appId: '1:691000709770:web:71617ce4d81358cdd35373',
};

admin.initializeApp(firebaseConfig);

export const handleWalletGroupDeletion = functions.firestore.document('walletGroups/{docID}').onDelete(async (snapshot) => {
  const requests: Promise<any>[] = [
    admin
      .firestore()
      .collection('linkRequests')
      .where('requestedWalletGroupID', '==', snapshot.id)
      .get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => doc.ref.delete())),
    admin
      .firestore()
      .collection('linkRequests')
      .where('requestingWalletGroupID', '==', snapshot.id)
      .get()
      .then((querySnapshot) => querySnapshot.forEach((doc) => doc.ref.delete())),
    admin.firestore().collection('stakedCommunities').doc(snapshot.id).delete(),
    admin.firestore().collection('pinnedCommunities').doc(snapshot.id).delete(),
  ];
  return Promise.all(requests);
});
