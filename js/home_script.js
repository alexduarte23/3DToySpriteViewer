
var g_products = [];
var g_client = null;
var g_url_prefix = './';
var g_controller = null;

$(window).ready(function () {
    $.getJSON("./data/products.json", function (products) {
        $.getJSON("./data/clients.json", function (clients) {
            // show products that no owned by any client
            var clientProducts = clients.flatMap((client) => client.products);
            var generalProducts = products.filter((p) => !clientProducts.includes(p.id));

            g_products = generalProducts;
            populateProductGallery(generalProducts);

            setupTags(generalProducts);
            processQueryParams();
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

function processQueryParams() {
    if (window.location.search.length == 0) {
        return
    }

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    const product = g_products.find((p) => p.id == params.id)
    if (product === undefined) {
        window.history.replaceState(null, "", window.location.origin);
    } else {
        window.history.replaceState(null, "", `${window.location.origin}/?id=${params.id}`);
        showProductPopupFor(product)
    }
}
