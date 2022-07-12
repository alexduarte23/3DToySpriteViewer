
var g_products = [];
var g_client = null;
var g_url_prefix = './';
var g_controller = null;

$(window).ready(function () {
    $.getJSON("./data/products.json", function (products) {
        $.getJSON("./data/clients.json", function (clients) {
            var clientProducts = clients.flatMap((client) => client.products);
            var generalProducts = products.filter((p) => !clientProducts.includes(p.id));

            g_products = generalProducts;
            populateProductGallery(generalProducts);

            setupTags(generalProducts);
        });
    });

    setupProductPopup();

    g_controller = new ViewerController($('#product-popup .product-viewer')[0]);

    /*var offsetLeft = $('.gallery-item').eq(0).offset().left - $('.gallery').eq(0).offset().left
    $('#tag-bar').css('margin-left', offsetLeft);
    $(window).resize(() => {
        offsetLeft = $('.gallery-item').eq(0).offset().left - $('.gallery').eq(0).offset().left
        $('#tag-bar').css('margin-left', offsetLeft);
    })*/

});
