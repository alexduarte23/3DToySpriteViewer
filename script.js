function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function buildContentItems(data) {
    console.log(data)

    var contentDiv = document.getElementById("item-gallery");

    for (const item of data.items) {
        var textDiv = document.createElement("div");
        var a = document.createElement("a");
        a.innerHTML = item.name;
        a.href = item.path;
        a.target = "blank"
        textDiv.appendChild(a)
        contentDiv.appendChild(textDiv);

        var img = document.createElement("img");
        img.src = item.path + "/data/" + item.thumbnail;
        contentDiv.appendChild(img);
    }
}



function togglePopup() {
    var content = document.getElementById("content");
    var html = document.getElementsByTagName('html')[0];
    var body = document.getElementsByTagName('body')[0];
    var overlay = document.getElementById("pwd-overlay");
    var popup = document.getElementById("pwd-popup");
    var pwdElement = document.getElementById("pwd");
    var header = document.getElementById("header");

    // compensate for scrollbar removal
    var scrollbarWidth = window.innerWidth - html.clientWidth
    body.style.paddingRight = `${scrollbarWidth}px`
    popup.style.left = `calc(50% - ${scrollbarWidth/2}px)`

    overlay.classList.toggle("hidden");
    overlay.classList.toggle("visible");
    content.classList.toggle("blured");
    header.classList.toggle("blured");
    html.classList.toggle("no-scroll");

    pwdElement.value = "";
    if (overlay.classList.contains("visible"))
        pwdElement.focus();
}

function validatePwd() {
    var popup = document.getElementById("pwd-popup");
    var pwdElement = document.getElementById("pwd");
    console.log(pwdElement.value);

    if (pwdElement.value == "123") {
        openPage();
        togglePopup();
    } else {
        popup.classList.toggle("wrong");
        setTimeout(()=>popup.classList.toggle("wrong"), 300);
    }
    pwdElement.value = "";

    return false;
}

function openPage() {
    window.open('http://www.google.com','new_window')
}

function classForeach(classname, func) {
    var list = document.getElementsByClassName(classname);
    for (const el of list)
        func(el);
}

function switchSection() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.toggle("dark");
}

function setupEvents() {
    classForeach("gallery-item", item => item.onclick = togglePopup);
    classForeach("backcatcher", item => item.onclick = togglePopup);
    classForeach("close-icon", item => item.onclick = togglePopup);
    
    document.getElementById("pwd-form").onsubmit = validatePwd;

    var btn = document.getElementById("to-client-menu");
    if (btn !== null)
        btn.onclick = function() { window.open('./clients/menu', '_self') };
    btn = document.getElementById("to-home");
    if (btn !== null)
        btn.onclick = function() { window.open('../../', '_self') };

    //document.getElementById("to-client-menu").onclick = function() { window.open('./wine_box', '_self') };
    document.getElementsByClassName("gallery-item")[0].onclick = openPage;
}

function main() {
    readTextFile("./list.json", function(text){
        var data = JSON.parse(text);
        console.log(data);
        //buildContentItems(data)
    });

    setupEvents();

    const params = new Proxy(new URLSearchParams(window.location.search), {
        get: (searchParams, prop) => searchParams.get(prop),
    });
    console.log(parseInt(params.tag))

}


window.onload = main;