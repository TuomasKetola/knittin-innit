import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-app.js";
      
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-auth.js";

import { getFirestore, doc, addDoc, collection } from "https://www.gstatic.com/firebasejs/9.6.5/firebase-firestore.js";

export {db, auth, user, doc, addDoc, collection}

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


 // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {      
  apiKey: "AIzaSyC821QK14SwRBRt4V39AMkADnl5Qaue5pE", 
  authDomain: "neuleesi.firebaseapp.com",      
  projectId: "neuleesi",      
  storageBucket: "neuleesi.appspot.com",      
  messagingSenderId: "635210421804",      
  appId: "1:635210421804:web:a5b4e43116e6868a6fa389",      
  measurementId: "G-7BTE9B5S2H"     
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const auth = getAuth(app)

var modalLogin = document.getElementById("loginModal");

let signinModalButton = document.getElementById('logInButton')
let signoutModalButton = document.getElementById('logOutButton')

let signUpButton = document.getElementById("signup");
let userNameField = document.getElementById("username");
let passwordField = document.getElementById("password");
signUpButton.onclick = function() {
    let userName = userNameField.value
    let password = passwordField.value
    if (userName && password) {
        // const auth = getAuth();
            createUserWithEmailAndPassword(auth, userName, password)
            .then((userCredential) => {
                const user = userCredential.user;
                modalLogin.style.display = "none";
                signinModalButton.style.visibility = 'hidden';
                signoutModalButton.style.visibility = 'visible';
                userNameField.value = '';
                passwordField.value = '';
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                let errorField = document.getElementById('loginerror')
                console.log(errorCode, errorMessage)
                
                // weak password
                if (errorCode == 'auth/weak-password') {
                    errorField.value  = 'Salasanan on oltava vahintaan 6 merkkia pitka'
                }
                // invalid email
                else if (errorCode == 'auth/invalid-email') {
                    errorField.value  = 'Sahkoposti ei ole mahdollinen'
                    // console.log('yay')
                }
                // email already in use
                else if (errorCode == 'auth/email-already-in-use') {
                    errorField.value  = 'Sahkoposti on jo kaytossa'
                    // console.log('yay')
                }
                // ..
            });
    }
    
}

let signInButton = document.getElementById("signin");
signInButton.onclick = function() {
    let userName = userNameField.value
    let password = passwordField.value
    if (userName && password) {
        // const auth = getAuth();
            signInWithEmailAndPassword(auth, userName, password)
            .then((userCredential) => {
                const user = userCredential.user;
                modalLogin.style.display = "none";
                signinModalButton.style.visibility = 'hidden';
                signoutModalButton.style.visibility = 'visible';
                userNameField.value = '';
                passwordField.value = '';
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                let errorField = document.getElementById('loginerror')
                if (errorCode == 'auth/wrong-password') {
                    errorField.value  = 'Vaara Salasana'
                }
            });
    }   
}

let signOutButton = document.getElementById("logOutButton");
signOutButton.onclick = function() {
    signOut(auth).then(() => {
        // Sign-out successful.
        signoutModalButton.style.visibility = 'hidden'
        signinModalButton.style.visibility = 'visible'
        console.log('successfully signed out')
        console.log(uid)
      }).catch((error) => {
          console.log(error.code, error.message)
        // An error happened.
      });
}

const auth = getAuth();
let user = undefined
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    const uid = user.uid;
    signoutModalButton.style.visibility = 'visible'
    signinModalButton.style.visibility = 'hidden'
    // console.log(uid);
    // ...
  } else {
    // User is signed out
    signoutModalButton.style.visibility = 'hidden'
    signinModalButton.style.visibility = 'visible'
    // ...
  }
});


const db = getFirestore();

