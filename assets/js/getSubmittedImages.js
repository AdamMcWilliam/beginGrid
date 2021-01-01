function getSourceAsDOM(url) {
    return fetch('https://api.scraperapi.com?api_key=1cda3153c83f31258a577d486128240f&url=' + url)
        .then(d => d.text())
        .then((responseData) => {
            console.log(responseData);
            return responseData
        })
        .catch(error => console.warn(error));
}