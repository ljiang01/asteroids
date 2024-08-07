<?php
$servername = "localhost";
$username = "root";
$password = "pass1234";

//create connection
$conn = mysqli_connect($servername, $username, $password);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS db2";
if (mysqli_query($conn, $sql)) {
    echo "Database created successfully\n";
} else {
    echo "Error creating database: " . mysqli_error($conn) . "\n";
}

mysqli_select_db($conn, 'db2');

$highscore_table = "CREATE TABLE IF NOT EXISTS highscore(
    pid INT NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    PRIMARY KEY(pid)
)";

//create tables
mysqli_query($conn, $highscore_table);
$hsarray = array();
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['data'])) {
        $data = $_POST['data'];
        $hsarray = explode(" ", $data);
    } else {
        echo "No data received.";
    }
} else {
    // Not a POST request
    echo "Invalid request.";
}

$score = (int) $hsarray[1];
echo $score;

$insert = "INSERT INTO highscore (username, score) VALUES ('" . $hsarray[0] . "', '" . $score . "')";

mysqli_query($conn, $insert);


mysqli_close($conn);
