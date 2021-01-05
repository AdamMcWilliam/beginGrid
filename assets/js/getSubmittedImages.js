function parseHTML(url) {
    var imgsArray = [];
    var dom = getSourceAsDOM(url);
    var images = dom.querySelectorAll("img[alt]");

    for (var i = 0; i < images.length; i++) {
        var image = images[i];

        imgUrl = image.attributes.src.value;
        imgName = image.attributes.alt.value;

        //create object
        var imgsObj = {
            name: imgName,
            url: imgUrl
        };

        //add to array
        imgsArray.push(imgsObj);
    }

    //add images to dom
    placeImages(imgsArray);
}


function getSourceAsDOM(url) {
    console.log("loading BeginWorld Images..");

    url = "https://api.scraperapi.com?api_key=1cda3153c83f31258a577d486128240f&url=" + url;
    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
    parser = new DOMParser();
    return parser.parseFromString(xmlhttp.responseText, "text/html");
}

function placeImages(images) {
    console.log(images);

    for (var i = 0; i < images.length; i++) {
        var url = images[i].url;
        var name = images[i].name;

        var img = document.createElement('img');
        img.src = url;
        img.alt = name;
        img.width = 280;
        img.height = 280;
        img.id = "beginWorldImage";

        document.getElementById('ImgSelector').appendChild(img);

        img.addEventListener('click', function() {
            console.log("beginWorldImage clicked");
            console.log(this.src);
            console.log(this.alt);
            LoadImage("https://api.scraperapi.com?api_key=1cda3153c83f31258a577d486128240f&url=" + this.src, null, this.alt);
        });

    }

}