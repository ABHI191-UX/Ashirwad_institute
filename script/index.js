// index.js
// Form submission - NOW SENDS DATA TO MYSQL VIA THE BACKEND API

const API_BASE = 'http://localhost:5000/api';

async function submitInquiry(event) {
    event.preventDefault();

    const formData = {
        fullName: document.getElementById('fullName').value,
        mobile: document.getElementById('mobile').value,
        email: document.getElementById('email').value,
        course: document.getElementById('course').value,
        timing: document.getElementById('timing').value,
        message: document.getElementById('message').value
    };

    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    try {
        const response = await fetch(`${API_BASE}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (!response.ok) {
            // Server responded with an error (validation, DB error, etc.)
            throw new Error(result.error || 'Something went wrong. Please try again.');
        }

        // Real success - saved in MySQL
        document.getElementById('successMessage').classList.remove('hidden');
        document.getElementById('successMessage').scrollIntoView({ behavior: 'smooth', block: 'center' });
        document.getElementById('inquiryForm').reset();

        setTimeout(() => {
            document.getElementById('successMessage').classList.add('hidden');
        }, 5000);

        console.log('Inquiry saved to database, ID:', result.inquiryId);

    } catch (error) {
        console.error('Error submitting inquiry:', error);
        alert('Failed to submit inquiry: ' + error.message + '\nPlease check your details and try again, or contact us directly.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// Gallery lightbox
document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', function() {
        const img = this.querySelector('img');
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            cursor: pointer;
        `;

        const fullImg = document.createElement('img');
        fullImg.src = img.src;
        fullImg.style.cssText = `
            max-width: 90%;
            max-height: 90%;
            border-radius: 10px;
            box-shadow: 0 0 30px rgba(0,0,0,0.5);
        `;

        modal.appendChild(fullImg);
        modal.onclick = () => modal.remove();
        document.body.appendChild(modal);
    });
});