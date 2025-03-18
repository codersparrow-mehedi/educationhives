/**
 * StudyHub - SSC & HSC Educational Portal
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initMobileMenu();
    initTabs();
    initTestimonialSlider();
    initSubjectFilters();
    initScrollAnimations();
    initDarkModeToggle();
    
    // If on MCQ page, initialize MCQ functionality
    if (document.querySelector('.mcq-container')) {
        initMCQTest();
    }
    
    // If on dashboard page, initialize charts
    if (document.querySelector('.dashboard')) {
        initDashboardCharts();
    }
    
    // Contact Form Functionality
    const contactFormToggle = document.getElementById('contact-form-toggle');
    const contactFormPopup = document.getElementById('contact-form-popup');
    const closeForm = document.getElementById('close-form');
    const contactForm = document.getElementById('contact-form');
    
    // If elements don't exist, exit
    if (!contactFormToggle || !contactFormPopup || !closeForm || !contactForm) return;
    
    // Open contact form popup
    contactFormToggle.addEventListener('click', function() {
        contactFormPopup.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    });
    
    // Close contact form popup
    closeForm.addEventListener('click', function() {
        contactFormPopup.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close popup when clicking outside the form
    contactFormPopup.addEventListener('click', function(e) {
        if (e.target === contactFormPopup) {
            contactFormPopup.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formDataObj = {};
        formData.forEach((value, key) => {
            formDataObj[key] = value;
        });
        
        // Here you would typically send the data to your server
        // For demonstration, we'll just log it and show a success message
        console.log('Form submitted with data:', formDataObj);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check-circle">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p>Thank you! Your message has been sent successfully.</p>
        `;
        
        // Replace form with success message
        contactForm.innerHTML = '';
        contactForm.appendChild(successMessage);
        
        // Close popup after 3 seconds
        setTimeout(function() {
            contactFormPopup.classList.remove('active');
            document.body.style.overflow = '';
            
            // Reset form after popup is closed
            setTimeout(function() {
                contactForm.reset();
                contactForm.innerHTML = `
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input type="text" id="name" name="name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" name="email" required>
                    </div>
                    <div class="form-group">
                        <label for="subject">Subject</label>
                        <input type="text" id="subject" name="subject" required>
                    </div>
                    <div class="form-group">
                        <label for="message">Message</label>
                        <textarea id="message" name="message" rows="4" required></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Send Message</button>
                `;
            }, 500);
        }, 3000);
    });
    
    // Add additional CSS for success message
    const style = document.createElement('style');
    style.textContent = `
        .form-success-message {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: 20px;
        }
        
        .form-success-message svg {
            color: #4CAF50;
            width: 60px;
            height: 60px;
            margin-bottom: 20px;
        }
        
        .form-success-message p {
            color: #333;
            font-size: 18px;
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);
});

/**
 * Mobile Menu Functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (!menuToggle || !mainNav) return;
    
    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        
        // Accessibility
        const expanded = mainNav.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', expanded);
        
        // Prevent scrolling when menu is open
        document.body.style.overflow = expanded ? 'hidden' : '';
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!event.target.closest('.main-nav') && 
            !event.target.closest('.mobile-menu-toggle') && 
            mainNav.classList.contains('active')) {
            
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', false);
        }
    });
    
    // Close menu when pressing Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mainNav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
            menuToggle.setAttribute('aria-expanded', false);
        }
    });
}

/**
 * Tab Functionality
 */
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    if (!tabButtons.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            
            document.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding pane
            this.classList.add('active');
            this.setAttribute('aria-selected', 'true');
            
            const target = this.getAttribute('data-target');
            const pane = document.getElementById(target);
            
            if (pane) {
                pane.classList.add('active');
            }
        });
    });
}

/**
 * Testimonial Slider
 */
