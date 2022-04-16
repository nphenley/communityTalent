import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const app = initializeApp({
  apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
  authDomain: 'talent-d15b4.firebaseapp.com',
  projectId: 'talent-d15b4',
  storageBucket: 'talent-d15b4.appspot.com',
  messagingSenderId: '691000709770',
  appId: '1:691000709770:web:71617ce4d81358cdd35373',
});

export const firestore = getFirestore(app);

const collectionsApp = initializeApp(
  {
    apiKey: 'AIzaSyCYKhwCD01OtcfD7Tjx7YOJ8a7_ofNjPK0',
    authDomain: 'staked-api.firebaseapp.com',
    projectId: 'staked-api',
    storageBucket: 'staked-api.appspot.com',
    messagingSenderId: '629479392784',
    appId: '1:629479392784:web:b6bc00432e9d5d9dc62c95',
  },
  'collections'
);

export const collectionsFirestore = getFirestore(collectionsApp);
