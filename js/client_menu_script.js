var g_clients = [];

$(window).ready(function () {    $.getJSON("../../data/clients.json", function (clients) {
        populateClientGallery(clients);

        g_clients = clients;
    });

    setupPwdPopup(validatePwd);

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log(parseInt(params.tag))

});