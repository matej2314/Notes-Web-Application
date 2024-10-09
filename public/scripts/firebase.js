import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'apikey',
	authDomain: 'authDomain',
	projectId: 'projectId',
	storageBucket: 'storage-bucket',
	messagingSenderId: 'senderId',
	appId: 'appId',
};

firebase.initializeApp(firebaseConfig);

const loginWithEmailPassword = async (email, pasword) => {
	try {
		const userCredential = await firebase.auth().signWithEmailAndPassword(email, password);
		const idToken = await userCredential.user.getIdToken();
		return idToken;
	} catch (errror) {
		console.log('Login error:', error.message);
		throw error;
	}
};
