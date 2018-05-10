
import { db } from './app.js';

function post(room) {
    //get form data
    var form = document.getElementById("post");
    var ref = db.ref("rooms/" + room + "/messages");
    var newChildRef = ref.push();
    // set form data
    newChildRef.set({name: firebase.auth().currentUser.displayName, message: form.message.value});
}

// denna funktion ska användas för att populera chattrumlistans
function loadChatRoomList() {
    var ref = db.ref("/");
    ref.once("value", function(snapshot) {
        snapshot.forEach(function(element) {
            Object.keys(element.val()).forEach(function(room) {
                console.log(room);
                //button onclick'openroom(room)'
                // Skapa en knapp för varje rum, med id room
            })
        })
    })
}

// Kalla på denna funktion när ni har renderat ny chattsida, för att visa posts
function openRoom(room) {
    var ref = db.ref("rooms/" + room + "/messages");
    ref.on("value", function(snapshot) {
        snapshot.forEach(function(post) {
            console.log(post.val().name)
            console.log(post.val().message)
            // använd hur ni vull
        })
    })
}


/*****************************************
                ONSEN STUFF
    TODO: split to separate file
*****************************************/

function showPage(page) {
    // jQuery returns an array of DOM objects, we want the first DOM object
    // which is the have that has the pushPage function.
    $('#appNavigator')[0].pushPage(page)

    if(page === 'lobby.html') {
        console.log("test")
    }
}


function showChatRoom(roomId) {
    // find chatroom template
    var chatroom = document.getElementById("chatroom.html")

    // make navigator show page
    $('#appNavigator')[0].pushPage("chatroom.html", {data: { id : roomId }})
    .then(function() {
        loadChatRoom()
    });
}


function loadChatRoom() {
    // passed data by pushPage
    var data = $('#appNavigator')[0].topPage.data
    // set header to room id
    $('#chat-room-header')[0].textContent = data.id

}

window.fn = {};


window.fn.open = function() {
    var menu = document.getElementById('sideMenu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('sideMenu');
    content.load(page).then(menu.close.bind(menu));
};



/*
    Adds a list item to lobby list

    format:
    <ons-list-item class="chat-room-list-item" onclick="loadChatRoom(roomId)">
        roomId
    </ons-list-item>
*/
window.fn.addChatRoomToList = function(roomId) {
    var list = document.getElementById("chat-room-list")
    var item = document.createElement("ONS-LIST-ITEM")
    item.setAttribute("class", "chat-room-list-item")
    item.setAttribute("id", roomId)
    item.setAttribute("onclick", "showChatRoom(\"" + roomId + "\")")
    item.textContent = roomId
    list.appendChild(item)
}
