/*
    TODO: pre-load list of rooms at post-login. Before render.
*/

import {app} from './app.js'
var db = app.database();


window.firebaseController = {}
window.firebaseController.currentRoom = ""

window.firebaseController.post = function() {
    //get form data
    var textarea = document.getElementById("msg-input");
    var ref = db.ref("rooms/" + firebaseController.currentRoom + "/messages");
    var newChildRef = ref.push();
    // set form data
    newChildRef.set({timestamp: Firebase.ServerValue.TIMESTAMP, name: firebase.auth().currentUser.displayName, message: textarea.value});

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
            UI.renderMessage(messageBoard, post.val().name, post.val().message)
        })
    });

    ref.orderByChild('timestamp').startAt(Date.now()).on('child_added', function(snapshot) {
      console.log('new record', snapshot);
    });
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


        // Create a reference to 'images/mountains.jpg'
        var ImageRef = storageRef.child('images/' + file.name);

        ImageRef.put(file).then(function(snapshot) {

      	  if(snapshot.state == 'success'){
             // You will get the Url here.
   	      var ref = db.ref("rooms/" + firebaseController.currentRoom + "/messages");
              var newChildRef = ref.push();
    	      newChildRef.set({timestamp: Firebase.ServerValue.TIMESTAMP, name: firebase.auth().currentUser.displayName, message: snapshot.downloadURL, type:'image'});
 	console.log('image successfully uploaded to ' + room);
        };
      });
    }
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
    var list = document.getElementById("chat-room-list")
    var item = document.createElement("ONS-LIST-ITEM")
    item.setAttribute("class", "chat-room-list-item")
    item.setAttribute("id", roomId)
    item.setAttribute("onclick", "UI.showChatRoom(\"" + roomId + "\")")
    item.textContent = roomId
    list.appendChild(item)
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
