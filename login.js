import { app } from './app.js';

/*
    TODO: https://firebase.google.com/docs/auth/web/auth-state-persistence

    NOTE: https://github.com/firebase/quickstart-android/issues/334 Passwords are stored safe beyond the firebase api.
                                                                    No way to access, not even through Admin SDK
*/


// reference for report : https://stackoverflow.com/questions/2855865/validating-email-addresses-using-jquery-and-regex
var mailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@kth\.se$/gm;
var mailEndingRegex = /@kth.se\s*$/;

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
        }
    } else {
        console.log("logged out...")
    }
});

window.LOGIN = {}
window.LOGIN.loadingScreen = $('#modal');

window.LOGIN.isKTHMail = function(mail) {
    if (mailRegex.test(mail)) {
        return true;
    }
    return false;
}

window.LOGIN.showDialog = function(msg) {
    var dialog = $('#dialog')[0];
    if (dialog) {
        dialog.show();
        var text = $("#dialog-text")[0];
        text.textContent = msg
    } else {
        ons.createElement('dialog.html', { append: true })
        .then(function(dialog) {
            var text = $("#dialog-text")[0];
            text.textContent = msg
            dialog.show();
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
    var email = $.trim($('#user-login').val().toLowerCase())
    var password = $.trim($('#pwd-login').val())
    //https://firebase.google.com/docs/reference/js/firebase.auth.Auth#signInWithEmailAndPassword



    // append @kth.se
    if (!mailEndingRegex.test(email)) {
        console.log(email)
        email = email + "@kth.se";
        console.log(email)
    }

    // not valid email a valid kth-mail?
    if (LOGIN.isKTHMail(email)) {
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (user) {
            if(!user.emailVerified) {
                // Notify user that email verification is missing
                // TODO: re-validate
                LOGIN.showDialog("You must activate your account")
                // force logout user
                firebase.auth().signOut().then(function() {
                    // https://firebase.google.com/docs/auth/web/password-auth#next_steps
                    console.log("force logout")
                }, function(error) {
                    console.log("force logout failed")
                });
                return
            } else {
                console.log("A-OK!")
            }
        })
        .catch(function(error) {
            switch (error.code) {
                case 'auth/invalid-email':
                    LOGIN.showDialog(email + " is not a valid email address");
                    break;
                case 'auth/user-disabled':
                    LOGIN.showDialog("This user is disabled. Contact shamra@kth.se");
                    break;
                case 'auth/user-not-found':
                    LOGIN.showDialog(email + " is not registered. Create an account");
                    break;
                case 'auth/wrong-password':
                    LOGIN.showDialog("Wrong password, Try again");
                    $('#pwd-login').val("");
                    break;
                default:
                    LOGIN.showDialog("Unknown error. Contact shamra@kth.se");
                return
            }
        })
    } else {
        LOGIN.showDialog("You must login with a KTH email address")
        return
    }
}

window.LOGIN.register = function() {
    // TODO: https://stackoverflow.com/questions/32151178/how-do-you-include-a-username-when-storing-email-and-password-using-firebase-ba
    var username = $.trim($('#user-register').val())
    var email = $.trim($('#mail-register').val().toLowerCase())
    var password = $.trim($('#pwd-register').val())
    var passCheck = $.trim($('#pwd-check-register').val())
    var errorPrintDiv = $('#error-register')[0]

    // check validation of mail
    if (LOGIN.isKTHMail(email)) {
        if (password !== passCheck) {
            LOGIN.showDialog("Passwords not identical, Try again")
            $('#pwd-register').val("")
            $('#pwd-check-register').val("")
            return
        }
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
                $('#loginNavigator')[0].popPage();
                LOGIN.showDialog("We have sent an email with a confirmation link to your email address");
            }).catch(function(error) {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        LOGIN.showDialog("There is already a user with this email");
                        break;
                    case "auth/invalid-email":
                        LOGIN.showDialog(email + " is not a valid email adress");
                        break;
                    case "auth/operation-not-allowed":
                        LOGIN.showDialog("Email/Password not enabled. Contact shamra@kth.se");
                        break;
                    case "auth/operation-not-allowed":
                        LOGIN.showDialog("Password needs to be at least 6 characters");
                        break;
                    default:
                        LOGIN.showDialog("Unknown error. Contact shamra@kth.se");
                }
                return
            })
        } else {
            LOGIN.showDialog("You already have an account")
            return
        }
    } else {
        // TODO: Varför hamnar vi här ibland? Fel på regex?
        LOGIN.showDialog("You must enter a KTH email address")
        return
    }
}

window.LOGIN.verify = function(user) {
    //https://firebase.google.com/docs/reference/js/firebase.User#sendEmailVerification

    user.sendEmailVerification().then(function() {
        console.log("Email sent!")
    }).catch(function(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                LOGIN.showDialog("Invalid email address");
                break;
            default:
                LOGIN.showDialog("Unknown error: " + error.code)
            }
    });
}
