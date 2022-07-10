var L2;


var g_clients = [];
var g_product = null;


function loadViewer(product) {
    $('.logo').toggleClass('logo-intro');
    $('#viewerDiv').toggleClass('viewer-intro');

    var nameOfDiv = "viewerDiv";
    var folderName = '../data/' + product.folder;
    var viewPortWidth = 1296;
    var viewPortHeight = 888;
    var backgroundColor = "#FFFFFF";
    var uCount = 18;
    var vCount = 1;
    var uWrap = true;
    var vWrap = false;
    var uMouseSensitivity = -0.05;
    var vMouseSensitivity = 1;
    var uStartIndex = 9;
    var vStartIndex = 0;
    var minZoom = 1;
    var maxZoom = 3;
    var rotationDamping = 0.96;
    var downScaleToBrowser = true;
    var addDownScaleGUIButton = false;
    var downloadOnInteraction = false;
    var imageExtension = "jpg";
    var showLoading = false;
    var loadingIcon = ""; // Set to empty string for default icon.
    var allowFullscreen = false; // Double-click in desktop browsers for fullscreen.
    var uReverse = false;
    var vReverse = false;
    var hotspots = {};
    var isIBooksWidget = false;

    L2 = new L2Viewer(nameOfDiv,folderName,viewPortWidth,viewPortHeight,backgroundColor,uCount,vCount,uWrap,vWrap,uMouseSensitivity,vMouseSensitivity,uStartIndex,vStartIndex,minZoom,maxZoom,rotationDamping,downScaleToBrowser,addDownScaleGUIButton,downloadOnInteraction,imageExtension,showLoading,loadingIcon,allowFullscreen,uReverse,vReverse,hotspots,isIBooksWidget);

}

$(window).ready(function () {
    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });

    if (params.id === null)
        window.location.href = '../';

    $.getJSON("../data/products.json", function (products) {

    //$.getJSON("../data/clients.json", function (clients) {

        /*var filtered = products.filter((p) => p.id === params.id);
        if (filtered.length == 0)
            window.location.href = '../';
        var product = filtered[0];*/
        var idx = -1;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id == params.id) {
                idx = i;
                break;
            }
        }
        if (idx == -1)
            window.location.href = '../';
        
        var product = products[idx];
        g_product = product;
        
        $.getJSON("../data/clients.json", function (clients) {
            var idx = -1;
            for (var i = 0; i < clients.length; i++) {
                if (clients[i].products.includes(params.id)) {
                    idx = i;
                    break;
                }
            }

            if (idx >= 0 && (params.pwd === null || params.pwd !== clients[idx].password)) {
                $('#pwd').data('clientIdx', idx);
                g_clients = clients;
                setupPwdPopup((client) => {
                    togglePwdPopup();
                    loadViewer(g_product);
                });
                togglePwdPopup();
            } else {
                loadViewer(g_product);
            }
        });
    });

});