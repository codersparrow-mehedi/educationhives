/**
 * StudyHub - SSC & HSC Educational Portal
 * MCQ Test JavaScript file
 */

// Global variables
let currentQuestion = 0;
let userAnswers = [];
let timeLeft = 0;
let timerInterval;
let mcqQuestions = [];
let testStarted = false;
let testCompleted = false;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize MCQ components
    initMCQPage();
});

/**
 * Initialize MCQ Page
 */
function initMCQPage() {
    // Check if we're on an MCQ page
    const mcqContainer = document.querySelector('.mcq-container');
    if (!mcqContainer) return;
    
    // Initialize components based on page state
    const startTestBtn = document.getElementById('startTestBtn');
    const mcqContent = document.querySelector('.mcq-content');
    const mcqIntro = document.querySelector('.mcq-intro');
    const resultsContainer = document.querySelector('.results-container');
    
    if (startTestBtn && mcqIntro) {
        // We're on the test intro page
        initTestSelection();
        startTestBtn.addEventListener('click', startTest);
    } else if (mcqContent && !resultsContainer) {
        // We're in an active test
        loadTestData();
        initTestNavigation();
        renderQuestion();
        startTimer();
        testStarted = true;
    } else if (resultsContainer) {
        // We're on the results page
        initResultsPage();
    }
}

/**
 * Initialize Test Selection
 */
function initTestSelection() {
    const subjectSelect = document.getElementById('subjectSelect');
    const chapterSelect = document.getElementById('chapterSelect');
    const difficultySelect = document.getElementById('difficultySelect');
    const testInfoContainer = document.querySelector('.test-info');
    
    if (!subjectSelect || !chapterSelect || !difficultySelect) return;
    
    // Update available chapters when subject changes
    subjectSelect.addEventListener('change', function() {
        const subject = this.value;
        
        // Clear current options
        chapterSelect.innerHTML = '<option value="">Select Chapter</option>';
        
        // Skip if no subject selected
        if (!subject) return;
        
        // Add chapters based on selected subject
        const chapters = getChaptersForSubject(subject);
        chapters.forEach(chapter => {
            const option = document.createElement('option');
            option.value = chapter.id;
            option.textContent = chapter.name;
            chapterSelect.appendChild(option);
        });
        
        // Enable chapter select
        chapterSelect.disabled = false;
        
        // Update test info
        updateTestInfo();
    });
    
    // Update test info when chapter changes
    chapterSelect.addEventListener('change', updateTestInfo);
    
    // Update test info when difficulty changes
    difficultySelect.addEventListener('change', updateTestInfo);
    
    // Function to update test information
    function updateTestInfo() {
        const subject = subjectSelect.value;
        const chapter = chapterSelect.value;
        const difficulty = difficultySelect.value;
        
        if (!subject || !chapter || !difficulty) {
            testInfoContainer.style.display = 'none';
            return;
        }
        
        // Get test info based on selections
        const testInfo = getTestInfo(subject, chapter, difficulty);
        
        // Update UI
        testInfoContainer.style.display = 'block';
        testInfoContainer.querySelector('.question-count').textContent = testInfo.questionCount;
        testInfoContainer.querySelector('.time-limit').textContent = testInfo.timeLimit;
        testInfoContainer.querySelector('.passing-score').textContent = testInfo.passingScore;
        
        // Enable start button
        document.getElementById('startTestBtn').disabled = false;
    }
}

/**
 * Get Chapters for Subject
 */
