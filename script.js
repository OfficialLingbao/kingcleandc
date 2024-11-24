document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Form validation
    function validateForm(form) {
        const name = form.querySelector('input[name="full_name"]');
        const email = form.querySelector('input[name="email"]');
        const phone = form.querySelector('input[name="phone"]');
        const message = form.querySelector('textarea[name="comments"]');
        let isValid = true;

        // Reset previous error states
        clearErrors(form);

        // Name validation
        if (!name.value.trim()) {
            showError(name, 'Name is required');
            isValid = false;
        } else if (name.value.length < 2) {
            showError(name, 'Name must be at least 2 characters');
            isValid = false;
        }

        // Email validation
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Phone validation
        if (phone && phone.value.trim()) {
            if (!isValidPhone(phone.value)) {
                showError(phone, 'Please enter a valid phone number');
                isValid = false;
            }
        }

        // Message validation
        if (message && !message.value.trim()) {
            showError(message, 'Message is required');
            isValid = false;
        }

        return isValid;
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    function isValidPhone(phone) {
        const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/;
        return re.test(String(phone));
    }

    function showError(input, message) {
        const formControl = input.parentElement;
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formControl.appendChild(errorDiv);
        input.classList.add('error');
    }

    function clearErrors(form) {
        form.querySelectorAll('.error-message').forEach(error => error.remove());
        form.querySelectorAll('.error').forEach(input => input.classList.remove('error'));
    }

    // Contact Form Handling
    function submitContactForm(event) {
        event.preventDefault();
        
        const form = event.target;
        const formData = new FormData(form);
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Simulate form submission (replace with actual form submission logic)
        setTimeout(() => {
            // Show success message
            alert('Thank you for your message! We will get back to you soon.');
            
            // Reset form
            form.reset();
            
            // Reset button
            submitButton.disabled = false;
            submitButton.innerHTML = 'Send Message';
        }, 1000);
        
        return false;
    }

    // Form submission
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm(this)) {
            // Form is valid, proceed with submission
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Send email using a service like EmailJS or your backend
            // For now, we'll use mailto as a fallback
            const subject = `New Cleaning Service Request from ${formObject.full_name}`;
            const body = `
Name: ${formObject.full_name}
Email: ${formObject.email}
Phone: ${formObject.phone}
Address: ${formObject.address}
Preferred Contact: ${formObject.contact_method}
Service: ${formObject.service}
Date: ${formObject.service_date}
Referral: ${formObject.referral}
Comments: ${formObject.comments}
            `;

            window.location.href = `mailto:info@kingofcleandc.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            // Clear form
            this.reset();
            
            // Show success message
            alert('Thank you for your request! We will contact you shortly.');
        }
    });

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.hamburger')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Floating hero elements animation
    const floatingElements = document.querySelectorAll('.clean-icon');
    
    floatingElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            element.style.transform = 'scale(1.1)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
    });

    // Newsletter configuration
    const NEWSLETTER_CONFIG = {
        MAILCHIMP_API_ENDPOINT: 'https://us14.api.mailchimp.com/3.0/lists/3b83b2a4a1/members',
        API_KEY: '8c0e46b1f2ebfb776e7d9f1217994198-us14',
    };

    // Newsletter functionality
    function initializeNewsletter() {
        const floatingNewsletter = document.getElementById('floatingNewsletter');
        const hasSeenNewsletter = localStorage.getItem('hasSeenNewsletter');
        
        // Show floating newsletter after 30 seconds if not seen before
        if (!hasSeenNewsletter) {
            setTimeout(() => {
                floatingNewsletter.classList.add('show');
            }, 30000);
        }
        
        // Initialize all newsletter forms
        document.querySelectorAll('.newsletter-form').forEach(form => {
            form.addEventListener('submit', handleNewsletterSubmit);
        });
    }

    function closeNewsletter() {
        const floatingNewsletter = document.getElementById('floatingNewsletter');
        floatingNewsletter.classList.remove('show');
        localStorage.setItem('hasSeenNewsletter', 'true');
    }

    function handleNewsletterSubmit(event) {
        const form = event.target;
        const emailInput = form.querySelector('input[type="email"]');
        const messageDiv = form.querySelector('.form-message');
        const submitButton = form.querySelector('button[type="submit"]');
        
        // Add loading state
        form.classList.add('loading');
        emailInput.disabled = true;
        submitButton.disabled = true;
        
        // Show loading message
        messageDiv.textContent = 'Subscribing...';
        messageDiv.className = 'form-message info';
        
        // The form will be submitted normally to Mailchimp
        // We just handle the UI feedback here
        setTimeout(() => {
            messageDiv.textContent = 'Thank you for subscribing!';
            messageDiv.className = 'form-message success';
            
            // Reset form state
            form.classList.remove('loading');
            emailInput.disabled = false;
            submitButton.disabled = false;
            
            // If this is the floating newsletter, close it after 2 seconds
            if (form.closest('.floating-newsletter')) {
                setTimeout(closeNewsletter, 2000);
            }
        }, 1000);
    }

    // Initialize newsletter when DOM is loaded
    initializeNewsletter();
});
