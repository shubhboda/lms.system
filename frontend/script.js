 // Data storage
let courses = JSON.parse(localStorage.getItem('courses')) || [];
let exams = JSON.parse(localStorage.getItem('exams')) || [];
let students = JSON.parse(localStorage.getItem('students')) || [];

// Live exam state
let currentLiveExam = null;
let timerInterval = null;
let remainingTime = 0;

// DOM elements
const coursesTab = document.getElementById('courses-tab');
const examsTab = document.getElementById('exams-tab');
const studentsTab = document.getElementById('students-tab');
const liveExamsTab = document.getElementById('live-exams-tab');

const coursesSection = document.getElementById('courses-section');
const examsSection = document.getElementById('exams-section');
const studentsSection = document.getElementById('students-section');
const liveExamsSection = document.getElementById('live-exams-section');

const coursesList = document.getElementById('courses-list');
const examsList = document.getElementById('exams-list');
const studentsList = document.getElementById('students-list');
const liveExamsList = document.getElementById('live-exams-list');

const courseForm = document.getElementById('course-form');
const examForm = document.getElementById('exam-form');
const studentForm = document.getElementById('student-form');

const liveExamTimer = document.getElementById('live-exam-timer');
const liveExamName = document.getElementById('live-exam-name');
const timerDisplay = document.getElementById('timer-display');
const endLiveExamBtn = document.getElementById('end-live-exam-btn');

// Tab switching
coursesTab.addEventListener('click', () => showSection('courses'));
examsTab.addEventListener('click', () => showSection('exams'));
studentsTab.addEventListener('click', () => showSection('students'));

function showSection(section) {
    coursesSection.classList.add('hidden');
    examsSection.classList.add('hidden');
    studentsSection.classList.add('hidden');

    if (section === 'courses') coursesSection.classList.remove('hidden');
    if (section === 'exams') examsSection.classList.remove('hidden');
    if (section === 'students') studentsSection.classList.remove('hidden');
}

// Form submissions
courseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('course-name').value;
    const description = document.getElementById('course-description').value;
    const course = { id: Date.now(), name, description };
    courses.push(course);
    saveData();
    renderCourses();
    updateCourseSelects();
    courseForm.reset();
});

examForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('exam-name').value;
    const courseId = document.getElementById('exam-course').value;
    const date = document.getElementById('exam-date').value;
    const exam = { id: Date.now(), name, courseId: parseInt(courseId), date };
    exams.push(exam);
    saveData();
    renderExams();
    examForm.reset();
});

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('student-name').value;
    const email = document.getElementById('student-email').value;
    const courseId = document.getElementById('student-course').value;
    const student = { id: Date.now(), name, email, courseId: parseInt(courseId) };
    students.push(student);
    saveData();
    renderStudents();
    studentForm.reset();
});

// Render functions
function renderCourses() {
    coursesList.innerHTML = '';
    courses.forEach(course => {
        const card = document.createElement('div');
        card.className = 'card fade-in slide-up';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${course.name}</h3>
            <p class="text-text-secondary mb-4">${course.description}</p>
            <button onclick="deleteCourse(${course.id})" class="btn-accent">Delete</button>
        `;
        coursesList.appendChild(card);
        setTimeout(() => card.classList.remove('fade-in', 'slide-up'), 700);
    });
}

function renderExams() {
    examsList.innerHTML = '';
    exams.forEach(exam => {
        const course = courses.find(c => c.id === exam.courseId);
        const card = document.createElement('div');
        card.className = 'card fade-in slide-up';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${exam.name}</h3>
            <p class="text-text-secondary mb-2">Course: ${course ? course.name : 'Unknown'}</p>
            <p class="text-text-secondary mb-4">Date: ${exam.date}</p>
            <button onclick="deleteExam(${exam.id})" class="btn-accent">Delete</button>
        `;
        examsList.appendChild(card);
        setTimeout(() => card.classList.remove('fade-in', 'slide-up'), 700);
    });
}

