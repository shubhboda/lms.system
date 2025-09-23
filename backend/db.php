<?php
// db.php - Database connection for XAMPP (MySQL)
$host = 'localhost';
$db = 'lms_exam';
$user = 'root';
$pass = '';
$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
    die('Database connection failed: ' . $conn->connect_error);
}
?>