// Blog functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    setupCategoryFilters();
    setupPagination();
    setupScrollToTop();
    setupNewsletterForm();
    trackBlogInteractions();
    setupSearch();
    setupFiltering();
});

// Blog state management
const blogState = {
    currentPage: 1,
    postsPerPage: 6,
    currentCategory: 'all',
    posts: [],
    filteredPosts: []
};

// Initialize blog
async function initializeBlog() {
    try {
        // Simulate fetching posts (replace with actual API call)
        blogState.posts = await fetchBlogPosts();
        blogState.filteredPosts = [...blogState.posts];
        renderPosts();
        updatePagination();
    } catch (error) {
        console.error('Error initializing blog:', error);
        showErrorMessage('Failed to load blog posts. Please try again later.');
    }
}

// Category filtering
function setupCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active state
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter posts
            blogState.currentCategory = category;
            blogState.currentPage = 1;
            
            blogState.filteredPosts = category === 'all' 
                ? [...blogState.posts]
                : blogState.posts.filter(post => post.category === category);
            
            renderPosts();
            updatePagination();
            
            // Track category change
            trackEvent('blog_category_change', { category });
        });
    });
}

// Pagination
function setupPagination() {
    const pagination = document.querySelector('.blog-pagination');
    
    pagination.addEventListener('click', (e) => {
        if (e.target.matches('.pagination-btn') || e.target.matches('.pagination-numbers span')) {
            const action = e.target.dataset.action;
            const currentPage = blogState.currentPage;
            const totalPages = Math.ceil(blogState.filteredPosts.length / blogState.postsPerPage);
            
            if (action === 'prev' && currentPage > 1) {
                blogState.currentPage--;
            } else if (action === 'next' && currentPage < totalPages) {
                blogState.currentPage++;
            } else if (action === 'page') {
                blogState.currentPage = parseInt(e.target.textContent);
            }
            
            renderPosts();
            updatePagination();
            scrollToTop();
            
            // Track pagination interaction
            trackEvent('blog_pagination', { page: blogState.currentPage });
        }
    });
}

// Render posts
function renderPosts() {
    const blogGrid = document.querySelector('.blog-grid');
    const start = (blogState.currentPage - 1) * blogState.postsPerPage;
    const end = start + blogState.postsPerPage;
    const postsToShow = blogState.filteredPosts.slice(start, end);
    
    blogGrid.innerHTML = postsToShow.map((post, index) => `
        <article class="blog-card ${index === 0 && blogState.currentPage === 1 ? 'featured' : ''}">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}">
                <span class="blog-category">${post.category}</span>
            </div>
            <div class="blog-card-content">
                <h2><a href="${post.url}">${post.title}</a></h2>
                <p>${post.excerpt}</p>
                <div class="blog-meta">
                    <span><i class="far fa-calendar"></i>${post.date}</span>
                    <span><i class="far fa-clock"></i>${post.readTime} min read</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Update pagination
function updatePagination() {
    const pagination = document.querySelector('.pagination-numbers');
    const totalPages = Math.ceil(blogState.filteredPosts.length / blogState.postsPerPage);
    const prevBtn = document.querySelector('[data-action="prev"]');
    const nextBtn = document.querySelector('[data-action="next"]');
    
    // Update prev/next buttons
    prevBtn.disabled = blogState.currentPage === 1;
    nextBtn.disabled = blogState.currentPage === totalPages;
    
    // Generate page numbers
    let paginationHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <span data-action="page" class="${i === blogState.currentPage ? 'active' : ''}">
                ${i}
            </span>
        `;
    }
    pagination.innerHTML = paginationHTML;
}

// Scroll to top functionality
function setupScrollToTop() {
    const scrollBtn = document.querySelector('.scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        scrollToTop();
        trackEvent('blog_scroll_to_top');
    });
}

// Newsletter configuration
const NEWSLETTER_CONFIG = {
    MAILCHIMP_API_ENDPOINT: 'https://us14.api.mailchimp.com/3.0/lists/3b83b2a4a1/members',
    API_KEY: '8c0e46b1f2ebfb776e7d9f1217994198-us14',
};

