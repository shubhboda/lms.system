
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static frontend files from project root or 'public' folder
app.use(express.static(path.join(__dirname, '..')));

// Serve index.html on root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// In-memory data storage (replace with database in future)
let users = [];
let courses = [];
let exams = [];
let students = [];

// User authentication (simple example)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    res.json({ success: true, userId: user.id });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ success: false, message: 'Username already exists' });
  }
  const newUser = { id: Date.now(), username, password };
  users.push(newUser);
  res.json({ success: true, userId: newUser.id });
});

// Courses APIs
app.get('/api/courses', (req, res) => {
  res.json(courses);
});

app.post('/api/courses', (req, res) => {
  const course = { id: Date.now(), ...req.body };
  courses.push(course);
  res.json(course);
});

app.delete('/api/courses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  courses = courses.filter(c => c.id !== id);
  res.json({ success: true });
});

// Exams APIs
app.get('/api/exams', (req, res) => {
  res.json(exams);
});

app.post('/api/exams', (req, res) => {
  const exam = { id: Date.now(), ...req.body };
  exams.push(exam);
  res.json(exam);
});

app.delete('/api/exams/:id', (req, res) => {
  const id = parseInt(req.params.id);
  exams = exams.filter(e => e.id !== id);
  res.json({ success: true });
});

  
// Students APIs
app.get('/api/students', (req, res) => {
  res.json(students);
});

// Get single student by ID
app.get('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const student = students.find(s => s.id === id);
  if (!student) {
    return res.status(404).json({ success: false, message: 'Student not found' });
  }
  res.json(student);
});

app.post('/api/students', (req, res) => {
  const student = { id: Date.now(), ...req.body };
  students.push(student);
  res.json(student);
});

app.delete('/api/students/:id', (req, res) => {
  const id = parseInt(req.params.id);
  students = students.filter(s => s.id !== id);
  res.json({ success: true });
});

// Start server
app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});
