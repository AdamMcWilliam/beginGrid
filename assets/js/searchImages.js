$('form').submit(function(e) {
    console.log("searching Images");
    e.preventDefault();
    $('#ImgSelector img').hide();
    $('#ImgSelector img[alt*="' + $('#search').val() + '"]').show();
});