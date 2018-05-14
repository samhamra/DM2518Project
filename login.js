import { app } from './app.js';

/*
    TODO: https://firebase.google.com/docs/auth/web/auth-state-persistence

    NOTE: https://github.com/firebase/quickstart-android/issues/334 Passwords are stored safe beyond the firebase api.
                                                                    No way to access, not even through Admin SDK
*/


// reference for report : https://stackoverflow.com/questions/2855865/validating-email-addresses-using-jquery-and-regex
var mailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@kth\.se$/gm;


/* Firebase observer */
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        if (user.emailVerified) {
            // TODO: preload lobby
            /*
            (function () {
                LOGIN.loadingScreen.show();
                // load chatrooms
            }).then(function () {
                loadingScreen.hide();
            });
            */
            window.location = 'main.html'
        } else {
            console.log("verify email!")
        }
    } else {
        console.log("logged out...")
    }
});

window.LOGIN = {}
window.LOGIN.loadingScreen = $('#modal');

window.LOGIN.validateMail = function(mail) {
    if (mailRegex.test(mail)) {
        return true;
    }
    return false;
}

window.LOGIN.showDialog = function(msg) {
    var dialog = $('#verify-dialog')[0];
    if (dialog) {
        dialog.show();
        var text = $("#dialog-text")[0];
        text.textContent = msg
    } else {
        ons.createElement('dialog.html', { append: true })
        .then(function(dialog) {
            dialog.show();
            var text = $("#dialog-text")[0];
            text.textContent = msg
        });
    }
};

window.LOGIN.hideDialog = function(id) {
    document.getElementById(id).hide();
};

window.LOGIN.showPage = function(page) {
    $('#loginNavigator')[0].pushPage(page);
}

window.LOGIN.goLogin = function () {
    var email = $('#user-login')[0].value
    var password = $('#pwd-login')[0].value
    console.log("GO LOGIN!")
    //https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        /*
            Error Codes
                auth/invalid-email
                Thrown if the email address is not valid.

                auth/user-disabled
                Thrown if the user corresponding to the given email has been disabled.

                auth/user-not-found
                Thrown if there is no user corresponding to the given email.

                auth/wrong-password
                Thrown if the password is invalid for the given email, or the account corresponding to the email does not have a password set.
        */
    })
}

window.LOGIN.register = function() {
    // TODO: https://stackoverflow.com/questions/32151178/how-do-you-include-a-username-when-storing-email-and-password-using-firebase-ba
    var username = $('#user-register')[0].value
    var email = $('#mail-register')[0].value
    var password = $('#pwd-register')[0].value
    var passCheck = $('#pwd-check-register')[0].value
    var errorPrintDiv = $('#error-register')[0]

    // check validation of mail
    if (LOGIN.validateMail(email) && password === passCheck) {
        var user = firebase.auth().currentUser;
        if(user === null) {
            https://firebase.google.com/docs/reference/js/firebase.auth.Auth#createUserWithEmailAndPassword
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(function (newUser) {
                console.log("successfully created new user")
                // force logout as firebase runs login proceedure on user creation
                // Update displayName
                newUser.updateProfile({
                    'displayName': username
                }).then(function() {
                    console.log("Added displayName")
                    // Update successful.
                }, function(error) {
                    // An error happened.
                    console.log("DisplayName error on update")
                });
                firebase.auth().signOut().then(function() {
                    // https://firebase.google.com/docs/auth/web/password-auth#next_steps
                    console.log("force logout")
                }, function(error) {
                    console.log("force logout failed")
                });
                LOGIN.verify(newUser)
            }).catch(function(error) {
                var errorCode = error.code;
                var errorMessage = error.message;
                /*
                Error Codes
                    auth/email-already-in-use
                    Thrown if there already exists an account with the given email address.

                    auth/invalid-email
                    Thrown if the email address is not valid.

                    auth/operation-not-allowed
                    Thrown if email/password accounts are not enabled. Enable email/password accounts
                    in the Firebase Console, under the Auth tab.

                    auth/weak-password
                    Thrown if the password is not strong enough.
                */
                return
            })
        } else {
            console.log("user not null!")
            console.log(user)
        }
    } else {
        LOGIN.showDialog("Du måste ange din KTH-mail!")
    }
}


window.LOGIN.verify = function(newUser) {
    //https://firebase.google.com/docs/reference/js/firebase.User#sendEmailVerification
    newUser.sendEmailVerification().then(function() {
        console.log("Email sent!")
        // Redirect back to login screen
        LOGIN.showPage('welcome.html');
        LOGIN.showDialog("Vi har skickat ett aktiverings mail till dig!");
    }).catch(function(error) {
        console.log("No email sent")
        console.log(error)
        /*
        Error codes
            auth/argument-error
            Thrown if handleCodeInApp is false.

            auth/invalid-email
            Thrown if the email address is not valid.

            auth/missing-android-pkg-name
            An Android package name must be provided if the Android app is required to be installed.

            auth/missing-continue-uri
            A continue URL must be provided in the request.

            auth/missing-ios-bundle-id
            An iOS Bundle ID must be provided if an App Store ID is provided.

            auth/invalid-continue-uri
            The continue URL provided in the request is invalid.

            auth/unauthorized-continue-uri
            The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console.
        */

    });
}