function getChaptersForSubject(subject) {
    // In a real app, this would come from an API
    const subjectChapters = {
        'mathematics': [
            { id: 'math-1', name: 'Chapter 1: Algebra' },
            { id: 'math-2', name: 'Chapter 2: Geometry' },
            { id: 'math-3', name: 'Chapter 3: Trigonometry' },
            { id: 'math-4', name: 'Chapter 4: Calculus' }
        ],
        'physics': [
            { id: 'physics-1', name: 'Chapter 1: Mechanics' },
            { id: 'physics-2', name: 'Chapter 2: Thermodynamics' },
            { id: 'physics-3', name: 'Chapter 3: Electricity & Magnetism' },
            { id: 'physics-4', name: 'Chapter 4: Optics' }
        ],
        'chemistry': [
            { id: 'chem-1', name: 'Chapter 1: Atomic Structure' },
            { id: 'chem-2', name: 'Chapter 2: Chemical Bonding' },
            { id: 'chem-3', name: 'Chapter 3: Organic Chemistry' },
            { id: 'chem-4', name: 'Chapter 4: Periodic Table' }
        ],
        'biology': [
            { id: 'bio-1', name: 'Chapter 1: Cell Biology' },
            { id: 'bio-2', name: 'Chapter 2: Genetics' },
            { id: 'bio-3', name: 'Chapter 3: Human Physiology' },
            { id: 'bio-4', name: 'Chapter 4: Ecology' }
        ],
        'english': [
            { id: 'eng-1', name: 'Chapter 1: Grammar' },
            { id: 'eng-2', name: 'Chapter 2: Vocabulary' },
            { id: 'eng-3', name: 'Chapter 3: Reading Comprehension' },
            { id: 'eng-4', name: 'Chapter 4: Writing' }
        ],
        'bangla': [
            { id: 'ban-1', name: 'Chapter 1: Grammar' },
            { id: 'ban-2', name: 'Chapter 2: Literature' },
            { id: 'ban-3', name: 'Chapter 3: Poetry' },
            { id: 'ban-4', name: 'Chapter 4: Prose' }
        ]
    };
    
    return subjectChapters[subject] || [];
}

/**
 * Get Test Info
 */
function getTestInfo(subject, chapter, difficulty) {
    // In a real app, this would come from an API
    
    // Default values
    let questionCount = 20;
    let timeLimit = '30 minutes';
    let passingScore = '60%';
    
    // Adjust based on difficulty
    if (difficulty === 'easy') {
        questionCount = 15;
        timeLimit = '20 minutes';
        passingScore = '50%';
    } else if (difficulty === 'hard') {
        questionCount = 25;
        timeLimit = '40 minutes';
        passingScore = '70%';
    }
    
    return {
        questionCount,
        timeLimit,
        passingScore
    };
}

/**
 * Start Test
 */
function startTest() {
    const subject = document.getElementById('subjectSelect').value;
    const chapter = document.getElementById('chapterSelect').value;
    const difficulty = document.getElementById('difficultySelect').value;
    
    if (!subject || !chapter || !difficulty) {
        alert('Please select all options to start the test');
        return;
    }
    
    // In a real app, this would fetch questions from an API
    // For demo, we'll use sample questions
    mcqQuestions = generateSampleQuestions(subject, chapter, difficulty);
    
    // Initialize user answers array
    userAnswers = new Array(mcqQuestions.length).fill(null);
    
    // Set time limit based on difficulty
    if (difficulty === 'easy') {
        timeLeft = 20 * 60; // 20 minutes in seconds
    } else if (difficulty === 'medium') {
        timeLeft = 30 * 60; // 30 minutes in seconds
    } else {
        timeLeft = 40 * 60; // 40 minutes in seconds
    }
    
    // Save test data to sessionStorage
    saveTestData();
    
    // Redirect to test page
    window.location.href = 'mcq-test.html';
}

/**
 * Generate Sample Questions
 */