function renderStudents() {
    studentsList.innerHTML = '';
    students.forEach(student => {
        const course = courses.find(c => c.id === student.courseId);
        const card = document.createElement('div');
        card.className = 'card cursor-pointer fade-in slide-up';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2">${student.name}</h3>
            <p class="text-text-secondary mb-2">Email: ${student.email}</p>
            <p class="text-text-secondary mb-4">Course: ${course ? course.name : 'Unknown'}</p>
            <button onclick="deleteStudent(${student.id})" class="btn-accent">Delete</button>
        `;
        card.addEventListener('click', (e) => {
            // Prevent triggering when delete button is clicked
            if (e.target.tagName.toLowerCase() === 'button') return;
            showStudentProfile(student.id);
        });
        studentsList.appendChild(card);
        setTimeout(() => card.classList.remove('fade-in', 'slide-up'), 700);
    });
}

// Show student profile modal
function showStudentProfile(studentId) {
    fetch(`/api/students/${studentId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Student not found');
            }
            return response.json();
        })
        .then(student => {
            // Create modal content
            const modal = document.createElement('div');
            modal.id = 'student-profile-modal';
            modal.style.position = 'fixed';
            modal.style.top = '0';
            modal.style.left = '0';
            modal.style.width = '100vw';
            modal.style.height = '100vh';
            modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
            modal.style.display = 'flex';
            modal.style.justifyContent = 'center';
            modal.style.alignItems = 'center';
            modal.style.zIndex = '1000';

            const modalContent = document.createElement('div');
            modalContent.style.backgroundColor = 'white';
            modalContent.style.padding = '2rem';
            modalContent.style.borderRadius = '8px';
            modalContent.style.width = '400px';
            modalContent.style.maxHeight = '80vh';
            modalContent.style.overflowY = 'auto';
            modalContent.className = 'fade-in slide-up';

            modalContent.innerHTML = `
                <h2 class="text-2xl font-bold mb-4">${student.name}</h2>
                <p><strong>Email:</strong> ${student.email}</p>
                <p><strong>Course:</strong> ${courses.find(c => c.id === student.courseId)?.name || 'Unknown'}</p>
                <button id="close-student-profile" class="btn-accent mt-4">Close</button>
            `;

            modal.appendChild(modalContent);
            document.body.appendChild(modal);

            setTimeout(() => modalContent.classList.remove('fade-in', 'slide-up'), 700);

            document.getElementById('close-student-profile').addEventListener('click', () => {
                document.body.removeChild(modal);
            });

            // Close modal on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
        })
        .catch(err => {
            alert(err.message);
        });
}

// Delete functions
function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    saveData();
    renderCourses();
    updateCourseSelects();
    renderExams(); // Update exams if course deleted
    renderStudents(); // Update students if course deleted
}

function deleteExam(id) {
    exams = exams.filter(e => e.id !== id);
    saveData();
    renderExams();
}

function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    saveData();
    renderStudents();
}

// Update course selects
function updateCourseSelects() {
    const examSelect = document.getElementById('exam-course');
    const studentSelect = document.getElementById('student-course');

    examSelect.innerHTML = '<option value="">Select Course</option>';
    studentSelect.innerHTML = '<option value="">Select Course</option>';

    courses.forEach(course => {
        const option1 = document.createElement('option');
        option1.value = course.id;
        option1.textContent = course.name;
        examSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = course.id;
        option2.textContent = course.name;
        studentSelect.appendChild(option2);
    });
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('courses', JSON.stringify(courses));
    localStorage.setItem('exams', JSON.stringify(exams));
    localStorage.setItem('students', JSON.stringify(students));
}

  
// Initialize
renderCourses();
renderExams();
renderStudents();
updateCourseSelects();
renderLiveExams();
setupLiveExamEvents();

// Tab switching - add live exams tab
liveExamsTab.addEventListener('click', () => showSection('live-exams'));

