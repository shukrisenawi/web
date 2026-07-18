<?php
// Using cURL for FTPS
$ftp_server = "ftp://paskawasansik.com";
$ftp_user = "paskawas";
$ftp_pass = "eG59Q%wA34?a";

$ch = curl_init();

// Set cURL options for FTP with SSL
$url = "$ftp_server/sistem/.env";
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_USERPWD, "$ftp_user:$ftp_pass");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FTP_USE_EPSV, false);
curl_setopt($ch, CURLOPT_FTPSSLAUTH, CURLFTPAUTH_TLS);
curl_setopt($ch, CURLOPT_FTP_SSL, CURLFTPSSL_ALL);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);

$response = curl_exec($ch);

if ($response === false) {
    echo "cURL Error: " . curl_error($ch) . "\n";
    curl_close($ch);
    exit(1);
}

// Save to file
file_put_contents(".env_server", $response);
echo "Downloaded .env successfully!\n";
echo "Size: " . strlen($response) . " bytes\n";

curl_close($ch);