function generateSampleQuestions(subject, chapter, difficulty) {
    // In a real app, these would come from a database
    
    // Sample questions for Mathematics - Algebra
    if (subject === 'mathematics' && chapter === 'math-1') {
        return [
            {
                id: 1,
                question: "Solve for x: 2x + 5 = 13",
                options: ["x = 4", "x = 5", "x = 6", "x = 8"],
                correctAnswer: 0,
                explanation: "2x + 5 = 13\n2x = 13 - 5\n2x = 8\nx = 4"
            },
            {
                id: 2,
                question: "Factorize: x² - 9",
                options: ["(x + 3)(x - 3)", "(x + 9)(x - 1)", "(x - 3)²", "(x + 3)²"],
                correctAnswer: 0,
                explanation: "x² - 9 = x² - 3²\nThis is a difference of squares: a² - b² = (a + b)(a - b)\nSo x² - 9 = (x + 3)(x - 3)"
            },
            {
                id: 3,
                question: "If f(x) = 2x² - 3x + 1, what is f(2)?",
                options: ["3", "5", "7", "9"],
                correctAnswer: 1,
                explanation: "f(2) = 2(2)² - 3(2) + 1\nf(2) = 2(4) - 6 + 1\nf(2) = 8 - 6 + 1\nf(2) = 3 - 6 + 1\nf(2) = 5"
            },
            {
                id: 4,
                question: "Solve the inequality: 3x - 7 > 5",
                options: ["x > 4", "x > 3", "x > 12/3", "x > 4/3"],
                correctAnswer: 0,
                explanation: "3x - 7 > 5\n3x > 12\nx > 4"
            },
            {
                id: 5,
                question: "What is the slope of the line passing through the points (2, 3) and (4, 7)?",
                options: ["1", "2", "3", "4"],
                correctAnswer: 1,
                explanation: "Slope = (y₂ - y₁)/(x₂ - x₁) = (7 - 3)/(4 - 2) = 4/2 = 2"
            }
        ];
    }
    
    // Sample questions for Physics - Mechanics
    if (subject === 'physics' && chapter === 'physics-1') {
        return [
            {
                id: 1,
                question: "A car accelerates uniformly from rest to 20 m/s in 5 seconds. What is its acceleration?",
                options: ["2 m/s²", "4 m/s²", "5 m/s²", "10 m/s²"],
                correctAnswer: 1,
                explanation: "a = (v - u)/t = (20 - 0)/5 = 4 m/s²"
            },
            {
                id: 2,
                question: "What is the SI unit of force?",
                options: ["Watt", "Joule", "Newton", "Pascal"],
                correctAnswer: 2,
                explanation: "The SI unit of force is the Newton (N)."
            },
            {
                id: 3,
                question: "A 2 kg object is moving with a velocity of 5 m/s. What is its kinetic energy?",
                options: ["5 J", "10 J", "25 J", "50 J"],
                correctAnswer: 2,
                explanation: "Kinetic Energy = (1/2)mv² = (1/2) × 2 × 5² = (1/2) × 2 × 25 = 25 J"
            },
            {
                id: 4,
                question: "Which of the following is a vector quantity?",
                options: ["Mass", "Temperature", "Time", "Velocity"],
                correctAnswer: 3,
                explanation: "Velocity is a vector quantity because it has both magnitude and direction."
            },
            {
                id: 5,
                question: "What is the gravitational potential energy of a 5 kg object at a height of 10 m? (g = 9.8 m/s²)",
                options: ["49 J", "98 J", "490 J", "980 J"],
                correctAnswer: 2,
                explanation: "Gravitational Potential Energy = mgh = 5 × 9.8 × 10 = 490 J"
            }
        ];
    }
    
    // Default questions if specific subject/chapter not found
    return [
        {
            id: 1,
            question: "Sample Question 1",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "This is the explanation for the correct answer."
        },
        {
            id: 2,
            question: "Sample Question 2",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 1,
            explanation: "This is the explanation for the correct answer."
        },
        {
            id: 3,
            question: "Sample Question 3",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 2,
            explanation: "This is the explanation for the correct answer."
        },
        {
            id: 4,
            question: "Sample Question 4",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 3,
            explanation: "This is the explanation for the correct answer."
        },
        {
            id: 5,
            question: "Sample Question 5",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0,
            explanation: "This is the explanation for the correct answer."
        }
    ];
}

