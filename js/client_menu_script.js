var g_clients = [];

$(window).ready(function () {    $.getJSON("../../data/clients.json", function (clients) {
        populateClientGallery(clients);

        g_clients = clients;
    });

    setupPwdPopup((client) => {
        togglePwdPopup();
        window.location.href = `../?id=${client.id}&pwd=${client.password}`;
    });

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log(parseInt(params.tag))

});