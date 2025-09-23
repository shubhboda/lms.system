<?php
// login.php - Password login
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$password = $data['password'];
$res = $conn->query("SELECT id, password FROM users WHERE email='$email'");
if ($row = $res->fetch_assoc()) {
    if (password_verify($password, $row['password'])) {
        echo json_encode(['success' => true, 'message' => 'Login successful.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email not found.']);
}
?>