/**
 * Save Test Data
 */
function saveTestData() {
    const testData = {
        questions: mcqQuestions,
        userAnswers: userAnswers,
        currentQuestion: currentQuestion,
        timeLeft: timeLeft,
        testStarted: testStarted,
        testCompleted: testCompleted
    };
    
    sessionStorage.setItem('mcqTestData', JSON.stringify(testData));
}

/**
 * Load Test Data
 */
function loadTestData() {
    const testDataString = sessionStorage.getItem('mcqTestData');
    
    if (!testDataString) {
        // No test data found, redirect to test selection page
        window.location.href = 'mcq.html';
        return;
    }
    
    const testData = JSON.parse(testDataString);
    
    mcqQuestions = testData.questions;
    userAnswers = testData.userAnswers;
    currentQuestion = testData.currentQuestion;
    timeLeft = testData.timeLeft;
    testStarted = testData.testStarted;
    testCompleted = testData.testCompleted;
    
    // If test is already completed, redirect to results page
    if (testCompleted) {
        window.location.href = 'mcq-results.html';
    }
}

/**
 * Initialize Test Navigation
 */
function initTestNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const submitBtn = document.getElementById('submitTest');
    const questionNav = document.querySelector('.question-nav-list');
    
    // Create question navigation buttons
    if (questionNav) {
        for (let i = 0; i < mcqQuestions.length; i++) {
            const navBtn = document.createElement('button');
            navBtn.className = 'question-nav-btn';
            navBtn.textContent = i + 1;
            navBtn.setAttribute('data-question', i);
            
            navBtn.addEventListener('click', function() {
                goToQuestion(parseInt(this.getAttribute('data-question')));
            });
            
            questionNav.appendChild(navBtn);
        }
    }
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentQuestion > 0) {
                goToQuestion(currentQuestion - 1);
            }
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentQuestion < mcqQuestions.length - 1) {
                goToQuestion(currentQuestion + 1);
            }
        });
    }
    
    // Submit button
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // Check if all questions are answered
            const unanswered = userAnswers.filter(answer => answer === null).length;
            
            if (unanswered > 0) {
                const confirmSubmit = confirm(`You have ${unanswered} unanswered question(s). Are you sure you want to submit?`);
                
                if (!confirmSubmit) {
                    return;
                }
            }
            
            submitTest();
        });
    }
    
    // Update navigation state
    updateNavigation();
}

/**
 * Go to Question
 */
function goToQuestion(questionIndex) {
    if (questionIndex < 0 || questionIndex >= mcqQuestions.length) {
        return;
    }
    
    currentQuestion = questionIndex;
    renderQuestion();
    updateNavigation();
    saveTestData();
}

/**
 * Render Current Question
 */
function renderQuestion() {
    const questionContainer = document.querySelector('.question-container');
    const questionNumber = document.querySelector('.question-number');
    const questionText = document.querySelector('.question-text');
    const optionsContainer = document.querySelector('.options-container');
    
    if (!questionContainer || !questionText || !optionsContainer) return;
    
    const question = mcqQuestions[currentQuestion];
    
    // Update question number
    if (questionNumber) {
        questionNumber.textContent = `Question ${currentQuestion + 1} of ${mcqQuestions.length}`;
    }
    
    // Update question text
    questionText.textContent = question.question;
    
    // Clear options
    optionsContainer.innerHTML = '';
    
    // Add options
    question.options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        
        // Check if this option is selected
        if (userAnswers[currentQuestion] === index) {
            optionItem.classList.add('selected');
        }
        
        optionItem.innerHTML = `
            <input type="radio" name="question-option" id="option-${index}" value="${index}" ${userAnswers[currentQuestion] === index ? 'checked' : ''}>
            <label for="option-${index}">${option}</label>
        `;
        
        optionItem.addEventListener('click', function() {
            selectOption(index);
        });
        
        optionsContainer.appendChild(optionItem);
    });
}

