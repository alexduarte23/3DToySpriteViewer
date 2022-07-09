
var g_clients = [];

function loadClientProducts(client) {
    $.getJSON("../data/products.json", function (products) {
        var clientProducts = client.products.map((pid) => {
            for (const p of products)
                if (p.id == pid) return p;
            return null;
        });
        clientProducts = clientProducts.filter((p) => p !== null)

        $('#content-title').text('Projetos ' + client.name);

        populateProductGallery(clientProducts);
    });
}


$(window).ready(function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    console.log(params.id)
    if (params.id === null)
        window.location.href = './menu';

    $.getJSON("../data/clients.json", function (clients) {
        var idx = -1;
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].id == params.id) {
                idx = i;
                break;
            }
        }
        if (idx == -1)
            window.location.href = './menu';
        
        var client = clients[idx];

        if (params.pwd === null || params.pwd !== client.password) {
            $('#pwd').data('clientIdx', idx);
            g_clients = clients;
            setupPwdPopup((client) => {
                togglePwdPopup();
                loadClientProducts(client);
            });
            togglePwdPopup();
        } else {
            loadClientProducts(client);
        }

    });

});