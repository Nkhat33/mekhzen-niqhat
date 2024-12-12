// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Initialize books display
    if (typeof displayBooks === 'function') {
        displayBooks();
    }

    // Mobile Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    if (navToggle && navLinks) {
        // Add click event to toggle button
        navToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
            const isOpen = navLinks.classList.contains('active');
            navToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInside = navLinks.contains(event.target) || navToggle.contains(event.target);
            if (!isClickInside && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });

        // Close menu when clicking a nav link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
                navToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });

        // Prevent clicks inside the menu from closing it
        navLinks.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            navToggle.classList.remove('active');
            navToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
    });

    // Initialize search if not already initialized
    if (typeof initializeSearch === 'function' && !window.searchInitialized) {
        initializeSearch();
        window.searchInitialized = true;
    }
});

// Cart functionality
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

function updateCartCount(count) {
    cartCount = count;
    if (cartCountElement) {
        cartCountElement.textContent = count;
    }
}

function toggleCart() {
    const cartDropdown = document.querySelector('.cart-dropdown');
    if (cartDropdown) {
        cartDropdown.classList.toggle('active');
    }
}

// Close cart dropdown when clicking outside
document.addEventListener('click', function(event) {
    const cartDropdown = document.querySelector('.cart-dropdown');
    const cartBtn = document.querySelector('.cart-btn');
    if (cartDropdown && cartBtn) {
        if (!cartDropdown.contains(event.target) && !cartBtn.contains(event.target)) {
            cartDropdown.classList.remove('active');
        }
    }
});