/**
 * Select Option
 */
function selectOption(optionIndex) {
    userAnswers[currentQuestion] = optionIndex;
    
    // Update UI
    const options = document.querySelectorAll('.option-item');
    options.forEach((option, index) => {
        if (index === optionIndex) {
            option.classList.add('selected');
            option.querySelector('input').checked = true;
        } else {
            option.classList.remove('selected');
            option.querySelector('input').checked = false;
        }
    });
    
    // Update navigation
    updateNavigation();
    
    // Save test data
    saveTestData();
}

/**
 * Update Navigation
 */
function updateNavigation() {
    const prevBtn = document.getElementById('prevQuestion');
    const nextBtn = document.getElementById('nextQuestion');
    const navBtns = document.querySelectorAll('.question-nav-btn');
    
    // Update navigation buttons
    if (prevBtn) {
        prevBtn.disabled = currentQuestion === 0;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentQuestion === mcqQuestions.length - 1;
    }
    
    // Update question navigation
    navBtns.forEach((btn, index) => {
        btn.classList.remove('active', 'answered');
        
        if (index === currentQuestion) {
            btn.classList.add('active');
        }
        
        if (userAnswers[index] !== null) {
            btn.classList.add('answered');
        }
    });
}

/**
 * Start Timer
 */
function startTimer() {
    updateTimerDisplay();
    
    timerInterval = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        
        // Save test data every minute
        if (timeLeft % 60 === 0) {
            saveTestData();
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert('Time is up!');
            submitTest();
        }
    }, 1000);
}

/**
 * Update Timer Display
 */
function updateTimerDisplay() {
    const timerDisplay = document.querySelector('.mcq-timer-value');
    
    if (!timerDisplay) return;
    
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    
    // Add warning class when time is running low
    if (timeLeft < 60) {
        timerDisplay.classList.add('warning');
    }
}

/**
 * Submit Test
 */
function submitTest() {
    // Clear timer
    clearInterval(timerInterval);
    
    // Calculate score
    const score = calculateScore();
    
    // Save results
    saveTestResults(score);
    
    // Clear test data
    sessionStorage.removeItem('mcqTestData');
    
    // Redirect to results page
    window.location.href = 'mcq-results.html';
}

/**
 * Calculate Score
 */
function calculateScore() {
    let correctCount = 0;
    
    userAnswers.forEach((answer, index) => {
        if (answer === mcqQuestions[index].correctAnswer) {
            correctCount++;
        }
    });
    
    return {
        correct: correctCount,
        total: mcqQuestions.length,
        percentage: Math.round((correctCount / mcqQuestions.length) * 100)
    };
}

/**
 * Save Test Results
 */
function saveTestResults(score) {
    const results = {
        score: score,
        questions: mcqQuestions,
        userAnswers: userAnswers,
        date: new Date().toISOString()
    };
    
    // Save to sessionStorage for immediate access
    sessionStorage.setItem('mcqTestResults', JSON.stringify(results));
    
    // Save to localStorage for history
    const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
    testHistory.push({
        date: results.date,
        subject: mcqQuestions[0]?.subject || 'General',
        score: score.correct,
        total: score.total,
        percentage: score.percentage
    });
    
    localStorage.setItem('testHistory', JSON.stringify(testHistory));
}

/**
 * Initialize Results Page
 */
