// Google Analytics 4 Configuration
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

// Replace GA_MEASUREMENT_ID with your actual Google Analytics 4 Measurement ID
gtag('config', 'G-XXXXXXXXXX');

// Track form submissions
document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            gtag('event', 'form_submission', {
                'form_id': this.id || 'unknown',
                'page_location': window.location.href
            });
        });
    });
});

// Track outbound links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.hostname !== window.location.hostname) {
        gtag('event', 'outbound_link', {
            'link_url': link.href,
            'link_text': link.innerText || 'unknown'
        });
    }
});

// Track scroll depth
let scrollDepthMarks = new Set();
window.addEventListener('scroll', function() {
    const winHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight;
    const scrolled = window.scrollY + winHeight;
    const scrollPercentage = Math.round((scrolled / docHeight) * 100);
    
    [25, 50, 75, 90].forEach(mark => {
        if (scrollPercentage >= mark && !scrollDepthMarks.has(mark)) {
            scrollDepthMarks.add(mark);
            gtag('event', 'scroll_depth', {
                'depth_percentage': mark,
                'page_location': window.location.pathname
            });
        }
    });
});
