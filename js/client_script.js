
var g_clients = [];
var g_products = [];
var g_client = null;
var g_product_url = '../product';

function loadClientProducts(client) {
    $.getJSON("../data/products.json", function (products) {
        var clientProducts = client.products.map((pid) => {
            for (const p of products)
                if (p.id == pid) return p;
            return null;
        });
        clientProducts = clientProducts.filter((p) => p !== null)
        g_products = clientProducts;

        $('#content-title').text('Projetos ' + client.name);
        $('#brand-logo').attr('src', 'https://picsum.photos/365');

        populateProductGallery(clientProducts);

        setupTags(clientProducts);
    });
}


$(window).ready(function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

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
        g_client = client;

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

    setupProductPopup();

});