<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define("DB_HOST", "47.238.90.41");
define("DB_NAME", "care");
define("DB_USER", "Care");
define("DB_PASS", "JSrpBZwn54PW6Gei");

// define("DB_HOST", "127.0.0.1");
// define("DB_NAME", "GROUP5");
// define("DB_USER", "dbadmin");
// define("DB_PASS", "");

$conn = @mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);
if (!$conn) {
    // Something went wrong...
    echo "Error: Unable to connect to database.<br>";
    echo "Debugging errno: " . mysqli_connect_errno() . "<br>";
    echo "Debugging error: " . mysqli_connect_error() . "<br>";
    exit;
}


// Extract common code for preparing and executing statement
function executeStatement($query, $params) {
    global $conn, $return_message, $isSuccess;

    $stmt = $conn->prepare($query);
    $stmt->bind_param(...$params);
    $stmt->execute();

    return $stmt;
}
