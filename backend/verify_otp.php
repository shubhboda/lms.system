<?php
// verify_otp.php - Check OTP for email
require 'db.php';
header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);
$email = $conn->real_escape_string($data['email']);
$otp = $conn->real_escape_string($data['otp']);
$res = $conn->query("SELECT otp, otp_expires FROM users WHERE email='$email'");
if ($row = $res->fetch_assoc()) {
    if ($row['otp'] === $otp && strtotime($row['otp_expires']) > time()) {
        // Clear OTP after use
        $conn->query("UPDATE users SET otp=NULL, otp_expires=NULL WHERE email='$email'");
        echo json_encode(['success' => true, 'message' => 'OTP verified.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Email not found.']);
}
?>