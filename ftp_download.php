<?php
$ftp_server = "paskawasansik.com";
$ftp_user = "paskawas";
$ftp_pass = "eG59Q%wA34?a";

// Connect with SSL
$conn_id = ftp_ssl_connect($ftp_server);
if (!$conn_id) {
    echo "Could not connect to $ftp_server\n";
    exit(1);
}

echo "Connected to $ftp_server\n";

// Login
$login_result = ftp_login($conn_id, $ftp_user, $ftp_pass);
if (!$login_result) {
    echo "Could not login\n";
    ftp_close($conn_id);
    exit(1);
}

echo "Logged in\n";

// Enable passive mode
ftp_pasv($conn_id, true);

// Change directory
if (!ftp_chdir($conn_id, "sistem")) {
    echo "Could not change directory\n";
    ftp_close($conn_id);
    exit(1);
}

echo "Changed to sistem directory\n";

// Download .env file
$local_file = ".env_server";
$server_file = ".env";

if (ftp_get($conn_id, $local_file, $server_file, FTP_BINARY)) {
    echo "Successfully downloaded $server_file to $local_file\n";
} else {
    echo "Could not download $server_file\n";
}

ftp_close($conn_id);