function initResultsPage() {
    const resultsContainer = document.querySelector('.results-container');
    
    if (!resultsContainer) return;
    
    // Get test results
    const resultsString = sessionStorage.getItem('mcqTestResults');
    
    if (!resultsString) {
        // No results found, redirect to test selection page
        window.location.href = 'mcq.html';
        return;
    }
    
    const results = JSON.parse(resultsString);
    
    // Update score display
    const scoreDisplay = document.querySelector('.score-value');
    const percentageDisplay = document.querySelector('.percentage-value');
    const resultMessage = document.querySelector('.result-message');
    
    if (scoreDisplay) {
        scoreDisplay.textContent = `${results.score.correct}/${results.score.total}`;
    }
    
    if (percentageDisplay) {
        percentageDisplay.textContent = `${results.score.percentage}%`;
    }
    
    if (resultMessage) {
        if (results.score.percentage >= 80) {
            resultMessage.textContent = 'Excellent! You have a strong understanding of this topic.';
            resultMessage.className = 'result-message excellent';
        } else if (results.score.percentage >= 60) {
            resultMessage.textContent = 'Good job! You have a good grasp of this topic.';
            resultMessage.className = 'result-message good';
        } else if (results.score.percentage >= 40) {
            resultMessage.textContent = 'You passed, but there\'s room for improvement.';
            resultMessage.className = 'result-message average';
        } else {
            resultMessage.textContent = 'You need more practice on this topic.';
            resultMessage.className = 'result-message poor';
        }
    }
    
    // Render answers review
    renderAnswersReview(results);
}

/**
 * Render Answers Review
 */
function renderAnswersReview(results) {
    const answersContainer = document.querySelector('.answers-list');
    
    if (!answersContainer) return;
    
    results.questions.forEach((question, index) => {
        const userAnswer = results.userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        const questionReview = document.createElement('div');
        questionReview.className = `question-review ${isCorrect ? 'correct' : 'incorrect'}`;
        
        questionReview.innerHTML = `
            <h3>Question ${index + 1}</h3>
            <p class="review-question">${question.question}</p>
            <div class="review-options">
                ${question.options.map((option, i) => `
                    <div class="review-option ${i === question.correctAnswer ? 'correct-answer' : ''} ${i === userAnswer ? 'user-answer' : ''}">
                        ${option}
                        ${i === question.correctAnswer ? '<span class="correct-mark">✓</span>' : ''}
                        ${i === userAnswer && i !== question.correctAnswer ? '<span class="incorrect-mark">✗</span>' : ''}
                    </div>
                `).join('')}
            </div>
            <div class="review-explanation">
                ${isCorrect ? 
                    '<p class="correct-text">Correct! Well done.</p>' : 
                    `<p class="incorrect-text">Incorrect. The correct answer is: ${question.options[question.correctAnswer]}</p>`
                }
                ${question.explanation ? `<p class="explanation-text"><strong>Explanation:</strong> ${question.explanation}</p>` : ''}
            </div>
        `;
        
        answersContainer.appendChild(questionReview);
    });
}

/**
 * Add CSS for MCQ Components
 */
