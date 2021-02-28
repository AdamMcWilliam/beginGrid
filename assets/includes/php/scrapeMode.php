<?php
include_once("creds.php");

$url = "https://beginworld.website-us-east-1.linodeobjects.com/wtf.json";

// Initialize a connection with cURL (ch = cURL handle, or "channel")
$ch = curl_init();

// Set the URL
curl_setopt($ch, CURLOPT_URL, "http://api.scraperapi.com?api_key=".$scraperAPI."&url=".$url);
//curl_setopt($ch, CURLOPT_URL, $url);

// Set the HTTP method
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');

// Return the response instead of printing it out
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);

// Send the request and store the result in $response
$response = curl_exec($ch);

echo $response;

// Close cURL resource to free up system resources
curl_close($ch);


?>
