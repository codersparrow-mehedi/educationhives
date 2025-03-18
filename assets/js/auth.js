/**
 * StudyHub - SSC & HSC Educational Portal
 * Authentication JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication components
    initAuthForms();
    checkAuthStatus();
    setupLogoutHandler();
    initPasswordToggle();
    initSocialAuth();
});

/**
 * Initialize Authentication Forms
 */
function initAuthForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    
    // Login Form Handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const rememberMe = document.getElementById('rememberMe')?.checked || false;
            
            if (validateLoginForm(email, password)) {
                showLoadingState(loginForm);
                
                // In a real app, this would be an API call
                setTimeout(() => {
                    // Simulate successful login
                    loginUser(email, password, rememberMe);
                }, 1500);
            }
        });
    }
    
    // Signup Form Handler
    if (signupForm) {
        signupForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const studentClass = document.getElementById('studentClass').value;
            const agreeTerms = document.getElementById('agreeTerms')?.checked || false;
            
            if (validateSignupForm(name, email, password, confirmPassword, studentClass, agreeTerms)) {
                showLoadingState(signupForm);
                
                // In a real app, this would be an API call
                setTimeout(() => {
                    // Simulate successful registration
                    registerUser(name, email, password, studentClass);
                }, 1500);
            }
        });
    }
    
    // Forgot Password Form Handler
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const email = document.getElementById('recoveryEmail').value;
            
            if (validateEmail(email)) {
                showLoadingState(forgotPasswordForm);
                
                // In a real app, this would be an API call
                setTimeout(() => {
                    // Simulate password reset email
                    resetPassword(email);
                }, 1500);
            } else {
                showFormError(forgotPasswordForm, 'Please enter a valid email address');
            }
        });
    }
}

/**
 * Validate Login Form
 */
function validateLoginForm(email, password) {
    const loginForm = document.getElementById('loginForm');
    
    // Clear previous errors
    clearFormErrors(loginForm);
    
    // Validate email
    if (!validateEmail(email)) {
        showFormError(loginForm, 'Please enter a valid email address');
        return false;
    }
    
    // Validate password
    if (!password || password.length < 6) {
        showFormError(loginForm, 'Password must be at least 6 characters');
        return false;
    }
    
    return true;
}

/**
 * Validate Signup Form
 */
function validateSignupForm(name, email, password, confirmPassword, studentClass, agreeTerms) {
    const signupForm = document.getElementById('signupForm');
    
    // Clear previous errors
    clearFormErrors(signupForm);
    
    // Validate name
    if (!name || name.trim().length < 3) {
        showFormError(signupForm, 'Please enter your full name (at least 3 characters)');
        return false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showFormError(signupForm, 'Please enter a valid email address');
        return false;
    }
    
    // Validate password
    if (!password || password.length < 6) {
        showFormError(signupForm, 'Password must be at least 6 characters');
        return false;
    }
    
    // Check password strength
    const passwordStrength = checkPasswordStrength(password);
    if (passwordStrength === 'weak') {
        showFormError(signupForm, 'Password is too weak. Include uppercase, lowercase, numbers, and special characters');
        return false;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showFormError(signupForm, 'Passwords do not match');
        return false;
    }
    
    // Validate student class selection
    if (!studentClass) {
        showFormError(signupForm, 'Please select your class');
        return false;
    }
    
    // Validate terms agreement
    if (!agreeTerms) {
        showFormError(signupForm, 'You must agree to the Terms and Conditions');
        return false;
    }
    
    return true;
}

/**
 * Validate Email Format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Check Password Strength
 */
function checkPasswordStrength(password) {
    // Check for minimum length
    if (password.length < 6) {
        return 'weak';
    }
    
    let strength = 0;
    
    // Check for uppercase letters
    if (/[A-Z]/.test(password)) strength++;
    
    // Check for lowercase letters
    if (/[a-z]/.test(password)) strength++;
    
    // Check for numbers
    if (/[0-9]/.test(password)) strength++;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    if (strength < 3) {
        return 'weak';
    } else if (strength === 3) {
        return 'medium';
    } else {
        return 'strong';
    }
}