(function addMCQStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* MCQ Timer Styles */
        .mcq-timer.warning .mcq-timer-value {
            color: #f44336;
            animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        /* Review Styles */
        .question-review {
            margin-bottom: 30px;
            padding: 20px;
            border-radius: var(--border-radius);
            background-color: #f9f9f9;
        }
        
        .question-review.correct {
            border-left: 4px solid #4caf50;
        }
        
        .question-review.incorrect {
            border-left: 4px solid #f44336;
        }
        
        .review-question {
            font-size: 1.1rem;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .review-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 15px;
        }
        
        .review-option {
            padding: 10px 15px;
            border-radius: var(--border-radius);
            background-color: #fff;
            border: 1px solid #ddd;
            position: relative;
        }
        
        .review-option.correct-answer {
            border-color: #4caf50;
            background-color: rgba(76, 175, 80, 0.1);
        }
        
        .review-option.user-answer:not(.correct-answer) {
            border-color: #f44336;
            background-color: rgba(244, 67, 54, 0.1);
        }
        
        .correct-mark, .incorrect-mark {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            font-weight: bold;
        }
        
        .correct-mark {
            color: #4caf50;
        }
        
        .incorrect-mark {
            color: #f44336;
        }
        
        .review-explanation {
            margin-top: 15px;
            padding: 15px;
            background-color: #fff;
            border-radius: var(--border-radius);
            border: 1px solid #ddd;
        }
        
        .correct-text {
            color: #4caf50;
            font-weight: 600;
        }
        
        .incorrect-text {
            color: #f44336;
            font-weight: 600;
        }
        
        .explanation-text {
            margin-top: 10px;
            white-space: pre-line;
        }
        
        /* Result Message Styles */
                .result-message {
            padding: 15px;
            border-radius: var(--border-radius);
            margin-bottom: 20px;
            font-weight: 600;
            text-align: center;
        }
        
        .result-message.excellent {
            background-color: rgba(76, 175, 80, 0.1);
            color: #2e7d32;
            border: 1px solid #2e7d32;
        }
        
        .result-message.good {
            background-color: rgba(33, 150, 243, 0.1);
            color: #1565c0;
            border: 1px solid #1565c0;
        }
        
        .result-message.average {
            background-color: rgba(255, 152, 0, 0.1);
            color: #ef6c00;
            border: 1px solid #ef6c00;
        }
        
        .result-message.poor {
            background-color: rgba(244, 67, 54, 0.1);
            color: #c62828;
            border: 1px solid #c62828;
        }
        
        /* Score Display Styles */
        .score-display {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }
        
        .score-card {
            text-align: center;
            padding: 20px;
            background-color: #fff;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            margin: 0 15px;
            min-width: 150px;
        }
        
        .score-label {
            font-size: 0.9rem;
            color: var(--text-light);
            margin-bottom: 10px;
        }
        
        .score-value, .percentage-value {
            font-size: 2rem;
            font-weight: 700;
            color: var(--primary-color);
        }
        
        /* Question Navigation Styles */
        .question-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }
        
        .question-nav-item {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
        }
        
        .question-nav-item:hover {
            background-color: #e0e0e0;
        }
        
        .question-nav-item.current {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
        }
        
        .question-nav-item.answered {
            background-color: rgba(76, 175, 80, 0.2);
            border-color: #4caf50;
        }
        
        .question-nav-item.flagged {
            position: relative;
        }
        
        .question-nav-item.flagged::after {
            content: "⚑";
            position: absolute;
            top: -5px;
            right: -5px;
            font-size: 10px;
            color: #f44336;
        }
        
        /* MCQ Option Styles */
        .option-item {
            position: relative;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: var(--border-radius);
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .option-item:hover {
            background-color: #f9f9f9;
        }
        
        .option-item.selected {
            border-color: var(--primary-color);
            background-color: rgba(67, 97, 238, 0.05);
        }
        
        .option-item input[type="radio"] {
            position: absolute;
            opacity: 0;
        }
        
        .option-item label {
            display: flex;
            align-items: center;
            cursor: pointer;
            width: 100%;
        }
        
        .option-marker {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid #ddd;
            margin-right: 15px;
            transition: all 0.2s;
        }
        
        .option-item.selected .option-marker {
            border-color: var(--primary-color);
            background-color: var(--primary-color);
        }
        
        .option-item.selected .option-marker::after {
            content: "";
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: white;
        }
        
        .option-text {
            flex: 1;
        }
        
        /* MCQ Actions Styles */
        .mcq-actions {
            display: flex;
            justify-content: space-between;
            margin-top: 30px;
        }
        
        .flag-btn {
            display: flex;
            align-items: center;
            background: none;
            border: none;
            color: var(--text-light);
            cursor: pointer;
            padding: 8px 12px;
            border-radius: var(--border-radius);
            transition: all 0.2s;
        }
        
        .flag-btn:hover {
            background-color: #f5f5f5;
        }
        
        .flag-btn.flagged {
            color: #f44336;
        }
        
        .flag-btn svg {
            margin-right: 5px;
            width: 16px;
            height: 16px;
        }
        
        .nav-buttons {
            display: flex;
            gap: 10px;
        }
    `;
    
    document.head.appendChild(style);
})();