function initTestimonialSlider() {
    // Get slider elements
    const sliderContainer = document.querySelector('.testimonial-slider');
    
    // If slider doesn't exist, exit
    if (!sliderContainer) return;
    
    // Get all original testimonial cards
    const originalTestimonials = document.querySelectorAll('.testimonial-card');
    const originalTestimonialsArray = Array.from(originalTestimonials);
    
    // If no testimonials, exit
    if (!originalTestimonialsArray.length) return;
    
    // Store original testimonials in memory before we modify the DOM
    const testimonialClones = originalTestimonialsArray.map(card => card.cloneNode(true));
    
    // Determine cards per slide based on screen size
    function getCardsPerSlide() {
        if (window.innerWidth <= 768) {
            return 1; // Show only 1 card per slide on mobile
        } else if (window.innerWidth <= 992) {
            return 2; // Show 2 cards on tablets
        } else {
            return 3; // Show 3 cards on desktop
        }
    }
    
    // Function to rebuild the slider
    function buildSlider() {
        const cardsPerSlide = getCardsPerSlide();
        const slideCount = Math.ceil(testimonialClones.length / cardsPerSlide);
        
        console.log(`Building slider with ${cardsPerSlide} cards per slide, total ${slideCount} slides`);
        
        // Create slider container and slides
        const sliderWrapper = document.createElement('div');
        sliderWrapper.className = 'testimonial-slider-container';
        
        // Group testimonials into slides
        for (let i = 0; i < slideCount; i++) {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            
            // Add testimonials to this slide
            for (let j = 0; j < cardsPerSlide; j++) {
                const index = i * cardsPerSlide + j;
                if (index < testimonialClones.length) {
                    slide.appendChild(testimonialClones[index].cloneNode(true));
                }
            }
            
            sliderWrapper.appendChild(slide);
        }
        
        // Clear the original container and add our new structure
        sliderContainer.innerHTML = '';
        sliderContainer.appendChild(sliderWrapper);
        
        // Create or update dots to match our slide count
        const dotsContainer = document.querySelector('.testimonial-dots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < slideCount; i++) {
                const dot = document.createElement('span');
                dot.className = 'dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('data-index', i);
                dotsContainer.appendChild(dot);
            }
        }
        
        return {
            wrapper: sliderWrapper,
            dots: document.querySelectorAll('.testimonial-dots .dot'),
            slideCount: slideCount
        };
    }
    
    // Build initial slider
    let sliderElements = buildSlider();
    let currentIndex = 0;
    
    // Function to update slider position
    function updateSlider() {
        if (sliderElements && sliderElements.wrapper) {
            sliderElements.wrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Update active dot
            if (sliderElements.dots) {
                sliderElements.dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }
            
            console.log(`Slider updated to position ${currentIndex}`);
        }
    }
    
    // Add event listeners for dots
    function addDotListeners() {
        if (sliderElements && sliderElements.dots) {
            sliderElements.dots.forEach((dot) => {
                dot.addEventListener('click', function() {
                    const index = parseInt(this.getAttribute('data-index'));
                    if (!isNaN(index)) {
                        currentIndex = index;
                        updateSlider();
                        console.log(`Dot clicked, moving to slide ${index}`);
                    }
                });
            });
        }
    }
    
    // Add touch swipe functionality
    let touchStartX = 0;
    let touchEndX = 0;
    
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }
    
    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }
    
    function handleTouchEnd() {
        const swipeThreshold = 50; // Minimum distance for a swipe
        const swipeDistance = touchStartX - touchEndX;
        
        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                // Swipe left - next slide
                currentIndex = Math.min(currentIndex + 1, sliderElements.slideCount - 1);
                console.log(`Swiped left, moving to slide ${currentIndex}`);
            } else {
                // Swipe right - previous slide
                currentIndex = Math.max(currentIndex - 1, 0);
                console.log(`Swiped right, moving to slide ${currentIndex}`);
            }
            updateSlider();
        }
    }
    
    sliderContainer.addEventListener('touchstart', handleTouchStart, false);
    sliderContainer.addEventListener('touchmove', handleTouchMove, false);
    sliderContainer.addEventListener('touchend', handleTouchEnd, false);
    
    addDotListeners();
    
    // Auto-slide functionality with safety checks
    function startAutoSlide() {
        return setInterval(function() {
            if (sliderElements && sliderElements.slideCount) {
                currentIndex = (currentIndex + 1) % sliderElements.slideCount;
                updateSlider();
            }
        }, 5000);
    }
    
    let slideInterval = startAutoSlide();
    
    // Pause auto-slide on hover or touch
    sliderContainer.addEventListener('mouseenter', function() {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('touchstart', function() {
        clearInterval(slideInterval);
    });
    
    sliderContainer.addEventListener('mouseleave', function() {
        clearInterval(slideInterval);
        slideInterval = startAutoSlide();
    });
    
    sliderContainer.addEventListener('touchend', function() {
        setTimeout(function() {
            clearInterval(slideInterval);
            slideInterval = startAutoSlide();
        }, 1000); // Wait a second after touch before restarting
    });
    
    // Rebuild slider on window resize with debounce
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Save current index
            const savedIndex = currentIndex;
            
            // Rebuild slider
            sliderElements = buildSlider();
            
            // Restore index (capped to new max)
            currentIndex = Math.min(savedIndex, sliderElements.slideCount - 1);
            
            // Update slider and add listeners
            updateSlider();
            addDotListeners();
            
            console.log(`Slider rebuilt after resize, now at slide ${currentIndex}`);
        }, 250);
    });
    
    // Initialize slider
    updateSlider();
    console.log('Testimonial slider initialized');
}

