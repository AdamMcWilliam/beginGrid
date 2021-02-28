function getMode(url) {
    console.log("loading BeginWorld mode..");

    //url = "https://api.scraperapi.com?api_key=1cda3153c83f31258a577d486128240f&url=" + url;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    parser = new DOMParser();
    return parser.parseFromString(xmlhttp.responseText, "text/html");
}


function parseModes(url) {

    var chaosIndicator = document.getElementById("indicator");
    var jester = document.getElementById("jesterName");
    var dom = getMode(url);
    var body = dom.querySelector("body");

    json = JSON.parse(body.innerHTML);

    if (json.chaos == true) {
        chaosIndicator.style.background = "green";
        console.log("Chaos ON");
    } else {
        console.log("Chaos OFF");
    }

    if (json.jester) {
        jester.innerHTML = json.jester;
    }
}