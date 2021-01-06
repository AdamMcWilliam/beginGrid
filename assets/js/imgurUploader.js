function uploadImg(imgToUpload, onComplete) {
    // Begin file upload
    console.log("Uploading file to Imgur..");

    var apiUrl = 'https://api.imgur.com/3/image';
    var apiKey = '0356f753b33adbb';

    var settings = {
        async: false,
        crossDomain: true,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        headers: {
            Authorization: 'Client-ID ' + apiKey,
            Accept: 'application/json'
        },
        mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", imgToUpload);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function(response) {
        var json = JSON.parse(response);
        var link = json.data.link;
        onComplete(link);
    });
}