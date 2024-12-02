// Helper functions for localStorage
function getLocalStorage(key) {
    try {
        return JSON.parse(localStorage.getItem(key)) || [];
    } catch (error) {
        console.error("Error parsing localStorage data:", error);
        return [];
    }
}

function setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Handle User Registration
document.getElementById("registerForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    const users = getLocalStorage("users");
    if (users.find(user => user.username === username)) {
        alert("Username already exists!");
        return;
    }

    users.push({ username, password, scores: [] });
    setLocalStorage("users", users);
    alert("Registration successful! You can now log in.");
    window.location.href = "login.html";
});

// Handle User Login
document.getElementById("loginForm")?.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const users = getLocalStorage("users");
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        alert("Login successful!");
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        window.location.href = "quiz.html";
    } else {
        alert("Invalid credentials!");
    }
});

// Logout Function
function logout() {
    sessionStorage.removeItem("loggedInUser");
    alert("Logged out successfully!");
    window.location.href = "login.html";
}

// Quiz Questions
const quizQuestions = [
    { question: "1.What is HTMl?", options: ["Hyper text markup language", "home town markup language", "hyperlin text markup language", "high text mask language"], correctAnswer: "Hyper text markup language" },
    { question: "What is Js?", options: ["javascript", "javasource", "justscript", "none of above"], correctAnswer: "javascript" }
];

// Display Quiz Questions
document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("quizForm")) {
        const quizForm = document.getElementById("quizForm");
        quizQuestions.forEach((q, index) => {
            const div = document.createElement("div");
            div.classList.add("question");

            const question = document.createElement("p");
            question.textContent = `${index + 1}. ${q.question}`;
            div.appendChild(question);

            q.options.forEach(option => {
                const label = document.createElement("label");
                const input = document.createElement("input");
                input.type = "radio";
                input.name = `q${index}`;
                input.value = option;
                label.appendChild(input);
                label.appendChild(document.createTextNode(option));
                div.appendChild(label);
            });

            quizForm.appendChild(div);
        });
    }
});

// Submit Quiz and Save Score
function submitQuiz() {
    const answers = document.querySelectorAll('input[type="radio"]:checked');
    let score = 0;

    answers.forEach((answer, index) => {
        if (answer.value === quizQuestions[index].correctAnswer) {
            score++;
        }
    });

    const result = document.getElementById("result");
    const scoreDisplay = document.getElementById("score");

    if (result && scoreDisplay) {
        scoreDisplay.textContent = score;
        result.style.display = "block";
    }

    const loggedInUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    if (loggedInUser) {
        loggedInUser.scores.push({quiz:"cs quiz",score });
        sessionStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

        const users = getLocalStorage("users");
        const updatedUsers = users.map(user =>
            user.username === loggedInUser.username ? loggedInUser : user
        );
        setLocalStorage("users", updatedUsers);
    }
}

// Display Admin Panel
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname.includes("admin.html")) {
        const users = getLocalStorage("users");
        const tableBody = document.getElementById("userScoresTable")?.querySelector("tbody");

        if (tableBody) {
            tableBody.innerHTML = "";
            users.forEach(user => {
                const row = document.createElement("tr");

                const usernameCell = document.createElement("td");
                usernameCell.textContent = user.username;
                row.appendChild(usernameCell);

                const scoresCell = document.createElement("td");
                scoresCell.textContent = user.scores.length
                    ? user.scores.map(score => `Quiz: ${score.quiz}, Score: ${score.score}`).join(" | ")
                    : "No scores recorded";
                row.appendChild(scoresCell);

                tableBody.appendChild(row);
            });
        } else {
            console.error("Table body element not found!");
        }
    }
});
