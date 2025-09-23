<?php
include 'db.php'; // include MySQL connection

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Hash the password (recommended for security)
    $hashed_password = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user
    $sql = "INSERT INTO users (email, password) VALUES (?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $email, $hashed_password);

    if ($stmt->execute()) {
        echo "✅ Registration successful! You can now <a href='login.html'>Login</a>";
    } else {
        echo "❌ Error: " . $stmt->error;
    }
}
?>