/**
 * Subject Filters
 */
function initSubjectFilters() {
    const filterSelects = document.querySelectorAll('.filter-select');
    
    if (!filterSelects.length) return;
    
    filterSelects.forEach(select => {
        select.addEventListener('change', applyFilters);
    });
    
    function applyFilters() {
        const selectedClass = document.getElementById('class-filter')?.value || 'all';
        const selectedSubject = document.getElementById('subject-filter')?.value || 'all';
        const selectedType = document.getElementById('type-filter')?.value || 'all';
        
        const items = document.querySelectorAll('.solution-card, .cheatsheet-card');
        
        items.forEach(item => {
            const itemClass = item.getAttribute('data-class');
            const itemSubject = item.getAttribute('data-subject');
            const itemType = item.getAttribute('data-type');
            
            const classMatch = selectedClass === 'all' || itemClass === selectedClass;
            const subjectMatch = selectedSubject === 'all' || itemSubject === selectedSubject;
            const typeMatch = selectedType === 'all' || itemType === selectedType;
            
            if (classMatch && subjectMatch && typeMatch) {
                item.style.display = '';
                item.classList.add('fade-in');
                setTimeout(() => {
                    item.classList.remove('fade-in');
                }, 500);
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show message if no results
        const noResults = document.querySelector('.no-results');
        const visibleItems = document.querySelectorAll('.solution-card:not([style*="display: none"]), .cheatsheet-card:not([style*="display: none"])');
        
        if (noResults) {
            noResults.style.display = visibleItems.length ? 'none' : 'block';
        }
    }
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.feature-card, .subject-card, .solution-card, .cheatsheet-card');
    
    if (!animatedElements.length) return;
    
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

/**
 * Dark Mode Toggle
 */
function initDarkModeToggle() {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    
    if (!darkModeToggle) return;
    
    // Check for saved user preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial state
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.classList.add('dark-theme');
        darkModeToggle.classList.add('active');
    }
    
    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-theme');
        darkModeToggle.classList.toggle('active');
        
        // Save preference
        const isDark = document.documentElement.classList.contains('dark-theme');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

/**
 * MCQ Test Functionality
 */
function initMCQTest() {
    const questionContainer = document.querySelector('.question-container');
    const optionsList = document.querySelector('.options-list');
    const nextButton = document.querySelector('.btn-next');
    const prevButton = document.querySelector('.btn-prev');
    const submitButton = document.querySelector('.btn-submit');
    const questionDots = document.querySelectorAll('.question-dot');
    const timerDisplay = document.querySelector('.mcq-timer-value');
    
    if (!questionContainer || !optionsList) return;
    
    // Sample MCQ data (in a real app, this would come from an API or database)
    const mcqQuestions = [
        {
            id: 1,
            question: "What is the formula for the area of a circle?",
            options: ["A = πr²", "A = 2πr", "A = πd", "A = r²"],
            correctAnswer: 0
        },
        {
            id: 2,
            question: "Which of the following is Newton's First Law of Motion?",
            options: [
                "Force equals mass times acceleration",
                "For every action, there is an equal and opposite reaction",
                "An object at rest stays at rest, and an object in motion stays in motion unless acted upon by an external force",
                "Energy can neither be created nor destroyed"
            ],
            correctAnswer: 2
        },
        {
            id: 3,
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: 2
        },
        {
            id: 4,
            question: "Which of the following is NOT a type of chemical bond?",
            options: ["Ionic bond", "Covalent bond", "Hydrogen bond", "Quantum bond"],
            correctAnswer: 3
        },
        {
            id: 5,
            question: "What is the main function of mitochondria in a cell?",
            options: [
                "Protein synthesis",
                "Energy production",
                "Cell division",
                "Storage of genetic material"
            ],
            correctAnswer: 1
        }
    ];
    
    let currentQuestion = 0;
    let userAnswers = new Array(mcqQuestions.length).fill(null);
    let timeLeft = 300; // 5 minutes in seconds
    let timerInterval;
    
    // Initialize the test
    function initTest() {
        loadQuestion(currentQuestion);
        updateQuestionDots();
        startTimer();
        
        // Set up event listeners
        if (nextButton) {
            nextButton.addEventListener('click', goToNextQuestion);
        }
        
        if (prevButton) {
            prevButton.addEventListener('click', goToPrevQuestion);
        }
        
        if (submitButton) {
            submitButton.addEventListener('click', submitTest);
        }
        
        // Question navigation dots
        questionDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToQuestion(index);
            });
        });
    }
    
    // Load a specific question
    function loadQuestion(index) {
        const question = mcqQuestions[index];
        
        // Update question number and text
        document.querySelector('.question-number').textContent = `Question ${index + 1} of ${mcqQuestions.length}`;
        document.querySelector('.question-text').textContent = question.question;
        
        // Clear previous options
        optionsList.innerHTML = '';
        
        // Add options
        question.options.forEach((option, optionIndex) => {
            const optionItem = document.createElement('div');
            optionItem.className = 'option-item';
            optionItem.setAttribute('data-index', optionIndex);
            
            // If this option was previously selected, mark it
            if (userAnswers[index] === optionIndex) {
                optionItem.classList.add('selected');
            }
            
            optionItem.textContent = option;
            
            optionItem.addEventListener('click', () => {
                // Remove selected class from all options
                document.querySelectorAll('.option-item').forEach(item => {
                    item.classList.remove('selected');
                });
                
                // Add selected class to clicked option
                optionItem.classList.add('selected');
                
                // Save the answer
                userAnswers[index] = optionIndex;
                
                // Update question dots
                updateQuestionDots();
            });
            
            optionsList.appendChild(optionItem);
        });
        
        // Update navigation buttons
        if (prevButton) {
            prevButton.disabled = index === 0;
        }
        
        if (nextButton) {
            nextButton.textContent = index === mcqQuestions.length - 1 ? 'Review Answers' : 'Next Question';
        }
        
        // Update current question indicator
        questionDots.forEach((dot, i) => {
            dot.classList.toggle('current', i === index);
        });
    }
    
    // Go to next question
    function goToNextQuestion() {
        if (currentQuestion < mcqQuestions.length - 1) {
            currentQuestion++;
            loadQuestion(currentQuestion);
        } else {
            // Show review screen or submit
            showReviewScreen();
        }
    }
    
    // Go to previous question
    function goToPrevQuestion() {
        if (currentQuestion > 0) {
            currentQuestion--;
            loadQuestion(currentQuestion);
        }
    }
    
    // Go to specific question
    function goToQuestion(index) {
        currentQuestion = index;
        loadQuestion(currentQuestion);
    }
    
    // Update question navigation dots
    function updateQuestionDots() {
        questionDots.forEach((dot, index) => {
            dot.classList.toggle('answered', userAnswers[index] !== null);
        });
    }
    
    // Show review screen
    function showReviewScreen() {
        // In a real app, this would show a summary of answered/unanswered questions
        const unansweredCount = userAnswers.filter(answer => answer === null).length;
        
        if (unansweredCount > 0) {
            if (confirm(`You have ${unansweredCount} unanswered questions. Do you want to review them before submitting?`)) {
                // Find first unanswered question
                const firstUnanswered = userAnswers.findIndex(answer => answer === null);
                if (firstUnanswered !== -1) {
                    goToQuestion(firstUnanswered);
                }
                return;
            }
        }
        
        // If no unanswered questions or user wants to submit anyway
        submitTest();
    }
    
    // Submit the test
    function submitTest() {
        clearInterval(timerInterval);
        
        // Calculate score
        let score = 0;
        userAnswers.forEach((answer, index) => {
            if (answer === mcqQuestions[index].correctAnswer) {
                score++;
            }
        });
        
        // Show results
        questionContainer.innerHTML = `
            <div class="test-results">
                <h2>Test Completed!</h2>
                <div class="score-display">
                    <div class="score-circle">
                        <span class="score-value">${score}/${mcqQuestions.length}</span>
                    </div>
                    <p>Your Score: ${Math.round((score / mcqQuestions.length) * 100)}%</p>
                </div>
                <div class="results-actions">
                    <button class="btn btn-primary" id="view-answers">View Answers</button>
                    <a href="dashboard.html" class="btn btn-outline">Back to Dashboard</a>
                </div>
            </div>
        `;
        
        // Hide navigation
        if (nextButton) nextButton.style.display = 'none';
        if (prevButton) prevButton.style.display = 'none';
        if (submitButton) submitButton.style.display = 'none';
        
        // Add event listener for viewing answers
        document.getElementById('view-answers').addEventListener('click', showAnswers);
        
        // In a real app, send results to server
        saveTestResults(score);
    }
    
    // Show correct answers
    function showAnswers() {
        questionContainer.innerHTML = `
            <h2>Test Review</h2>
            <div class="answers-list"></div>
            <div class="review-actions">
                <a href="mcq.html" class="btn btn-primary">Take Another Test</a>
                <a href="dashboard.html" class="btn btn-outline">Back to Dashboard</a>
            </div>
        `;
        
        const answersList = document.querySelector('.answers-list');
        
        mcqQuestions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
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
                </div>
            `;
            
            answersList.appendChild(questionReview);
        });
    }
    
    // Start the timer
    function startTimer() {
        if (!timerDisplay) return;
        
        updateTimerDisplay();
        
        timerInterval = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                alert('Time is up!');
                submitTest();
            }
        }, 1000);
    }
    
    // Update timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // Add warning class when time is running low
        if (timeLeft < 60) {
            timerDisplay.classList.add('warning');
        }
    }
    
    // Save test results (in a real app, this would send data to a server)
    function saveTestResults(score) {
        console.log('Test completed with score:', score);
        // In a real app: fetch('/api/save-test-result', { method: 'POST', body: JSON.stringify({ score, answers: userAnswers }) });
        
        // For demo purposes, save to localStorage
        const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        testHistory.push({
            date: new Date().toISOString(),
            score: score,
            total: mcqQuestions.length,
            percentage: Math.round((score / mcqQuestions.length) * 100)
        });
        localStorage.setItem('testHistory', JSON.stringify(testHistory));
    }
    
    // Initialize the test
    initTest();
}

/**
 * Dashboard Charts
 */
function initDashboardCharts() {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.warn('Chart.js is not loaded. Dashboard charts will not be displayed.');
        return;
    }
    
    // Performance chart
    const performanceChart = document.getElementById('performanceChart');
    if (performanceChart) {
        // Get test history from localStorage (in a real app, this would come from the server)
        const testHistory = JSON.parse(localStorage.getItem('testHistory') || '[]');
        
        // Format data for chart
        const labels = testHistory.map((test, index) => `Test ${index + 1}`);
        const scores = testHistory.map(test => test.percentage);
        
        new Chart(performanceChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Test Scores (%)',
                    data: scores,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Score: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Subject performance chart
    const subjectChart = document.getElementById('subjectChart');
    if (subjectChart) {
        // In a real app, this data would come from the server
        const subjectData = {
            labels: ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Bangla'],
            datasets: [{
                label: 'Performance by Subject',
                data: [85, 70, 90, 65, 80, 75],
                backgroundColor: [
                    'rgba(67, 97, 238, 0.7)',
                    'rgba(58, 12, 163, 0.7)',
                    'rgba(247, 37, 133, 0.7)',
                    'rgba(76, 201, 240, 0.7)',
                    'rgba(114, 9, 183, 0.7)',
                    'rgba(247, 127, 0, 0.7)'
                ],
                borderWidth: 1
            }]
        };
        
        new Chart(subjectChart, {
            type: 'radar',
            data: subjectData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.raw}%`;
                            }
                        }
                    }
                }
            }
        });
    }
    
    // Update progress bars
    updateProgressBars();
}

