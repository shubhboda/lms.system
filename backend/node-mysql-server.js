const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MySQL connection (XAMPP)
const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // default in XAMPP
    password: "",       // default is empty
    database: "lms_exam"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL database.");
});

// ✅ Login route
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
        if (err) return res.status(500).send("DB error");
        if (results.length === 0) return res.status(400).send("User not found");

        const user = results[0];
        // ⚠️ If you stored hashed passwords, use bcrypt.compare()
        if (password === user.password) {
            res.send("✅ Login successful");
        } else {
            res.status(400).send("❌ Invalid password");
        }
    });
});

app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
});