// Newsletter signup
function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showErrorMessage('Please enter a valid email address.');
            return;
        }
        
        // Disable form while processing
        setFormLoading(true);
        
        try {
            await subscribeToNewsletter(email);
            showSuccessMessage('Thank you for subscribing to our newsletter!');
            form.reset();
            trackEvent('newsletter_signup', { email });
        } catch (error) {
            console.error('Newsletter signup error:', error);
            const errorMessage = getErrorMessage(error);
            showErrorMessage(errorMessage);
        } finally {
            setFormLoading(false);
        }
    });

    // Add input validation feedback
    emailInput.addEventListener('input', () => {
        const email = emailInput.value.trim();
        const isValid = isValidEmail(email);
        emailInput.classList.toggle('is-valid', isValid);
        emailInput.classList.toggle('is-invalid', email && !isValid);
    });
}

// Helper functions for newsletter
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function setFormLoading(isLoading) {
    const form = document.querySelector('.newsletter-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const emailInput = form.querySelector('input[type="email"]');
    
    submitButton.disabled = isLoading;
    emailInput.disabled = isLoading;
    submitButton.innerHTML = isLoading 
        ? '<i class="fas fa-spinner fa-spin"></i> Subscribing...' 
        : 'Subscribe';
}

function getErrorMessage(error) {
    if (error.status === 400) {
        if (error.title === 'Member Exists') {
            return 'This email is already subscribed to our newsletter.';
        }
        return 'Invalid email address. Please check and try again.';
    }
    if (error.status === 429) {
        return 'Too many attempts. Please try again later.';
    }
    return 'Failed to subscribe. Please try again later.';
}

async function subscribeToNewsletter(email) {
    try {
        const response = await fetch(NEWSLETTER_CONFIG.MAILCHIMP_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `apikey ${NEWSLETTER_CONFIG.API_KEY}`
            },
            body: JSON.stringify({
                email_address: email,
                status: 'subscribed',
                tags: ['blog_subscriber']
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw {
                status: response.status,
                title: error.title,
                detail: error.detail
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Analytics tracking
function trackBlogInteractions() {
    // Track post clicks
    document.querySelector('.blog-grid').addEventListener('click', (e) => {
        const postLink = e.target.closest('.blog-card-content a');
        if (postLink) {
            trackEvent('blog_post_click', {
                title: postLink.textContent,
                url: postLink.href
            });
        }
    });
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', debounce(() => {
        const scrollPercent = Math.round((window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
            if (maxScroll % 25 === 0) { // Track at 25%, 50%, 75%, 100%
                trackEvent('blog_scroll_depth', { depth: maxScroll });
            }
        }
    }, 500));
}

// Search functionality
function setupSearch() {
    const searchBox = document.querySelector('.search-box');
    const blogCards = document.querySelectorAll('.blog-card');
    
    searchBox.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        blogCards.forEach(card => {
            const title = card.querySelector('h2').textContent.toLowerCase();
            const excerpt = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Filtering functionality
function setupFiltering() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const blogCards = document.querySelectorAll('.blog-card');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            filterTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            const category = this.textContent.toLowerCase();
            
            if (category === 'all') {
                blogCards.forEach(card => card.style.display = 'block');
                return;
            }

            blogCards.forEach(card => {
                const cardCategories = card.dataset.categories ? card.dataset.categories.toLowerCase().split(',') : [];
                if (cardCategories.includes(category)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Utility functions
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showSuccessMessage(message) {
    // Implement toast or notification system
    console.log('Success:', message);
}

function showErrorMessage(message) {
    // Implement toast or notification system
    console.error('Error:', message);
}

// API simulation functions (replace with actual API calls)
async function fetchBlogPosts() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock data
    return [
        {
            title: 'The Benefits of Deep Cleaning Your Home',
            date: '2023-08-15',
            excerpt: 'Discover why deep cleaning your home is essential for maintaining a healthy living environment...',
            author: 'King of Clean DC Team',
            category: 'Cleaning Tips',
            readTime: 4,
            url: '/blog/posts/benefits-deep-cleaning'
        }
        // Add more mock posts as needed
    ];
}

function trackEvent(eventName, eventData = {}) {
    // Send to Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', eventName, eventData);
    }
}
