import firebase from 'firebase'
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCnivvuxbE7yBxfdgRUtoARk9Mu7Doaygc",
    authDomain: "challenge-e0e5e.firebaseapp.com",
    databaseURL: "https://challenge-e0e5e.firebaseio.com",
    projectId: "challenge-e0e5e",
    storageBucket: "challenge-e0e5e.appspot.com",
    messagingSenderId: "996123547297",
    appId: "1:996123547297:web:fdb5e63bc4a22964b1c2e0",
    measurementId: "G-P2W1GZXJW5"
  };

  const fireBaseApp=firebase.initializeApp(firebaseConfig);

  const db=fireBaseApp.firestore();
  const auth=firebase.auth();

  export {db,auth};