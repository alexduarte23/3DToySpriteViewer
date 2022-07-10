
var g_products = [];
var g_client = null;
var g_product_url = './product';

$(window).ready(function () {
    $.getJSON("./data/products.json", function (products) {
        $.getJSON("./data/clients.json", function (clients) {
            var clientProducts = clients.flatMap((client) => client.products);
            var generalProducts = products.filter((p) => !clientProducts.includes(p.id));

            g_products = generalProducts;
            populateProductGallery(generalProducts);
        });
    });

    setupProductPopup();

});