/**
 * Show Form Error
 */
function showFormError(form, message) {
    // Remove any existing error messages
    const existingError = form.querySelector('.auth-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Create and append error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'auth-error';
    errorDiv.textContent = message;
    
    // Insert after form header
    const formHeader = form.querySelector('.auth-header');
    if (formHeader && formHeader.nextSibling) {
        form.insertBefore(errorDiv, formHeader.nextSibling);
    } else {
        form.prepend(errorDiv);
    }
    
    // Add shake animation
    errorDiv.classList.add('shake');
    setTimeout(() => {
        errorDiv.classList.remove('shake');
    }, 500);
}

/**
 * Clear Form Errors
 */
function clearFormErrors(form) {
    const errors = form.querySelectorAll('.auth-error');
    errors.forEach(error => error.remove());
}

/**
 * Show Loading State
 */
function showLoadingState(form) {
    // Disable all inputs and buttons
    const inputs = form.querySelectorAll('input, button');
    inputs.forEach(input => {
        input.disabled = true;
    });
    
    // Change submit button text to loading
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Processing...';
    }
    
    // Add loading class to form
    form.classList.add('loading');
}

/**
 * Hide Loading State
 */
function hideLoadingState(form) {
    // Enable all inputs and buttons
    const inputs = form.querySelectorAll('input, button');
    inputs.forEach(input => {
        input.disabled = false;
    });
    
    // Restore submit button text
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.textContent = submitBtn.getAttribute('data-original-text') || 'Submit';
    }
    
    // Remove loading class
    form.classList.remove('loading');
}

/**
 * Login User
 */
function loginUser(email, password, rememberMe) {
    // In a real app, this would make an API call to authenticate the user
    
    // For demo purposes, we'll simulate a successful login
    const userData = {
        id: 'user123',
        name: 'Demo Student',
        email: email,
        class: 'SSC',
        avatar: '../assets/images/avatar.jpg',
        token: 'demo-token-' + Math.random().toString(36).substring(2)
    };
    
    // Save auth data to localStorage or sessionStorage based on "remember me"
    if (rememberMe) {
        localStorage.setItem('authUser', JSON.stringify(userData));
    } else {
        sessionStorage.setItem('authUser', JSON.stringify(userData));
    }
    
    // Redirect to dashboard
    window.location.href = '../dashboard.html';
}

/**
 * Register User
 */
function registerUser(name, email, password, studentClass) {
    // In a real app, this would make an API call to register the user
    
    // For demo purposes, we'll simulate a successful registration
    const userData = {
        id: 'user' + Math.floor(Math.random() * 1000),
        name: name,
        email: email,
        class: studentClass,
        avatar: '../assets/images/avatar.jpg',
        token: 'demo-token-' + Math.random().toString(36).substring(2)
    };
    
    // Save auth data to localStorage
    localStorage.setItem('authUser', JSON.stringify(userData));
    
    // Redirect to dashboard
    window.location.href = '../dashboard.html';
}

/**
 * Reset Password
 */
function resetPassword(email) {
    const form = document.getElementById('forgotPasswordForm');
    
    // Hide loading state
    hideLoadingState(form);
    
    // Show success message
    const successDiv = document.createElement('div');
    successDiv.className = 'auth-success';
    successDiv.innerHTML = `
        <i class="success-icon">✓</i>
        <p>Password reset instructions have been sent to <strong>${email}</strong>. Please check your email.</p>
    `;
    
    // Replace form with success message
    form.innerHTML = '';
    form.appendChild(successDiv);
    
    // Add back link
    const backLink = document.createElement('a');
    backLink.href = 'login.html';
    backLink.className = 'btn btn-outline btn-block mt-3';
    backLink.textContent = 'Back to Login';
    form.appendChild(backLink);
}

/**
 * Check Authentication Status
 */
