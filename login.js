import { app } from './app.js';

var uiConfig = {
    //signInSuccessUrl: 'https://people.kth.se/~victorhv/DM2518Project/main.html',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ],
        // Terms of service url.
        //tosUrl: '<your-tos-url>'
    };

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);
console.log('vafan');
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        window.location = 'main.html'
    } else {
        console.log("not logged in, wtf?")
    }
});