// Extend showSection to handle live exams
const originalShowSection = showSection;
showSection = function(section) {
    coursesSection.classList.add('hidden');
    examsSection.classList.add('hidden');
    studentsSection.classList.add('hidden');
    liveExamsSection.classList.add('hidden');

    if (section === 'courses') coursesSection.classList.remove('hidden');
    if (section === 'exams') examsSection.classList.remove('hidden');
    if (section === 'students') studentsSection.classList.remove('hidden');
    if (section === 'live-exams') liveExamsSection.classList.remove('hidden');

    // Update page title
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        if (section === 'live-exams') {
            pageTitle.textContent = 'Live Exams';
        } else if (section === 'courses') {
            pageTitle.textContent = 'Courses';
        } else if (section === 'exams') {
            pageTitle.textContent = 'Exams';
        } else if (section === 'students') {
            pageTitle.textContent = 'Students';
        } else {
            pageTitle.textContent = 'Dashboard';
        }
    }
};

// Render live exams list
function renderLiveExams() {
    liveExamsList.innerHTML = '';
    if (exams.length === 0) {
        liveExamsList.innerHTML = '<p>No exams available to start live.</p>';
        return;
    }
    exams.forEach(exam => {
        const course = courses.find(c => c.id === exam.courseId);
        const card = document.createElement('div');
        card.className = 'card flex justify-between items-center';
        card.innerHTML = `
            <div>
                <h3 class="text-xl font-semibold">${exam.name}</h3>
                <p class="text-text-secondary">Course: ${course ? course.name : 'Unknown'}</p>
                <p class="text-text-secondary">Date: ${exam.date}</p>
            </div>
            <button class="btn-primary start-live-exam-btn" data-exam-id="${exam.id}">Start Live</button>
        `;
        liveExamsList.appendChild(card);
    });
}

// Setup event listeners for live exam buttons
function setupLiveExamEvents() {
    liveExamsList.addEventListener('click', (e) => {
        if (e.target.classList.contains('start-live-exam-btn')) {
            const examId = parseInt(e.target.getAttribute('data-exam-id'));
            startLiveExam(examId);
        }
    });

    endLiveExamBtn.addEventListener('click', () => {
        endLiveExam();
    });
}

// Start live exam with timer (default 60 minutes)
function startLiveExam(examId) {
    if (currentLiveExam) {
        alert('A live exam is already in progress. Please end it before starting a new one.');
        return;
    }
    const exam = exams.find(e => e.id === examId);
    if (!exam) {
        alert('Exam not found.');
        return;
    }
    currentLiveExam = exam;
    remainingTime = 60 * 60; // 60 minutes in seconds, can be adjusted or made dynamic

    liveExamName.textContent = `${exam.name} - Live Exam`;
    timerDisplay.textContent = formatTime(remainingTime);
    liveExamTimer.classList.remove('hidden');
    liveExamsList.classList.add('hidden');

    // Start countdown timer
    timerInterval = setInterval(() => {
        remainingTime--;
        timerDisplay.textContent = formatTime(remainingTime);
        if (remainingTime <= 0) {
            endLiveExam();
            alert('Live exam time is over.');
        }
    }, 1000);
}

// End live exam
function endLiveExam() {
    if (!currentLiveExam) return;
    clearInterval(timerInterval);
    timerInterval = null;
    currentLiveExam = null;
    remainingTime = 0;

    stopCameraStream();

    liveExamTimer.classList.add('hidden');
    liveExamsList.classList.remove('hidden');
    renderLiveExams();
}

// Camera and mic monitoring for live exam
const webcamVideo = document.getElementById('webcam-video');
const faceStatus = document.getElementById('face-status');
let faceDetectionInterval = null;
let mediaStream = null;

// Load face-api.js models
async function loadFaceApiModels() {
    await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
}

