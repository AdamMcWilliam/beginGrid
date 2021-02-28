<?php
include_once("creds.php");

$filetype = explode('/',($_FILES['image']['type']));
if ($filetype[0] !== 'image') {
    die('Invalid image type');
}

$image = file_get_contents($_FILES['image']['tmp_name']);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.imgur.com/3/image.json');
curl_setopt($ch, CURLOPT_POST, TRUE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
curl_setopt($ch, CURLOPT_HTTPHEADER, array( "Authorization: Client-ID $imgurAPI" ));
curl_setopt($ch, CURLOPT_POSTFIELDS, array( 'image' => base64_encode($image) ));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$reply = curl_exec($ch);

curl_close($ch);

$reply = json_decode($reply);

//echo "<h3>Image</h3>";
printf($reply->data->link);


//echo "<h3>API Debug</h3><pre>";
//var_dump($reply);
?>