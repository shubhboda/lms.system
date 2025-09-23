<?php
// send_otp.php - Generate and store OTP for email
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$otp = rand(100000, 999999);
$expires = date('Y-m-d H:i:s', time() + 300); // 5 min expiry
$res = $conn->query("SELECT id FROM users WHERE email='$email'");
if ($res->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Email not found.']);
    exit;
}
$conn->query("UPDATE users SET otp='$otp', otp_expires='$expires' WHERE email='$email'");
// In production, send OTP via email. Here, return for demo.
echo json_encode(['success' => true, 'otp' => $otp, 'message' => 'OTP sent.']);
?>