import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyB6QQKBFpkKaXs1wiNaCdBCvc2NyGp9ouM",
    authDomain: "wireless-library-1defe.firebaseapp.com",
    projectId: "wireless-library-1defe",
    databaseURL: "https://wireless-library-1defe.firebaseio.com",
    storageBucket: "wireless-library-1defe.appspot.com",
    messagingSenderId: "682374635569",
    appId: "1:682374635569:web:c1d67219c29bfe6c163510"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig)
  const db = firebaseApp.firestore();
  export default db ;

