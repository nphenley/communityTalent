import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
	apiKey: 'AIzaSyCmBMQy2AE153coEJqSeLO91fS6n0EZWS0',
	authDomain: 'talent-d15b4.firebaseapp.com',
	projectId: 'talent-d15b4',
	storageBucket: 'talent-d15b4.appspot.com',
	messagingSenderId: '691000709770',
	appId: '1:691000709770:web:71617ce4d81358cdd35373',
};

initializeApp(firebaseConfig);

export const db = getFirestore();
