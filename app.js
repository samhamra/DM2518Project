function showPage(page) {
    // jQuery returns an array of DOM objects, we want the first DOM object
    // which is the have that has the pushPage function.
    $('#appNavigator')[0].pushPage(page)
}

function showChatRoom(page, id) {
    // jQuery returns an array of DOM objects, we want the first DOM object
    // which is the have that has the pushPage function.
    $('#appNavigator')[0].pushPage(page)
}


showLogIn = function() {
    var dialog = document.getElementById('login');

    if(dialog) {
        dialog.show;
    } else {
        ons.createElement('login.html', { append: true })
            .then(function(dialog) {
            dialog.show();
        });
    }
}


var hideDialog = function(id) {
    document.getElementById(id).hide();
};




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
<ons-page id="chatroom">
    <ons-toolbar>
        <div class="left">
            <ons-back-button>Lobby</ons-back-button>
        </div>
        <div class="center">
            #name of chatroom#
        </div>
    </ons-toolbar>
</ons-page>
*/
window.fn.generateChatRoom = function(roomId) {
    var onsPage = document.createElement("ONS-PAGE")
    var onsToolbar = document.createElement("ONS-TOOLBAR")
    var onsToolbarLeft = document.createElement("DIV")
    var onsToolbarCenter = document.createElement("DIV")


    onsPage.setAttribute("id", roomId)
    onsToolbarLeft.setAttribute("class","left")
    onsToolbarCenter.setAttribute("class","center")
    onsToolbarCenter.textContent = roomId

    onsToolbar.appendChild(onsToolbarLeft)
    onsToolbar.appendChild(onsToolbarCenter)
    onsPage.appendChild(onsToolbar)

}
