function fileType(file) {
    const type = file.type.split('/').shift();
    return type !== 'image' ? 'Invalid image type' : null;
}

function uploadImage() {
    const imgurAPI = '0356f753b33adbb'; // Replace with your actual Imgur client ID
    const imageInput = document.getElementById('imageInput');
    
    if (!imageInput.files.length) {
        console.error('No file selected');
        return;
    }

    const file = imageInput.files[0];
    const fileTypeError = fileType(file);

    if (fileTypeError) {
        console.error(fileTypeError);
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageBase64 = event.target.result.split(',')[1];

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/image.json', true);
        xhr.setRequestHeader('Authorization', `Client-ID ${imgurAPI}`);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                const link = response.data.link;
                console.log(link);
            }
        };

        xhr.send(`image=${encodeURIComponent(imageBase64)}`);
    };

    reader.readAsDataURL(file);
}