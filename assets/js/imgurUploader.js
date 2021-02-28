function uploadImg(imgToUpload, onComplete) {
    // Begin file upload
    console.log("Uploading file to Imgur..");

    var apiUrl = '../assets/includes/php/ImgurUpload.php';

    var settings = {
        async: false,
        processData: false,
        contentType: false,
        type: 'POST',
        url: apiUrl,
        mimeType: 'multipart/form-data'
    };

    var formData = new FormData();
    formData.append("image", imgToUpload);
    settings.data = formData;

    // Response contains stringified JSON
    // Image URL available at response.data.link
    $.ajax(settings).done(function(response) {
        //console.log(response);
        var link = response;
        onComplete(link);
    });
}