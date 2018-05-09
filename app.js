function showPage(page) {
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
    var menu = document.getElementById('menu');
    menu.open();
};

window.fn.load = function(page) {
    var content = document.getElementById('content');
    var menu = document.getElementById('menu');
    content.load(page).then(menu.close.bind(menu));
}   ;