// Start camera and mic, and face detection
async function startCameraAndDetection() {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        webcamVideo.srcObject = mediaStream;

        faceStatus.textContent = 'Detecting face...';

        faceDetectionInterval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(webcamVideo, new faceapi.TinyFaceDetectorOptions());
            if (detections.length === 0) {
                faceStatus.textContent = 'Face not detected! Exam will end if no face detected soon.';
                // Optionally, add a countdown before ending exam
                endLiveExam();
                alert('Face not detected. Live exam ended.');
            } else {
                faceStatus.textContent = 'Face detected. Exam in progress.';
            }
        }, 3000);
    } catch (err) {
        faceStatus.textContent = 'Camera and microphone access required.';
        alert('Please allow camera and microphone access to start the live exam.');
        endLiveExam();
    }
}

// Stop camera and face detection
function stopCameraStream() {
    if (faceDetectionInterval) {
        clearInterval(faceDetectionInterval);
        faceDetectionInterval = null;
    }
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    faceStatus.textContent = '';
}

// Function to check if Bluetooth is on by requesting a device
async function isBluetoothOn() {
    if (!navigator.bluetooth) {
        // Web Bluetooth API not supported
        return false;
    }
    try {
        // Request any Bluetooth device with a short timeout
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: []
        });
        // If device is found, Bluetooth is on
        return true;
    } catch (error) {
        // If user cancels or no device found, assume Bluetooth off or unavailable
        return false;
    }
}

// Modify startLiveExam to start camera and detection and face matching with Bluetooth check
const originalStartLiveExam = startLiveExam;
startLiveExam = async function(examId) {
    // Check if Bluetooth is on
    const bluetoothOn = await isBluetoothOn();
    if (bluetoothOn) {
        alert('Bluetooth is ON. You cannot attend the live exam while Bluetooth is enabled. Please turn off Bluetooth and try again.');
        return;
    }

    await loadFaceApiModels();
    await startCameraAndDetection();

    // Load login face descriptor from localStorage
    const storedDescriptor = localStorage.getItem('loginFaceDescriptor');
    if (!storedDescriptor) {
        alert('No login face data found. Please login again.');
        return;
    }
    const loginDescriptor = new Float32Array(JSON.parse(storedDescriptor));

    // Compare live face with login face
    const detection = await faceapi.detectSingleFace(webcamVideo, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
    if (!detection) {
        alert('Face not detected at exam start. Cannot start exam.');
        return;
    }
    const distance = faceapi.euclideanDistance(loginDescriptor, detection.descriptor);
    const threshold = 0.6; // typical threshold for face match
    if (distance > threshold) {
        alert('Face does not match login face. Cannot start exam.');
        return;
    }

    originalStartLiveExam(examId);
};

// Format seconds to MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

 // Disable copy, cut, and paste globally
 document.addEventListener('copy', (e) => {
     e.preventDefault();
     alert('Copying is disabled on this website.');
 });
 document.addEventListener('cut', (e) => {
     e.preventDefault();
     alert('Cutting is disabled on this website.');
 });
 document.addEventListener('paste', (e) => {
     e.preventDefault();
     alert('Pasting is disabled on this website.');
 });
 
 // Disable right-click context menu
 document.addEventListener('contextmenu', (e) => {
     e.preventDefault();
     alert('Right-click is disabled on this website.');
 });
 
 // Disable common keyboard shortcuts for dev tools and extensions
 document.addEventListener('keydown', (e) => {
     // F12
     if (e.key === 'F12') {
         e.preventDefault();
         alert('Opening developer tools is disabled.');
     }
     // Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+Shift+J
     if (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key.toUpperCase())) {
         e.preventDefault();
         alert('Opening developer tools is disabled.');
     }
     // Ctrl+U (view source)
     if (e.ctrlKey && e.key.toUpperCase() === 'U') {
         e.preventDefault();
         alert('Viewing source is disabled.');
     }
     // Ctrl+Shift+K (Firefox dev tools)
     if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'K') {
         e.preventDefault();
         alert('Opening developer tools is disabled.');
     }
 });
 
 // Prevent navigation to external sites (basic)
 window.addEventListener('beforeunload', (e) => {
     // You can customize this to warn or block navigation
     e.preventDefault();
     e.returnValue = '';
 });

