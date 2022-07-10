var g_clients = [];

$(window).ready(function () {    $.getJSON("../../data/clients.json", function (clients) {
        populateClientGallery(clients);

        g_clients = clients;
    });

    setupPwdPopup((client) => {
        togglePwdPopup();
        window.location.href = `../?id=${client.id}&pwd=${client.password}`;
    });

});