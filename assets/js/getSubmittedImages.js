function getSourceAsDOM(url) {
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    parser = new DOMParser();
    return parser.parseFromString(xmlhttp.responseText, "text/html");
}