function checkAuthStatus() {
    // Check if user is logged in
    const user = getAuthUser();
    
    // Get current page path
    const currentPath = window.location.pathname;
    
    // If on auth pages and user is logged in, redirect to dashboard
    if (user && (currentPath.includes('/login.html') || currentPath.includes('/signup.html'))) {
        window.location.href = '../dashboard.html';
        return;
    }
    
    // If on protected pages and user is not logged in, redirect to login
    const protectedPages = ['/dashboard.html', '/profile.html'];
    if (!user && protectedPages.some(page => currentPath.includes(page))) {
        window.location.href = 'auth/login.html';
        return;
    }
    
    // Update UI based on auth status
    updateAuthUI(user);
}

/**
 * Get Authenticated User
 */
function getAuthUser() {
    // Check localStorage first, then sessionStorage
    const localUser = localStorage.getItem('authUser');
    const sessionUser = sessionStorage.getItem('authUser');
    
    return localUser ? JSON.parse(localUser) : sessionUser ? JSON.parse(sessionUser) : null;
}

/**
 * Update UI Based on Auth Status
 */
function updateAuthUI(user) {
    // Update header auth buttons
    const authButtons = document.querySelector('.auth-buttons');
    const userMenuContainer = document.querySelector('.user-menu-container');
    
    if (user && authButtons && !userMenuContainer) {
        // Replace login/signup buttons with user menu
        authButtons.innerHTML = `
            <div class="user-menu-container">
                <button class="user-menu-toggle">
                    <img src="${user.avatar}" alt="${user.name}" class="user-avatar">
                    <span class="user-name">${user.name.split(' ')[0]}</span>
                    <i class="dropdown-icon">▼</i>
                </button>
                <div class="user-dropdown">
                    <a href="../dashboard.html">
                        <i class="menu-icon dashboard-icon"></i>
                        Dashboard
                    </a>
                    <a href="../profile.html">
                        <i class="menu-icon profile-icon"></i>
                        My Profile
                    </a>
                    <a href="#" id="logoutBtn">
                        <i class="menu-icon logout-icon"></i>
                        Logout
                    </a>
                </div>
            </div>
        `;
        
        // Initialize user menu toggle
        initUserMenu();
    } else if (!user && userMenuContainer) {
        // Replace user menu with login/signup buttons
        authButtons.innerHTML = `
            <a href="auth/login.html" class="btn btn-outline">Login</a>
            <a href="auth/signup.html" class="btn btn-primary">Sign Up</a>
        `;
    }
    
    // Update dashboard if on dashboard page
    const dashboardHeader = document.querySelector('.dashboard-header');
    if (user && dashboardHeader) {
        const dashboardTitle = dashboardHeader.querySelector('.dashboard-title');
        if (dashboardTitle) {
            dashboardTitle.innerHTML = `
                <img src="${user.avatar}" alt="${user.name}" class="dashboard-avatar">
                <div>
                    <h1>Welcome, ${user.name}!</h1>
                    <p>Class: ${user.class}</p>
                </div>
            `;
        }
    }
}

/**
 * Initialize User Menu
 */
function initUserMenu() {
    const userMenuToggle = document.querySelector('.user-menu-toggle');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (!userMenuToggle || !userDropdown) return;
    
    userMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        userDropdown.classList.toggle('active');
        userMenuToggle.classList.toggle('active');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!userDropdown.contains(e.target) && !userMenuToggle.contains(e.target)) {
            userDropdown.classList.remove('active');
            userMenuToggle.classList.remove('active');
        }
    });
}

/**
 * Setup Logout Handler
 */
function setupLogoutHandler() {
    // Use event delegation for logout button
    document.addEventListener('click', function(e) {
        if (e.target && e.target.id === 'logoutBtn') {
            e.preventDefault();
            logoutUser();
        }
    });
}

/**
 * Logout User
 */
