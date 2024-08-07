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
mysqli_select_db($conn, 'db2');

$display = "SELECT * FROM highscore ORDER BY score DESC LIMIT 5;";
$results = mysqli_query($conn, $display);
$data = [];

while ($row = $results->fetch_assoc()) {
    $data[] = $row;
}

//header('Content-Type: application/json');
echo json_encode($data);



mysqli_close($conn);
