const firebase = require('firebase');
require('firebase/firestore');

var firebaseConfig = {
  apiKey: "AIzaSyDr2xUut4qKcqNHx82LqvRNrmSEvxuBdJs",
  authDomain: "kube-da290.firebaseapp.com",
  databaseURL: "https://kube-da290.firebaseio.com",
  projectId: "kube-da290",
  storageBucket: "",
  messagingSenderId: "450803108144",
  appId: "1:450803108144:web:ccc7711ee007ef4e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();

module.exports = db;