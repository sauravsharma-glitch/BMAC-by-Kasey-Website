// Contact Form Handler with Validation and reCAPTCHA
// Place this file in your website root directory

// Google reCAPTCHA v3 Site Key - Replace with your actual key from Google
// Get your key at: https://www.google.com/recaptcha/admin
const RECAPTCHA_SITE_KEY = 'YOUR_RECAPTCHA_SITE_KEY'; // Replace with actual key

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load reCAPTCHA script
    loadReCaptcha();
    
    // Add contact form to the page if it doesn't exist
    addContactForm();
    
    // Initialize form validation
    initializeFormValidation();
});

// Load Google reCAPTCHA script
function loadReCaptcha() {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Add contact form to the contact section
function addContactForm() {
    const contactSection = document.getElementById('contact');
    if (!contactSection) return;

    // Check if form already exists
    if (document.getElementById('secureContactForm')) return;

    const contactDetails = contactSection.querySelector('.contact-details');
    if (!contactDetails) return;

    // Create form container
    const formContainer = document.createElement('div');
    formContainer.className = 'contact-info';
    formContainer.style.marginTop = '2rem';
    formContainer.style.width = '100%';

    // Create form HTML
    formContainer.innerHTML = `
        <h3><i class="fas fa-paper-plane"></i> Send us a message</h3>
        <form id="secureContactForm" onsubmit="return submitContactForm(event)">
            <div class="form-group" style="margin-bottom: 1rem;">
                <label for="name" style="display: block; margin-bottom: 0.5rem; color: #4a3b2c;">
                    <i class="fas fa-user"></i> Name *
                </label>
                <input type="text" id="name" name="name" required 
                    pattern="[A-Za-z\\s]{2,50}" 
                    title="Name should contain only letters and spaces (2-50 characters)"
                    style="width: 100%; padding: 0.8rem; border: 2px solid #e9dacb; border-radius: 12px; font-size: 1rem;">
                <div class="error-message" id="nameError" style="color: #d9534f; font-size: 0.85rem; margin-top: 0.3rem; display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
                <label for="email" style="display: block; margin-bottom: 0.5rem; color: #4a3b2c;">
                    <i class="fas fa-envelope"></i> Email *
                </label>
                <input type="email" id="email" name="email" required 
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                    title="Enter a valid email address"
                    style="width: 100%; padding: 0.8rem; border: 2px solid #e9dacb; border-radius: 12px; font-size: 1rem;">
                <div class="error-message" id="emailError" style="color: #d9534f; font-size: 0.85rem; margin-top: 0.3rem; display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
                <label for="phone" style="display: block; margin-bottom: 0.5rem; color: #4a3b2c;">
                    <i class="fas fa-phone"></i> Phone *
                </label>
                <input type="tel" id="phone" name="phone" required 
                    pattern="[0-9]{10}" 
                    title="Enter 10-digit mobile number"
                    style="width: 100%; padding: 0.8rem; border: 2px solid #e9dacb; border-radius: 12px; font-size: 1rem;">
                <div class="error-message" id="phoneError" style="color: #d9534f; font-size: 0.85rem; margin-top: 0.3rem; display: none;"></div>
            </div>

            <div class="form-group" style="margin-bottom: 1rem;">
                <label for="message" style="display: block; margin-bottom: 0.5rem; color: #4a3b2c;">
                    <i class="fas fa-comment"></i> Message *
                </label>
                <textarea id="message" name="message" required 
                    minlength="10" maxlength="500"
                    style="width: 100%; padding: 0.8rem; border: 2px solid #e9dacb; border-radius: 12px; font-size: 1rem; min-height: 100px;"></textarea>
                <div class="error-message" id="messageError" style="color: #d9534f; font-size: 0.85rem; margin-top: 0.3rem; display: none;"></div>
            </div>

            <!-- reCAPTCHA token will be added here -->
            <input type="hidden" id="recaptchaToken" name="recaptcha_token">

            <div id="formStatus" style="margin: 1rem 0; padding: 0.8rem; border-radius: 8px; display: none;"></div>

            <button type="submit" id="submitBtn" 
                style="width: 100%; padding: 1rem; background: #b9895e; color: white; border: none; border-radius: 50px; font-weight: 700; font-size: 1.1rem; cursor: pointer; transition: 0.3s;">
                <i class="fas fa-paper-plane"></i> Send Message
            </button>
        </form>
    `;

    // Insert form after existing contact info
    contactDetails.appendChild(formContainer);
}

// Initialize form validation
function initializeFormValidation() {
    const form = document.getElementById('secureContactForm');
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            validateField(this);
        });

        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
}

// Validate individual field
function validateField(field) {
    const errorElement = document.getElementById(field.id + 'Error');
    if (!errorElement) return true;

    let isValid = true;
    let errorMessage = '';

    if (field.required && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (field.pattern) {
        const pattern = new RegExp(field.pattern);
        if (!pattern.test(field.value)) {
            isValid = false;
            errorMessage = field.title || 'Invalid format';
        }
    } else if (field.type === 'email' && field.value) {
        const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i;
        if (!emailPattern.test(field.value)) {
            isValid = false;
            errorMessage = 'Enter a valid email address';
        }
    } else if (field.id === 'phone' && field.value) {
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(field.value)) {
            isValid = false;
            errorMessage = 'Enter 10-digit mobile number';
        }
    }

    if (!isValid) {
        errorElement.textContent = errorMessage;
        errorElement.style.display = 'block';
        field.style.borderColor = '#d9534f';
    } else {
        errorElement.style.display = 'none';
        field.style.borderColor = '#e9dacb';
    }

    return isValid;
}

