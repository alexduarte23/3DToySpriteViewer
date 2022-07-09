/*function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}*/


function togglePopup(popup) {
    // compensate for scrollbar removal
    //var scrollbarWidth = window.innerWidth - html.clientWidth
    var scrollbarWidth = window.innerWidth - $(window).width();
    $('body').css('padding-right', `${scrollbarWidth}px`);
    popup.find('.popup-card').css('left', `calc(50% - ${scrollbarWidth/2}px)`);

    popup.toggleClass('hidden visible')
    $('#content, #header').toggleClass('blured')
    $('html').toggleClass("no-scroll");

    if ($('#pwd-overlay').is(".visible"))
        $('#pwd').focus().val("");
}


function togglePwdPopup() {
    togglePopup($('#pwd-popup'));

    if ($('#pwd-popup').is(".visible")) {
        $('#pwd').focus().val("").data('clientIdx', $(this).data('idx'));
    }
}

function validatePwd() {
    var client = g_clients[$('#pwd').data('clientIdx')];
    if ($('#pwd').val() == client.password) {
        togglePwdPopup();
        window.location.href = `../?id=${client.id}&pwd=${client.password}`
    } else {
        $('#pwd-popup .popup-card').toggleClass("wrong");
        setTimeout(() => $('#pwd-popup .popup-card').toggleClass("wrong"), 300);
        $('#pwd').val("");
    }

    return false;
}

function openPage() {
    window.open('http://www.google.com','new_window')
}


function populateProductGallery(products) {
    /*<div class="gallery-item">
        <img src="https://picsum.photos/200" class="item-image">
        <div class="item-overlay">
            <p class="item-title">Lorem Ipsum</p>
        </div>
    </div>*/
    var gallery = $('#product-gallery')
    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        img_num = Math.floor(Math.random() * 500 + 500);
        $('<div>', {'class': 'gallery-item', click: openPage})
            .append($('<img>', {'class': 'item-image', src: `https://picsum.photos/${img_num}`}))
            .append($('<div>', {'class': 'item-overlay'})
                .append($('<p>', {'class': 'item-title', text: p.name}))
            )
            .data('idx', i)
            .appendTo(gallery);
    }
}

function populateClientGallery(clients) {
    /*<div class="gallery-item">
        <img src="https://picsum.photos/200" class="item-image">
        <div class="item-overlay">
            <p class="item-title">Lorem Ipsum</p>
        </div>
    </div>*/
    var gallery = $('#client-gallery')
    for (var i = 0; i < clients.length; i++) {
        var c = clients[i];
        img_num = Math.floor(Math.random() * 500 + 500);
        $('<div>', {'class': 'gallery-item', click: togglePwdPopup})
            .append($('<img>', {'class': 'item-image', src: `https://picsum.photos/${img_num}`}))
            .append($('<div>', {'class': 'item-overlay'})
                .append($('<p>', {'class': 'item-title', text: c.name}))
            )
            .data('idx', i)
            .appendTo(gallery);
    }
}


function setupPwdPopup(onsubmitFn) {
    $('#pwd-popup .backcatcher').click(togglePwdPopup);
    $('#pwd-popup .close-icon').click(togglePwdPopup);
    $('#pwd-form').submit(onsubmitFn);
}