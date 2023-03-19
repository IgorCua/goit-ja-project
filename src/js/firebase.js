import * as icons from '../images/svg/user.svg';
import { refs } from './refs';

const { authorization, linkToSignOut } = refs;
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, child, update, remove } from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBSk3k-SUg9Wco3mDqClVSP1cXvTSW8MOs',
  authDomain: 'goit-js.firebaseapp.com',
  projectId: 'goit-js',
  storageBucket: 'goit-js.appspot.com',
  messagingSenderId: '393564713998',
  appId: '1:393564713998:web:635571a7cde75de092385f',
  databaseURL: 'https://goit-js-default-rtdb.europe-west1.firebasedatabase.app',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider(app);
const auth = getAuth(app);
const database = getDatabase(app);
let currentUserId = null;

onAuthStateChanged(auth, user => {
  if (user) {
    const uid = user.uid;
    authorization.style.backgroundImage = `url("${user.photoURL}")`;
    linkToSignOut.classList.remove('invisible');
    linkToSignOut.classList.add('sign-out');
    linkToSignOut.addEventListener('click', (evt) => {
      evt.preventDefault();
      auth.signOut();
      linkToSignOut.classList.add('invisible');
      linkToSignOut.classList.remove('sign-out');
      authorization.style.backgroundImage = `url("${icons}")`;
    });
    currentUser = auth.currentUser.uid;
    console.log(currentUser);
  } else {
    currentUser = 'none';
    console.log(currentUser);
  }
});

export { currentUserId };



export function authorize() {
  signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user.uid, user.displayName, user.email);
    // set(ref(db, 'users/' + user.uid), {
    //   username: user.displayName,
    //   email: user.email
    // });
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
};

export function writeFavoriteDrinks(userId, favoriteDrinks) {
  // const { drinkId, drinkName, drinkImage } = favourites;
  const db = getDatabase();
  // set(ref(db, 'users/' + userId + favoriteDrinks), {
  //   drinkId,
  //   drinkName,
  //   drinkImage
  // });
  // Write a message to the database
  
  set(ref(db, `users/${userId}`), { favoriteDrinks })
  .then(() => alert('data stored successfully'))
  .catch((error) => alert('unsuccessful, error' + error));
};

export function readFavoriteDrinks(userId) {
  const dbRef = ref(getDatabase());
  get(child(dbRef, `users/${userId}/favoriteDrinks`))
  .then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val())
      return snapshot.val();
    } else {
      // alert('No favorite drinks found');
    };
  })
  .catch((error) => {
    alert('unseccessful, error' + error);
  });
};

// export function updateFavoriteDrinks(userId) {
//   const db = getDatabase();
//   const localStorageDrinks = JSON.parse(localStorage.getItem('favorite-cocktail')) ?? [];
//   update(ref(db, `users/${userId}/favoriteDrinks`), { localStorageDrinks })
//   .then(() => alert('data updated successfully'))
//   .catch((error) => alert('unsuccessful, error' + error));
// };

export function deleteFavoriteDrink(userId, drinkId) {
  const db = getDatabase();
  remove(ref(db, `users/${userId}/favoriteDrinks/` + drinkId))
  .then(() => alert('data removed successfully'))
  .catch((error) => alert('unsuccessful, error' + error));
};