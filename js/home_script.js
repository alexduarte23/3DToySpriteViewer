

$(window).ready(function () {
    $.getJSON("./data/products.json", function (products) {
        $.getJSON("./data/clients.json", function (clients) {
            var clientProducts = clients.flatMap((client) => client.products);
            var generalProducts = products.filter((p) => !clientProducts.includes(p.id));

            populateProductGallery(generalProducts);
        });
    });

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log(parseInt(params.tag))

});