function logoutUser() {
    // Clear auth data
    localStorage.removeItem('authUser');
    sessionStorage.removeItem('authUser');
    
    // Show logout message
    const logoutMessage = document.createElement('div');
    logoutMessage.className = 'logout-message';
    logoutMessage.textContent = 'Logging out...';
    document.body.appendChild(logoutMessage);
    
    // Redirect to home page after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

/**
 * Initialize Password Toggle
 */
function initPasswordToggle() {
    const passwordFields = document.querySelectorAll('.password-field');
    
    passwordFields.forEach(field => {
        const input = field.querySelector('input');
        const toggleBtn = document.createElement('button');
        toggleBtn.type = 'button';
        toggleBtn.className = 'password-toggle';
        toggleBtn.innerHTML = '<i class="eye-icon"></i>';
        toggleBtn.setAttribute('aria-label', 'Toggle password visibility');
        
        field.appendChild(toggleBtn);
        
        toggleBtn.addEventListener('click', () => {
            if (input.type === 'password') {
                input.type = 'text';
                toggleBtn.classList.add('visible');
            } else {
                input.type = 'password';
                toggleBtn.classList.remove('visible');
            }
            
            // Focus back on input
            input.focus();
        });
    });
}

/**
 * Initialize Social Authentication
 */
function initSocialAuth() {
    const socialButtons = document.querySelectorAll('.social-auth-btn');
    
    socialButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const provider = this.getAttribute('data-provider');
            
            // Show loading state
            this.classList.add('loading');
            this.innerHTML = `<span class="loading-spinner"></span> Connecting...`;
            
            // In a real app, this would redirect to OAuth provider
            // For demo, simulate successful auth after delay
            setTimeout(() => {
                socialAuthSuccess(provider);
            }, 2000);
        });
    });
}

/**
 * Handle Social Authentication Success
 */
function socialAuthSuccess(provider) {
    // In a real app, this would process the OAuth response
    
    // For demo purposes, create a mock user based on provider
    let userData;
    
    switch(provider) {
        case 'google':
            userData = {
                id: 'google123',
                name: 'Google User',
                email: 'google.user@example.com',
                class: 'SSC',
                avatar: '../assets/images/avatar.jpg',
                token: 'google-token-' + Math.random().toString(36).substring(2)
            };
            break;
        case 'facebook':
            userData = {
                id: 'facebook123',
                name: 'Facebook User',
                email: 'facebook.user@example.com',
                class: 'HSC',
                avatar: '../assets/images/avatar.jpg',
                token: 'facebook-token-' + Math.random().toString(36).substring(2)
            };
            break;
        default:
            userData = {
                id: 'social123',
                name: 'Social User',
                email: 'social.user@example.com',
                class: 'SSC',
                avatar: '../assets/images/avatar.jpg',
                token: 'social-token-' + Math.random().toString(36).substring(2)
            };
    }
    
    // Save auth data
    localStorage.setItem('authUser', JSON.stringify(userData));
    
    // Redirect to dashboard
    window.location.href = '../dashboard.html';
}

/**
 * Add CSS for Auth Components
 */
