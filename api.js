/*
    TODO: pre-load list of rooms at post-login. Before render.
*/

import {app} from './app.js'
var db = app.database();
var storage = app.storage();



window.firebaseController = {}
window.firebaseController.currentRoomList = []

window.firebaseController.post = function(room) {
    //get form data
    var form = document.getElementById("post");
    var ref = db.ref("rooms/" + room + "/messages");
    var newChildRef = ref.push();
    // set form data
    newChildRef.set({name: firebase.auth().currentUser.displayName, message: form.message.value, type:'text'});
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
window.firebaseController.openRoom = function(room) {
    var ref = db.ref("rooms/" + room + "/messages");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(post) {
            console.log(post.val().name)
            console.log(post.val().message)
            // använd hur ni vull
        })
    })
}

window.firebaseController.uploadPicture = function(event, room) {
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

	  console.log(snapshot);
      	  if(snapshot.state == 'success'){
		console.log(snapshot);
             // You will get the Url here.
   	      var ref = db.ref("rooms/" + room + "/messages");
              var newChildRef = ref.push();
    	      newChildRef.set({name: firebase.auth().currentUser.displayName, message: snapshot.downloadURL, type:'image'});
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
        // set header to room id
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
