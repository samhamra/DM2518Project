/**************************************************************
                        App.js
/**************************************************************
                        FIREBASE

    TODO: Se till att dessa metoder kan kallas
          från UI. Behöver ladda över db-objektet
          från index.html
**************************************************************/

var config = {
    apiKey: "AIzaSyDtbCaRrJDi1WywsroMRWbagl9-rWLUlE0",
    authDomain: "dm2518-e6d19.firebaseapp.com",
    databaseURL: "https://dm2518-e6d19.firebaseio.com",
    projectId: "dm2518-e6d19",
    storageBucket: "dm2518-e6d19.appspot.com",
    messagingSenderId: "872642898861"
};

firebase.initializeApp(config)}
export const db = firebase.database();