// Flag to enable or disable the code compiler feature
const isCodeCompilerEnabled = false;

// Elements for code compiler UI
const codeCompilerTab = document.getElementById('code-compiler-tab');
const dashboardSection = document.getElementById('dashboard-section');
// Removed duplicate declarations of these variables to fix redeclaration errors
// const coursesSection = document.getElementById('courses-section');
// const examsSection = document.getElementById('exams-section');
// const studentsSection = document.getElementById('students-section');
// const liveExamsSection = document.getElementById('live-exams-section');
const coursesSectionRef = document.getElementById('courses-section');
const examsSectionRef = document.getElementById('exams-section');
const studentsSectionRef = document.getElementById('students-section');
const liveExamsSectionRef = document.getElementById('live-exams-section');

// Create code compiler section
const codeCompilerSection = document.createElement('div');
codeCompilerSection.id = 'code-compiler-section';
codeCompilerSection.className = 'section hidden p-4';

// Add HTML content for code compiler UI
codeCompilerSection.innerHTML = `
    <h2 class="text-2xl font-semibold mb-6">Code Compiler</h2>
    <div class="mb-4">
        <label for="language-select" class="block mb-2 font-medium">Select Language:</label>
        <select id="language-select" class="input-field w-48">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
        </select>
    </div>
    <div class="mb-4">
        <label for="code-input" class="block mb-2 font-medium">Enter Code:</label>
        <textarea id="code-input" class="input-field w-full h-48 font-mono" spellcheck="false"></textarea>
    </div>
    <button id="run-code-btn" class="btn-primary mb-4">Run Code</button>
    <div>
        <h3 class="font-semibold mb-2">Output:</h3>
        <pre id="code-output" class="bg-gray-100 p-4 rounded h-40 overflow-auto"></pre>
    </div>
`;

// Append code compiler section to main content
const mainContent = document.querySelector('main.flex-1');
mainContent.appendChild(codeCompilerSection);

// Show/hide sections based on tab click
codeCompilerTab.addEventListener('click', () => {
    if (!isCodeCompilerEnabled) {
        alert('Code Compiler feature is currently disabled.');
        return;
    }
    dashboardSection.classList.add('hidden');
    coursesSection.classList.add('hidden');
    examsSection.classList.add('hidden');
    studentsSection.classList.add('hidden');
    liveExamsSection.classList.add('hidden');
    codeCompilerSection.classList.remove('hidden');
    updateActiveTab(codeCompilerTab);
    updatePageTitle('Code Compiler');
});

// Helper functions to update active tab and page title
function updateActiveTab(activeTab) {
    const tabs = document.querySelectorAll('.feature-icon-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    activeTab.classList.add('active');
}

function updatePageTitle(title) {
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = title;
    }
}

// Run code button event
const runCodeBtn = document.getElementById('run-code-btn');
const codeInput = document.getElementById('code-input');
const languageSelect = document.getElementById('language-select');
const codeOutput = document.getElementById('code-output');

runCodeBtn.addEventListener('click', () => {
    const code = codeInput.value;
    const language = languageSelect.value;
    codeOutput.textContent = '';

    if (!isCodeCompilerEnabled) {
        codeOutput.textContent = 'Code Compiler feature is disabled.';
        return;
    }

    if (language === 'javascript') {
        try {
            // eslint-disable-next-line no-eval
            const result = eval(code);
            codeOutput.textContent = String(result);
        } catch (err) {
            codeOutput.textContent = 'Error: ' + err.message;
        }
    } else {
        codeOutput.textContent = `Execution for ${language} is not supported in this demo.`;
    }
});