// Form submission handler
async function submitContactForm(event) {
    event.preventDefault();

    const form = document.getElementById('secureContactForm');
    const submitBtn = document.getElementById('submitBtn');
    const statusDiv = document.getElementById('formStatus');
    
    // Validate all fields
    let isFormValid = true;
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });

    if (!isFormValid) {
        showStatus('Please correct the errors in the form', 'error');
        return false;
    }

    // Disable submit button and show loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    statusDiv.style.display = 'none';

    try {
        // Get reCAPTCHA token
        const token = await executeRecaptcha();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim(),
            recaptcha_token: token,
            timestamp: new Date().toISOString()
        };

        // Here you would typically send this to your server
        // For demo purposes, we'll simulate a successful submission
        console.log('Form data ready to send:', formData);
        
        // Simulate API call
        await simulateApiCall(formData);

        // Show success message
        showStatus('Message sent successfully! We\'ll get back to you soon.', 'success');
        form.reset();

        // You can also redirect to WhatsApp with pre-filled message
        const whatsappMessage = encodeURIComponent(
            `Hello, I'm ${formData.name}.\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone}\n` +
            `Message: ${formData.message}`
        );
        
        // Optional: Add WhatsApp button
        showWhatsAppOption(whatsappMessage);

    } catch (error) {
        console.error('Form submission error:', error);
        showStatus('Failed to send message. Please try again or contact us via WhatsApp.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
    }

    return false;
}

// Execute reCAPTCHA
function executeRecaptcha() {
    return new Promise((resolve, reject) => {
        if (typeof grecaptcha === 'undefined') {
            reject(new Error('reCAPTCHA not loaded'));
            return;
        }

        grecaptcha.ready(async () => {
            try {
                const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'submit' });
                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    });
}

// Simulate API call (replace with actual API endpoint)
function simulateApiCall(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // In production, send to your server:
            /*
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => response.json())
            .then(result => resolve(result))
            .catch(error => reject(error));
            */
            resolve({ success: true });
        }, 1500);
    });
}

// Show status message
function showStatus(message, type) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.innerHTML = message;
    statusDiv.style.display = 'block';
    
    if (type === 'success') {
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.border = '1px solid #c3e6cb';
    } else {
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.border = '1px solid #f5c6cb';
    }
}

// Show WhatsApp option after successful submission
function showWhatsAppOption(message) {
    const form = document.getElementById('secureContactForm');
    const whatsappDiv = document.createElement('div');
    whatsappDiv.style.marginTop = '1rem';
    whatsappDiv.innerHTML = `
        <p style="text-align: center; color: #4a3b2c;">
            <i class="fab fa-whatsapp" style="color: #25D366;"></i> 
            Prefer WhatsApp? 
            <a href="https://wa.me/919897515105?text=${message}" 
               target="_blank" 
               style="color: #b9895e; font-weight: 600; text-decoration: none;">
                Click here to chat
            </a>
        </p>
    `;
    form.appendChild(whatsappDiv);
    
    // Remove after 10 seconds
    setTimeout(() => {
        if (whatsappDiv.parentNode) {
            whatsappDiv.remove();
        }
    }, 10000);
}

// Cookie consent notice
function showCookieConsent() {
    if (localStorage.getItem('cookieConsent')) return;

    const consentDiv = document.createElement('div');
    consentDiv.id = 'cookieConsent';
    consentDiv.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        max-width: 400px;
        margin: 0 auto;
        background: white;
        padding: 1.5rem;
        border-radius: 20px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        border-left: 6px solid #d4a373;
    `;

    consentDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
            <i class="fas fa-cookie-bite" style="color: #d4a373; font-size: 2rem;"></i>
            <h4 style="color: #4a3b2c; margin: 0;">Cookie Notice</h4>
        </div>
        <p style="color: #4a3b2c; margin-bottom: 1.5rem; font-size: 0.95rem;">
            We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
            <a href="privacy.html" style="color: #b9895e;">Learn more</a>
        </p>
        <div style="display: flex; gap: 1rem;">
            <button onclick="acceptCookies()" style="flex: 1; padding: 0.8rem; background: #b9895e; color: white; border: none; border-radius: 50px; cursor: pointer; font-weight: 600;">
                Accept
            </button>
            <button onclick="declineCookies()" style="flex: 1; padding: 0.8rem; background: transparent; border: 2px solid #4a3b2c; color: #4a3b2c; border-radius: 50px; cursor: pointer; font-weight: 600;">
                Decline
            </button>
        </div>
    `;

    document.body.appendChild(consentDiv);
}

// Cookie consent handlers
window.acceptCookies = function() {
    localStorage.setItem('cookieConsent', 'accepted');
    document.getElementById('cookieConsent')?.remove();
};

window.declineCookies = function() {
    localStorage.setItem('cookieConsent', 'declined');
    document.getElementById('cookieConsent')?.remove();
    // Disable non-essential cookies here
};

// Show cookie consent on load
document.addEventListener('DOMContentLoaded', showCookieConsent);