// Simple client-side authentication logic using localStorage

// Helper to get users from localStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

// Helper to save users to localStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

let loginFaceDescriptor = null;

// Login form handling
const loginForm = document.getElementById('login-form');
if (loginForm) {
    // Setup webcam for face capture
    const loginWebcamVideo = document.getElementById('login-webcam-video');
    const captureFaceBtn = document.getElementById('capture-face-btn');
    const capturedFaceCanvas = document.getElementById('captured-face-canvas');
    const faceCaptureStatus = document.getElementById('face-capture-status');

    async function startLoginWebcam() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            loginWebcamVideo.srcObject = stream;
        } catch (err) {
            alert('Please allow camera access to capture your face.');
        }
    }

    captureFaceBtn.addEventListener('click', async () => {
        const context = capturedFaceCanvas.getContext('2d');
        capturedFaceCanvas.width = loginWebcamVideo.videoWidth;
        capturedFaceCanvas.height = loginWebcamVideo.videoHeight;
        context.drawImage(loginWebcamVideo, 0, 0, capturedFaceCanvas.width, capturedFaceCanvas.height);

        // Use face-api to detect face descriptor
        const detection = await faceapi.detectSingleFace(capturedFaceCanvas, new faceapi.TinyFaceDetectorOptions()).withFaceDescriptor();
        if (!detection) {
            faceCaptureStatus.textContent = 'No face detected. Please try again.';
            loginFaceDescriptor = null;
            return;
        }
        loginFaceDescriptor = detection.descriptor;
        faceCaptureStatus.textContent = 'Face captured successfully.';
    });

    startLoginWebcam();

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const role = document.getElementById('login-role').value;

        if (!loginFaceDescriptor) {
            alert('Please capture your face before signing in.');
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password && u.role === role);
        if (!user) {
            alert('Invalid email, password, or role.');
            return;
        }

        // Store login face descriptor for comparison during live exam
        localStorage.setItem('loginFaceDescriptor', JSON.stringify(Array.from(loginFaceDescriptor)));

        alert('Login successful!');
        // Redirect to role-based dashboard
        if (role === 'admin') {
            window.location.href = 'admin-dashboard.html';
        } else {
            window.location.href = 'index.html';
        }
    });
}

// Signin form handling
const signinForm = document.getElementById('signin-form');
if (signinForm) {
    signinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signin-email').value.trim();
        const password = document.getElementById('signin-password').value;
        const passwordConfirm = document.getElementById('signin-password-confirm').value;
        const role = document.getElementById('signin-role').value;

        if (password !== passwordConfirm) {
            alert('Passwords do not match.');
            return;
        }

        let users = getUsers();
        if (users.find(u => u.email === email)) {
            alert('Email already registered.');
            return;
        }

        users.push({ email, password, role });
        saveUsers(users);
        alert('Account created successfully! Please login.');
        window.location.href = 'login.html';
    });
}
