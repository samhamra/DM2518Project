function showPage(page) {
    // jQuery returns an array of DOM objects, we want the first DOM object
    // which is the have that has the pushPage function.
    $('#appNavigator')[0].pushPage(page)
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
