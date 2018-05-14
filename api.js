/*
    TODO: pre-load list of rooms at post-login. Before render.
*/

import {app} from './app.js'
var db = app.database();
var storage = app.storage();

window.firebaseController = {}
window.firebaseController.currentRoom = ""

/* Firebase observer */
// https://firebase.google.com/docs/reference/js/firebase.auth.Auth#onAuthStateChanged
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("logged in")
        if (user.emailVerified) {
            //
        } else {
            // Force to login page if email is not verified
            window.location = 'index.html'
        }
    } else {
        console.log("logged out")
        window.location = 'index.html'
    }
});


window.firebaseController.post = function() {
    //get form data
    var textarea = document.getElementById("msg-input");
    var ref = db.ref("rooms/" + firebaseController.currentRoom + "/messages");
    var newChildRef = ref.push();
    // set form data
    newChildRef.set({type: 'text', timestamp: firebase.database.ServerValue.TIMESTAMP, name: firebase.auth().currentUser.displayName, message: textarea.value});
    textarea.value = ""
}

// denna funktion ska användas för att populera chattrumlistans
window.firebaseController.loadChatRoomList = function() {
    var ref = db.ref("/");
    ref.once("value", function(snapshot) {
        snapshot.forEach(function(element) {
            Object.keys(element.val()).forEach(function(room) {
                UI.addChatRoomToList(room)
            })
        })
    })
}

// Kalla på denna funktion när ni har renderat ny chattsida, för att visa posts
window.firebaseController.initRoom = function(room) {
    var ref = db.ref("rooms/" + room + "/messages");
    firebaseController.currentRoom = room
    console.log(firebaseController.currentRoom)
    var messageBoard = $("#messageBoard")[0];
    ref.once("value", function(snapshot) {
        snapshot.forEach(function(post) {
            //console.log(post.val().name)
            //console.log(post.val().message)
            // använd hur ni vull
            if(post.val().type) {
                if(post.val().type == 'image') {
                    UI.renderPicture(messageBoard, post.val().name, post.val().message);
                } else {
                    UI.renderMessage(messageBoard, post.val().name, post.val().message);
                }
            }
        })
    });

    ref.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(post) {
          if(post.val().type) {
              if(post.val().type == 'image') {
                UI.renderPicture(messageBoard, post.val().name, post.val().message);
              } else {
                UI.renderMessage(messageBoard, post.val().name, post.val().message);
              }
            }
    });
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

window.firebaseController.uploadPicture = function(event) {
    console.log(event);
    var fileList = event.target.files;
    let file = null;
    for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].type.match(/^image\//)) {
            file = fileList[i];
            break;
        }
    }

    if (file !== null) {
        // Create a root reference
        var storageRef = storage.ref();
        var extension = file.name.substr(file.name.indexOf('.'));

        // Create a reference to 'images/mountains.jpg'
        var ImageRef = storageRef.child('images/' + guid() + extension);

        ImageRef.put(file).then(function(snapshot) {
            if(snapshot.state == 'success') {
                // You will get the Url here.
   	            var ref = db.ref("rooms/" + firebaseController.currentRoom + "/messages");
                var newChildRef = ref.push();
    	        newChildRef.set({type: 'image', timestamp: firebase.database.ServerValue.TIMESTAMP, name: firebase.auth().currentUser.displayName, message: snapshot.downloadURL});
                console.log('image successfully uploaded to ' + firebaseController.currentRoom);
            };
        });
    }
}


window.firebaseController.logout = function() {
    firebase.auth().signOut().then(function() {
        // https://firebase.google.com/docs/auth/web/password-auth#next_steps
        //window.location = "index.html"
    }, function(error) {
        // An error happened.
    });
}



/*****************************************
                ONSEN STUFF
    TODO: split to separate file
*****************************************/
window.UI = {};
window.UI.showPage = function(page) {
    // jQuery returns an array of DOM objects, we want the first DOM object
    // which is the have that has the pushPage function.
    $('#appNavigator')[0].pushPage(page)
}


window.UI.open = function() {
    var menu = document.getElementById('sideMenu');
    menu.open();
};

window.UI.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('sideMenu');
    content.load(page).then(menu.close.bind(menu));
};


window.UI.showChatRoom = function(roomId) {
    // find chatroom template
    var chatroom = document.getElementById("chatroom.html")
    // make navigator show page
    $('#appNavigator')[0].pushPage("chatroom.html", {data: { id : roomId }})
    .then(function() {
        // passed data by pushPage
        var data = $('#appNavigator')[0].topPage.data
        firebaseController.initRoom(data.id);
        $('#chat-room-header')[0].textContent = data.id
    });
}
/*
    Adds a list item to lobby list

    format:
    <ons-list-item class="chat-room-list-item" onclick="loadChatRoom(roomId)">
        roomId
    </ons-list-item>
*/
window.UI.addChatRoomToList = function(roomId) {
 var message ="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
    var list = $("#chat-room-list")
    var card = '<div id="'+roomId+'", style="", onclick = UI.showChatRoom(\"' + roomId + '\")><div class="card"><h2 class="card__title">' + roomId + '</h2><div class="card__content">'+ message +'</div></div></div>'

    list.append(card)
}

window.UI.renderPicture = function(board, name, url) {
  var container = document.createElement("DIV");
  var pictureContainer = document.createElement("DIV");
  var picture = document.createElement("IMG");
  picture.setAttribute("src", url);
  pictureContainer.appendChild(picture);
  container.textContent = name;
  container.setAttribute("id", "picture-container");
  container.appendChild(pictureContainer);
  board.appendChild(container)
}

window.UI.renderMessage = function(board, name, msg) {
    var container = document.createElement("DIV")
    var msgContainer = document.createElement("DIV")
    msgContainer.textContent = msg
    container.textContent = name
    container.setAttribute("id","msg-container")
    container.appendChild(msgContainer)
    board.appendChild(container)
}
