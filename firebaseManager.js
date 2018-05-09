/*****************************************
                FIREBASE STUFF
*****************************************/

var config = {
    apiKey: "AIzaSyDtbCaRrJDi1WywsroMRWbagl9-rWLUlE0",
    authDomain: "dm2518-e6d19.firebaseapp.com",
    databaseURL: "https://dm2518-e6d19.firebaseio.com",
    projectId: "dm2518-e6d19",
    storageBucket: "dm2518-e6d19.appspot.com",
    messagingSenderId: "872642898861"
};

firebase.initializeApp(config);
var db = firebase.database();
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

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $("#login").hide();
        console.log("logged in");
        // REDIRECT TO MAIN
        window.location = 'main.html'
    } else {
        console.log("not logged in, wtf?")
    }
});