(function addAuthStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Auth Form Styles */
        .auth-error {
            background-color: rgba(244, 67, 54, 0.1);
            color: #f44336;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
            font-size: 0.9rem;
        }
        
        .auth-success {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4caf50;
            padding: 20px;
            border-radius: 4px;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .success-icon {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-color: #4caf50;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 40px;
            font-size: 20px;
            margin-bottom: 10px;
        }
        
        .loading-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: white;
            animation: spin 1s ease-in-out infinite;
            margin-right: 8px;
            vertical-align: middle;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .form-group.loading input {
            background-color: #f5f5f5;
        }
        
        /* Password Field */
        .password-field {
            position: relative;
        }
        
        .password-toggle {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px;
            color: #666;
        }
        
        .eye-icon::before {
            content: "👁️";
        }
        
        /* User Menu */
        .user-menu-container {
            position: relative;
        }
        
        .user-menu-toggle {
            display: flex;
            align-items: center;
            background: none;
            border: none;
            cursor: pointer;
            padding: 5px 10px;
            border-radius: 20px;
            transition: background-color 0.3s;
        }
        
        .user-menu-toggle:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .user-avatar {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            margin-right: 8px;
            object-fit: cover;
        }
        
        .user-name {
            margin-right: 5px;
            font-weight: 600;
        }
        
        .dropdown-icon {
            font-size: 10px;
            transition: transform 0.3s;
        }
        
        .user-menu-toggle.active .dropdown-icon {
            transform: rotate(180deg);
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            width: 200px;
            z-index: 100;
            opacity: 0;
            visibility: hidden;
            transform: translateY(10px);
            transition: all 0.3s;
        }
        
        .user-dropdown.active {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .user-dropdown a {
            display: flex;
            align-items: center;
            padding: 12px 15px;
            color: var(--text-color);
            transition: background-color 0.3s;
        }
        
        .user-dropdown a:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }
        
        .menu-icon {
            margin-right: 10px;
            width: 18px;
            height: 18px;
            opacity: 0.7;
        }
        
        /* Logout Message */
        .logout-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 1000;
            animation: fadeIn 0.3s;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* Shake Animation */
        .shake {
            animation: shake 0.5s;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        /* Social Auth Buttons */
        .social-auth {
            margin: 20px 0;
            text-align: center;
        }
        
        .social-auth-divider {
            display: flex;
            align-items: center;
            margin: 15px 0;
        }
        
        .social-auth-divider::before,
        .social-auth-divider::after {
            content: "";
            flex: 1;
            border-bottom: 1px solid #ddd;
        }
        
        .social-auth-divider span {
            padding: 0 10px;
            color: #666;
            font-size: 0.9rem;
        }
        
        .social-auth-buttons {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .social-auth-btn {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px;
            border-radius: var(--border-radius);
            border: 1px solid #ddd;
            background-color: white;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .social-auth-btn:hover {
            background-color: #f5f5f5;
        }
        
        .social-auth-btn img {
            width: 20px;
            height: 20px;
            margin-right: 8px;
        }
        
        .social-auth-btn.google {
            color: #4285F4;
        }
        
        .social-auth-btn.facebook {
            color: #3b5998;
        }
    `;
    
    document.head.appendChild(style);
})(); 

// Password visibility toggle
document.addEventListener('DOMContentLoaded', function() {
  const passwordToggles = document.querySelectorAll('.password-toggle');
  
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const passwordInput = this.parentElement.querySelector('input');
      const icon = this.querySelector('i');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });
  
  // Password strength meter
  const passwordInput = document.getElementById('signupPassword');
  if (passwordInput) {
    passwordInput.addEventListener('input', function() {
      const password = this.value;
      const strengthMeter = document.querySelector('.strength-meter');
      const strengthText = document.querySelector('.strength-text');
      const meterSections = document.querySelectorAll('.meter-section');
      
      // Reset all sections
      meterSections.forEach(section => {
        section.className = 'meter-section';
      });
      
      // Check password strength
      let strength = 0;
      
      // Length check
      if (password.length >= 8) {
        strength += 1;
      }
      
      // Uppercase check
      if (/[A-Z]/.test(password)) {
        strength += 1;
      }
      
      // Number check
      if (/[0-9]/.test(password)) {
        strength += 1;
      }
      
      // Special character check
      if (/[^A-Za-z0-9]/.test(password)) {
        strength += 1;
      }
      
      // Update meter based on strength
      if (password.length === 0) {
        strengthText.textContent = 'Password strength';
      } else if (strength === 1) {
        strengthText.textContent = 'Weak';
        meterSections[0].classList.add('weak');
      } else if (strength === 2) {
        strengthText.textContent = 'Medium';
        meterSections[0].classList.add('medium');
        meterSections[1].classList.add('medium');
      } else if (strength === 3) {
        strengthText.textContent = 'Strong';
        meterSections[0].classList.add('strong');
        meterSections[1].classList.add('strong');
        meterSections[2].classList.add('strong');
      } else if (strength === 4) {
        strengthText.textContent = 'Very Strong';
        meterSections[0].classList.add('very-strong');
        meterSections[1].classList.add('very-strong');
        meterSections[2].classList.add('very-strong');
        meterSections[3].classList.add('very-strong');
      }
    });
  }
  
  // Confirm password validation
  const confirmPasswordInput = document.getElementById('confirmPassword');
  if (confirmPasswordInput && passwordInput) {
    confirmPasswordInput.addEventListener('input', function() {
      if (this.value !== passwordInput.value) {
        this.setCustomValidity('Passwords do not match');
      } else {
        this.setCustomValidity('');
      }
    });
  }
});

// Password strength checker and form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const passwordInput = document.getElementById('password');
    const strengthMeter = document.querySelector('.strength-meter');
    const strengthText = document.querySelector('.strength-text');
    const passwordToggle = document.querySelector('.password-toggle');

    // Password toggle functionality
    if (passwordToggle) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Password strength checker
    function checkPasswordStrength(password) {
        let strength = 0;
        const patterns = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        // Calculate strength
        strength += patterns.length ? 1 : 0;
        strength += (patterns.lowercase && patterns.uppercase) ? 1 : 0;
        strength += patterns.numbers ? 1 : 0;
        strength += patterns.special ? 1 : 0;

        return {
            score: strength,
            patterns: patterns
        };
    }

    function updateStrengthMeter(result) {
        // Remove all existing classes
        strengthMeter.className = 'strength-meter';
        
        // Add appropriate class based on strength
        if (result.score === 0) {
            strengthMeter.classList.add('weak');
            strengthText.textContent = 'Weak password';
            strengthText.style.color = '#f44336';
        } else if (result.score === 1) {
            strengthMeter.classList.add('medium');
            strengthText.textContent = 'Could be stronger';
            strengthText.style.color = '#ffa726';
        } else if (result.score === 2) {
            strengthMeter.classList.add('strong');
            strengthText.textContent = 'Strong password';
            strengthText.style.color = '#66bb6a';
        } else if (result.score >= 3) {
            strengthMeter.classList.add('very-strong');
            strengthText.textContent = 'Very strong password';
            strengthText.style.color = '#43a047';
        }

        // Show requirements if password is weak
        if (result.score < 2) {
            let requirements = [];
            if (!result.patterns.length) requirements.push('at least 8 characters');
            if (!result.patterns.lowercase || !result.patterns.uppercase) requirements.push('both upper and lowercase letters');
            if (!result.patterns.numbers) requirements.push('at least one number');
            if (!result.patterns.special) requirements.push('at least one special character');
            
            if (requirements.length > 0) {
                strengthText.textContent = `Add ${requirements.join(', ')}`;
            }
        }
    }

    // Event listener for password input
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const result = checkPasswordStrength(this.value);
            updateStrengthMeter(result);
        });
    }

    // Updated Form submission handler
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const result = checkPasswordStrength(passwordInput.value);
            
            if (result.score < 2) {
                alert('Please create a stronger password before submitting.');
                return false;
            }
            
            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                password: passwordInput.value,
                studentClass: document.getElementById('studentClass').value
            };

            // Here you would typically send this data to your server
            // For now, we'll simulate a successful signup
            try {
                // Store user data in localStorage (temporary solution)
                localStorage.setItem('user', JSON.stringify(formData));
                localStorage.setItem('isLoggedIn', 'true');

                // Show success message
                alert('Signup successful! Redirecting to dashboard...');

                // Redirect to dashboard
                window.location.href = '../../pages/dashboard/index.html';
            } catch (error) {
                console.error('Signup error:', error);
                alert('An error occurred during signup. Please try again.');
            }
        });
    }

    // Social signup handlers
    const googleSignupBtn = document.querySelector('.social-btn.google');
    const facebookSignupBtn = document.querySelector('.social-btn.facebook');

    if (googleSignupBtn) {
        googleSignupBtn.addEventListener('click', function() {
            // Implement Google signup logic here
            alert('Google signup will be implemented soon!');
        });
    }

    if (facebookSignupBtn) {
        facebookSignupBtn.addEventListener('click', function() {
            // Implement Facebook signup logic here
            alert('Facebook signup will be implemented soon!');
        });
    }
});