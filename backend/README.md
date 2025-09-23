# LMS Exam Backend

This is the backend server for the LMS Exam project.

## Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the server:

```bash
npm start
```

The server will run on `http://localhost:3001`.

## API Endpoints

- `POST /api/login` - User login
- `POST /api/register` - User registration
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Add a new course
- `DELETE /api/courses/:id` - Delete a course
- `GET /api/exams` - Get all exams
- `POST /api/exams` - Add a new exam
- `DELETE /api/exams/:id` - Delete an exam
- `GET /api/students` - Get all students
- `POST /api/students` - Add a new student
- `DELETE /api/students/:id` - Delete a student

## Notes

- This backend uses in-memory data storage. Data will be lost when the server restarts.
- For production use, integrate a persistent database.
