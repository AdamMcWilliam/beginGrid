<?php
include("creds.php");

$file = file_get_contents("pokejacket.png");

$url = 'https://api.imgur.com/3/image.json';
$headers = array("Authorization: Client-ID $imgurAPI");
$pvars  = array('image' => base64_encode($file));

$curl = curl_init();

curl_setopt_array($curl, array(
   CURLOPT_URL=> $url,
   CURLOPT_TIMEOUT => 30,
   CURLOPT_POST => 1,
   CURLOPT_RETURNTRANSFER => 1,
   CURLOPT_HTTPHEADER => $headers,
   CURLOPT_POSTFIELDS => $pvars
));

$json_returned = curl_exec($curl); // blank response
echo "Result: " . $json_returned ;

curl_close ($curl); 
?>