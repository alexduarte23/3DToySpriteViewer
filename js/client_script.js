


$(window).ready(function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    console.log(params.id)
    if (params.id === null)
        window.location.href = './menu';

    $.getJSON("../data/clients.json", function (clients) {
        var filteredClients = clients.filter((client) => client.id === params.id);
        if (filteredClients.length < 1)
            window.location.href = './menu';
        
        var client = filteredClients[0];

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
    });

});