/**
 * Update Progress Bars
 */
function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-percentage');
        if (percentage) {
            bar.style.width = `${percentage}%`;
        }
    });
}

/**
 * Lazy Load Images
 */
function lazyLoadImages() {
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        if (!lazyImages.length) return;
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const image = entry.target;
                    image.src = image.dataset.src;
                    imageObserver.unobserve(image);
                }
            });
        });
        
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
}

// Call lazy load function after page load
window.addEventListener('load', lazyLoadImages);

/**
 * Handle Form Submissions
 */
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            // Prevent actual form submission in this demo
            event.preventDefault();
            
            // Basic form validation
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    // Add error message if it doesn't exist
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                } else {
                    field.classList.remove('error');
                    const errorMsg = field.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
            
            if (isValid) {
                // In a real app, this would submit the form data to the server
                console.log('Form submitted:', new FormData(form));
                
                // Show success message
                const successMsg = document.createElement('div');
                successMsg.className = 'success-message';
                successMsg.textContent = 'Form submitted successfully!';
                form.appendChild(successMsg);
                
                // Redirect after login/signup (demo only)
                if (form.id === 'loginForm' || form.id === 'signupForm') {
                    setTimeout(() => {
                        window.location.href = '../dashboard.html';
                    }, 1500);
                } else {
                    // Reset form for other forms
                    setTimeout(() => {
                        form.reset();
                        successMsg.remove();
                    }, 3000);
                }
            }
        });
    });
}); 