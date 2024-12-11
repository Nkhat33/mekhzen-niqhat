// Book data initialization
window.books = JSON.parse(localStorage.getItem('bookstore_books')) || [
    {
        id: 1,
        title: "ሕይወት ሕብሪ ዓዲ",
        author: "የሃንስ ገብረዮርጊስ",
        price: 350.00,
        image: "./images/book1.jpg",
        stock: 10,
        category: 'fiction',
        tags: ['ልቢ-ወለድ', 'ትግራይ']
    },
    {
        id: 2,
        title: "ታሪኽ ሃገር",
        author: "ኣሰልም ተስፋይ",
        price: 420.00,
        image: "./images/book2.jpg",
        stock: 15,
        category: 'history',
        tags: ['ታሪኽ', 'ኣፍሪቃ']
    },
    {
        id: 3,
        title: "መዝገበ ቃላት",
        author: "ስለሙን ገብረእግዚኣብሄር",
        price: 280.00,
        image: "./images/book3.jpg",
        stock: 8,
        category: 'educational',
        tags: ['ትምህርታዊ', 'ቃላት']
    },
    {
        id: 4,
        title: "ፍቕሪ ሃገር",
        author: "ዳዊት መብራህቱ",
        price: 300.00,
        image: "./images/book4.jpg",
        stock: 12,
        category: 'religion',
        tags: ['ሃይማኖታዊ', 'ክርስትና']
    }
];

// Save initial books if none exist
if (!localStorage.getItem('bookstore_books')) {
    localStorage.setItem('bookstore_books', JSON.stringify(window.books));
}

// Initialize cart
window.cart = [];

// Function to display books
function displayBooks(filteredBooks = null) {
    const books = filteredBooks || JSON.parse(localStorage.getItem('bookstore_books')) || [];
    const bookGrid = document.getElementById('book-grid');
    if (!bookGrid) {
        console.error('Book grid element not found');
        return;
    }

    bookGrid.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-aos', 'fade-up');
        const tagsHtml = book.tags ? 
            `<div class="book-tags">
                ${book.tags.map(tag => 
                    `<span class="tag" onclick="addTagFilter('${tag}')">${tag}</span>`
                ).join('')}
            </div>` : '';
        bookCard.innerHTML = `
            <img src="${book.image}" alt="${book.title}" class="book-image">
            <div class="book-info">
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author">${book.author}</p>
                <p class="book-category">${getCategoryDisplay(book.category)}</p>
                ${tagsHtml}
                <p class="book-price">$${book.price.toFixed(2)}</p>
                <p class="book-stock">${book.stock} ዝተረፈ</p>
                <button class="add-to-cart-btn" onclick="addToCart(${book.id})">
                    <i class="fas fa-shopping-cart"></i> ናብ ዘንቢል ወስኽ
                </button>
            </div>
        `;
        bookGrid.appendChild(bookCard);
    });
}

// Helper function to get category display name
function getCategoryDisplay(category) {
    const categoryMap = {
        'fiction': 'ልቢ-ወለድ',
        'history': 'ታሪኽ',
        'educational': 'ትምህርታዊ',
        'religion': 'ሃይማኖታዊ',
        'children': 'ናይ ቆልዑ',
        'poetry': 'ግጥሚ'
    };
    return categoryMap[category] || category;
}

// Search functionality
function initializeSearch() {
    const searchInput = document.getElementById('book-search');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const bookGrid = document.getElementById('book-grid');
            const bookCards = bookGrid.getElementsByClassName('book-card');
            let hasVisibleCards = false;

            Array.from(bookCards).forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const author = card.querySelector('.book-author').textContent.toLowerCase();
                
                if (searchTerm === '' || title.includes(searchTerm) || author.includes(searchTerm)) {
                    card.style.display = 'flex';
                    hasVisibleCards = true;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show/hide no results message
            let noResultsMsg = bookGrid.querySelector('.no-results-message');
            if (!hasVisibleCards) {
                if (!noResultsMsg) {
                    noResultsMsg = document.createElement('div');
                    noResultsMsg.className = 'no-results-message';
                    noResultsMsg.style.textAlign = 'center';
                    noResultsMsg.style.gridColumn = '1 / -1';
                    noResultsMsg.style.padding = '2rem';
                    noResultsMsg.textContent = 'ዝኾነ መጽሓፍ ኣይተረኽበን';
                    bookGrid.appendChild(noResultsMsg);
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
        });
    }
}

// Add these variables at the top of your script
let currentCategory = '';
let activeTags = new Set();

// Add this function to filter books
function filterBooks() {
    const books = JSON.parse(localStorage.getItem('bookstore_books')) || [];
    const filteredBooks = books.filter(book => {
        const categoryMatch = !currentCategory || book.category === currentCategory;
        const tagsMatch = activeTags.size === 0 || 
            (book.tags && book.tags.some(tag => activeTags.has(tag)));
        return categoryMatch && tagsMatch;
    });
    displayBooks(filteredBooks);
}

// Add event listener for category filter
document.getElementById('categoryFilter').addEventListener('change', function(e) {
    currentCategory = e.target.value;
    filterBooks();
});

// Function to add a tag filter
function addTagFilter(tag) {
    if (!activeTags.has(tag)) {
        activeTags.add(tag);
        updateTagsDisplay();
        filterBooks();
    }
}

// Function to remove a tag filter
function removeTagFilter(tag) {
    activeTags.delete(tag);
    updateTagsDisplay();
    filterBooks();
}

// Function to update tags display
function updateTagsDisplay() {
    const tagsContainer = document.getElementById('activeTags');
    tagsContainer.innerHTML = '';
    activeTags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            ${tag}
            <span class="remove" onclick="removeTagFilter('${tag}')">&times;</span>
        `;
        tagsContainer.appendChild(tagElement);
    });
}

// Navigation functionality
function initializeNavigation() {
    const sections = {
        'videos': {
            button: document.querySelector('.videos-btn'),
            section: document.getElementById('videos-section'),
            content: [
                {
                    title: "ታሪኽ ትግራይ",
                    url: "https://www.youtube.com/embed/example1",
                    thumbnail: "./images/video1.jpg"
                },
                {
                    title: "ባህሊ ትግራይ",
                    url: "https://www.youtube.com/embed/example2",
                    thumbnail: "./images/video2.jpg"
                }
            ]
        },
        'articles': {
            button: document.querySelector('.articles-btn'),
            section: document.getElementById('articles-section'),
            content: []
        }
    };

    const booksSection = document.getElementById('books');

    // Function to show section
    function showSection(sectionType) {
        // Hide all sections first
        booksSection.style.display = 'none';
        Object.values(sections).forEach(({section}) => {
            if (section) section.style.display = 'none';
        });

        // Remove active class from all buttons
        Object.values(sections).forEach(({button}) => {
            if (button) button.classList.remove('active');
        });

        // Show selected section and activate button
        if (sectionType === 'books') {
            booksSection.style.display = 'block';
        } else {
            const selectedSection = sections[sectionType];
            if (selectedSection) {
                if (selectedSection.section) {
                    selectedSection.section.style.display = 'block';
                    // Load content if not already loaded
                    if (!selectedSection.section.hasContent) {
                        loadSectionContent(sectionType);
                        selectedSection.section.hasContent = true;
                    }
                }
                if (selectedSection.button) {
                    selectedSection.button.classList.add('active');
                }
            }
        }
    }

    // Function to load section content
    function loadSectionContent(sectionType) {
        const section = sections[sectionType];
        if (!section || !section.section) return;

        const contentGrid = section.section.querySelector(`.${sectionType}-grid`);
        if (!contentGrid) return;

        contentGrid.innerHTML = ''; // Clear existing content

        if (sectionType === 'articles') {
            const articles = [
                {
                    title: "ታሪኽ ሓጺር ዛንታ",
                    image: "./images/library-tunnel.jpg",
                    date: "12/10/2023",
                    author: "ዮሃንስ ገብረመድህን",
                    summary: "ብዛዕባ ታሪኽ ትግራይ ሓጺር መግለጺ...",
                    views: "1.2k"
                },
                {
                    title: "ባህላዊ ልምድታት",
                    image: "./images/book-pages.jpg",
                    date: "12/10/2023",
                    author: "ሳራ ተስፋይ",
                    summary: "ብዛዕባ ባህላዊ ልምድታት ትግራይ...",
                    views: "856"
                },
                {
                    title: "ሓዲሽ መጽሓፍቲ",
                    image: "./images/innovation-book.jpg",
                    date: "12/10/2023",
                    author: "ፍቕሪ መብራህቱ",
                    summary: "ብዛዕባ ሓዲሽ መጽሓፍቲ ዝወጸ...",
                    views: "543"
                },
                {
                    title: "ፍልጠት መጽሓፍቲ",
                    image: "./images/reading-light.jpg",
                    date: "12/10/2023",
                    author: "ሃይለ ተኽለ",
                    summary: "ብዛዕባ ኣንባብን ፍልጠትን...",
                    views: "721"
                }
            ];

            articles.forEach(article => {
                const articleCard = document.createElement('div');
                articleCard.className = 'article-card';
                articleCard.innerHTML = `
                    <div class="article-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>
                    <div class="article-content">
                        <h3>${article.title}</h3>
                        <div class="article-meta">
                            <span class="article-author"><i class="fas fa-user"></i> ${article.author}</span>
                            <span class="article-date"><i class="fas fa-calendar"></i> ${article.date}</span>
                            <span class="article-views"><i class="fas fa-eye"></i> ${article.views}</span>
                        </div>
                        <p class="article-summary">${article.summary}</p>
                        <button class="read-more-btn">ተወሳኺ ኣንብብ <i class="fas fa-arrow-right"></i></button>
                    </div>
                `;
                contentGrid.appendChild(articleCard);
            });
        } else if (sectionType === 'videos') {
            section.content.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `
                    <div class="video-thumbnail">
                        <img src="${video.thumbnail}" alt="${video.title}">
                        <i class="fas fa-play-circle play-icon"></i>
                    </div>
                    <h3>${video.title}</h3>
                `;
                contentGrid.appendChild(videoCard);
            });
        }
    }

    // Add click handlers to buttons
    Object.entries(sections).forEach(([type, {button}]) => {
        if (button) {
            button.addEventListener('click', () => showSection(type));
        }
    });

    // Initialize with books section
    showSection('books');
}

// Videos and Articles functionality
function initializeNavButtons() {
    const videosBtn = document.querySelector('.videos-btn');
    const articlesBtn = document.querySelector('.articles-btn');

    if (videosBtn) {
        videosBtn.addEventListener('click', function() {
            // Store current page state
            localStorage.setItem('lastSection', 'books');
            // Hide books section
            document.getElementById('books').style.display = 'none';
            // Show videos section (you'll need to create this section in HTML)
            const videosSection = document.getElementById('videos-section');
            if (videosSection) {
                videosSection.style.display = 'block';
            } else {
                console.log('Videos section not yet implemented');
            }
        });
    }

    if (articlesBtn) {
        articlesBtn.addEventListener('click', function() {
            // Store current page state
            localStorage.setItem('lastSection', 'books');
            // Hide books section
            document.getElementById('books').style.display = 'none';
            // Show articles section (you'll need to create this section in HTML)
            const articlesSection = document.getElementById('articles-section');
            if (articlesSection) {
                articlesSection.style.display = 'block';
            } else {
                console.log('Articles section not yet implemented');
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
    
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Display books immediately
    displayBooks();
    
    // Initialize cart
    initializeCart();
    
    // Initialize search
    initializeSearch();
    
    // Initialize navigation
    initializeNavigation();
    
    // Setup other event listeners
    setupEventListeners();
});

// Function to setup event listeners
function setupEventListeners() {
    // Cart
    setupCartListeners();
    
    // Login/Register Modal
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const registerLink = document.getElementById('registerLink');
    const loginLink = document.getElementById('loginLink');
    const closeBtns = document.querySelectorAll('.close');

    // Login button click
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    // Register link click
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
        registerModal.style.display = 'block';
    });

    // Login link click
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerModal.style.display = 'none';
        loginModal.style.display = 'block';
    });

    // Close buttons
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            loginModal.style.display = 'none';
            registerModal.style.display = 'none';
        });
    });

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // Here you would typically make an API call to verify credentials
        console.log('Login attempt:', { email, password });
        
        loginModal.style.display = 'none';
        showNotification('ብዓወት ኣትዮም', 'success');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            showNotification('ፓስዎርድ ተመሳሳሊ ኣይኮነን', 'error');
            return;
        }

        // Here you would typically make an API call to register the user
        console.log('Register attempt:', { name, email, password });
        
        registerModal.style.display = 'none';
        showNotification('ምዝገባ ብዓወት ተፈጺሙ', 'success');
    });
}

function setupCartListeners() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.cart-close');

    cartBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        cartSidebar.classList.add('active');
    });

    closeCart.addEventListener('click', function(e) {
        e.stopPropagation();
        cartSidebar.classList.remove('active');
    });

    // Close cart when clicking outside
    document.addEventListener('click', function(e) {
        const cartSidebar = document.querySelector('.cart-sidebar');
        const cartBtn = document.querySelector('.cart-btn');
        
        if (!cartBtn.contains(e.target) && 
            !cartSidebar.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });
}

function initializeCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartBtn = document.querySelector('.cart-btn');

    // Load saved cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        window.cart = JSON.parse(savedCart);
        updateCartDisplay();
    }

    // Cart button click handler
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            cartSidebar.classList.add('active');
        });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartBtn && 
            !cartSidebar.contains(e.target) && 
            !cartBtn.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });
}

function updateCartDisplay() {
    updateCartCount();
    displayCartItems();
    updateCartTotal();
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';

    if (!window.cart || window.cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">ዘንቢል ባዶ እዩ</p>';
        return;
    }

    window.cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn minus-btn" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Add event listeners for buttons
    cartItemsContainer.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const change = btn.classList.contains('plus-btn') ? 1 : -1;
            updateQuantity(id, change);
        });
    });

    cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
}

function addToCart(bookId) {
    const book = window.books.find(b => b.id === bookId);
    if (!book) return;

    const existingItem = window.cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.cart.push({
            ...book,
            quantity: 1
        });
    }

    displayCartItems();
    updateCartCount();
    updateCartTotal();
    saveCart();
    
    // Show cart
    const cartSidebar = document.querySelector('.cart-sidebar');
    if (cartSidebar) {
        cartSidebar.classList.add('active');
    }
    
    showNotification('መጽሓፍ ናብ ዘንቢል ወሲኹ ኣሎ', 'success');
}

function removeFromCart(bookId) {
    window.cart = window.cart.filter(item => item.id !== bookId);
    displayCartItems();
    updateCartCount();
    updateCartTotal();
    saveCart();
    showNotification('መጽሓፍ ካብ ዘንቢል ተኣልዩ ኣሎ', 'info');
}

function updateQuantity(bookId, change) {
    const item = window.cart.find(item => item.id === bookId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(bookId);
    } else {
        displayCartItems();
        updateCartCount();
        updateCartTotal();
        saveCart();
    }
}

function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    if (!cartTotal) return;

    const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `ድምር: $${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!window.cart) {
        window.cart = [];
    }

    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const cartBtn = document.querySelector('.cart-btn');

    if (cartClose) {
        cartClose.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.remove('active');
        });
    }

    if (cartBtn) {
        cartBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cartSidebar.classList.add('active');
            displayCartItems();
            updateCartTotal();
        });
    }

    // Click outside to close
    document.addEventListener('click', (e) => {
        if (cartSidebar && cartBtn && 
            !cartSidebar.contains(e.target) && 
            !cartBtn.contains(e.target) && 
            cartSidebar.classList.contains('active')) {
            cartSidebar.classList.remove('active');
        }
    });

    // Prevent clicks inside cart from closing it
    cartSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    // Load saved cart
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        try {
            window.cart = JSON.parse(savedCart);
            displayCartItems();
            updateCartCount();
            updateCartTotal();
        } catch (e) {
            console.error('Error loading cart:', e);
            window.cart = [];
        }
    }
});

function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(window.cart));
    } catch (error) {
        console.error('Error saving cart:', error);
    }
}

function showNotification(message, type = 'success') {
    // Remove any existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Trigger reflow
    notification.offsetHeight;

    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function toggleCart() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (!cartSidebar || !cartOverlay) return;
    
    if (cartSidebar.classList.contains('open')) {
        // Close cart
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        // Open cart
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create cart overlay if it doesn't exist
    if (!document.querySelector('.cart-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'cart-overlay';
        document.body.appendChild(overlay);
    }

    // Cart button click
    const cartBtns = document.querySelectorAll('.cart-btn, .cart-close');
    cartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleCart();
        });
    });

    // Cart overlay click
    const cartOverlay = document.querySelector('.cart-overlay');
    if (cartOverlay) {
        cartOverlay.addEventListener('click', toggleCart);
    }

    // Initialize cart
    initializeCart();
});

// Listen for changes in localStorage
window.addEventListener('storage', function(e) {
    if (e.key === 'bookstore_books') {
        console.log('Books updated in localStorage');
        displayBooks();
        updateCartDisplay();
    }
});

// Also listen for custom events from admin panel
window.addEventListener('booksUpdated', function() {
    console.log('Books updated from admin panel');
    displayBooks();
    updateCartDisplay();
});

// Refresh books when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayBooks();
    setupEventListeners();
    setupCartListeners();
    initializeCart();
});

// Function to toggle cart sidebar
function toggleCart(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    
    if (!cartSidebar || !cartOverlay) return;
    
    if (cartSidebar.classList.contains('open')) {
        // Close cart
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        // Open cart
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
        updateCartDisplay();
    }
}

// Function to add item to cart
function addToCart(bookId) {
    const book = window.books.find(b => b.id === bookId);
    if (!book) return;

    const existingItem = window.cart.find(item => item.id === bookId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        window.cart.push({
            id: book.id,
            title: book.title,
            price: book.price,
            image: book.image,
            quantity: 1
        });
    }

    updateCartDisplay();
    showNotification('መጽሓፍ ናብ ዘንቢል ተወሲኹ ኣሎ', 'success');
    saveCart();
}

// Function to remove item from cart
function removeFromCart(bookId) {
    window.cart = window.cart.filter(item => item.id !== bookId);
    updateCartDisplay();
    saveCart();
}

// Function to update item quantity
function updateQuantity(bookId, change) {
    const item = window.cart.find(item => item.id === bookId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(bookId);
        } else {
            updateCartDisplay();
            saveCart();
        }
    }
}

// Function to update cart display
function updateCartDisplay() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total');
    const cartCount = document.querySelector('.cart-count');

    if (!cartItems || !cartTotal || !cartCount) return;

    // Update cart count
    const totalItems = window.cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    // Update cart items
    if (window.cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">ዘንቢል ባዶ እዩ</p>';
        cartTotal.innerHTML = 'ጠቕላላ: $0.00';
        return;
    }

    cartItems.innerHTML = window.cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h3 class="cart-item-title">${item.title}</h3>
                <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button onclick="updateQuantity(${item.id}, -1)" class="quantity-btn">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="quantity-btn">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Update total
    const total = window.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerHTML = `ጠቕላላ: $${total.toFixed(2)}`;
}

// Function to save cart to localStorage
function saveCart() {
    localStorage.setItem('bookstore_cart', JSON.stringify(window.cart));
}

// Initialize cart
function initializeCart() {
    window.cart = JSON.parse(localStorage.getItem('bookstore_cart')) || [];
    updateCartDisplay();
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Cart button click
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', toggleCart);
    }

    // Cart close button
    const closeBtn = document.querySelector('.cart-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleCart);
    }

    // Initialize cart
    initializeCart();
});

// Blog display functionality
function displayBlogs() {
    console.log('Displaying blogs...');
    const articlesSection = document.querySelector('.articles-section .content-grid');
    
    if (!articlesSection) {
        console.error('Articles section not found!');
        return;
    }

    // Get blogs from localStorage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    console.log('Retrieved blogs:', blogs);

    // Clear any existing content
    articlesSection.innerHTML = '';
    
    if (blogs.length === 0) {
        articlesSection.innerHTML = '<p class="empty-message">ኣብዚ እዋን እዚ ዝተጻሕፈ ጽሑፍ የለን</p>';
        return;
    }

    // Sort blogs by date (newest first)
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    const blogsHTML = blogs.map(blog => {
        // Truncate content while preserving words
        const maxLength = 150;
        let truncatedContent = blog.content;
        if (blog.content.length > maxLength) {
            truncatedContent = blog.content.substr(0, maxLength);
            truncatedContent = truncatedContent.substr(0, Math.min(truncatedContent.length, truncatedContent.lastIndexOf(' ')));
            truncatedContent += '...';
        }

        return `
            <article class="content-card" data-blog-id="${blog.id}">
                <div class="content-thumbnail">
                    <img src="${blog.image}" alt="${blog.title}" onerror="this.src='./images/default-blog.jpg'">
                </div>
                <div class="content-text">
                    <h3>${blog.title}</h3>
                    <p class="blog-excerpt">${truncatedContent}</p>
                    <div class="content-meta">
                        <span><i class="fas fa-clock"></i> ${blog.readTime} ደቒቕ</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-user"></i> ${blog.author}</span>
                    </div>
                    <button class="read-more-btn" onclick="showFullBlog('${blog.id}')">
                        <i class="fas fa-book-open"></i> ምሉእ ጽሑፍ ኣንብብ
                    </button>
                </div>
            </article>
        `;
    }).join('');

    articlesSection.innerHTML = blogsHTML;
}

// Make sure displayBlogs is called when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, calling displayBlogs');
    displayBlogs();
});

function showFullBlog(blogId) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blog = blogs.find(b => b.id === blogId);
    if (!blog) return;

    const modal = document.getElementById('blogModal');
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Header with close button
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        closeBlogModal();
    }
    modalHeader.appendChild(closeBtn);
    modalContent.appendChild(modalHeader);

    // Image container (will stay fixed while scrolling)
    if (blog.image) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'modal-image-container';
        const img = document.createElement('img');
        img.src = blog.image;
        img.alt = blog.title;
        imageContainer.appendChild(img);
        modalContent.appendChild(imageContainer);
    }

    // Body with scrollable text content
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const textContent = document.createElement('div');
    textContent.className = 'modal-text-content';
    textContent.innerHTML = `
        <h2>${blog.title}</h2>
        <div class="blog-meta">
            <span><i class="fas fa-user"></i> ${blog.author}</span>
            <span><i class="fas fa-clock"></i> ${blog.readTime} ደቒቕ</span>
            <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
        </div>
        <div class="blog-content">
            ${blog.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
    `;
    modalBody.appendChild(textContent);
    modalContent.appendChild(modalBody);

    // Clear previous content and add new
    modal.innerHTML = '';
    modal.appendChild(modalContent);
    modal.style.display = "block";
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Function to close the blog modal
function closeBlogModal() {
    const modal = document.getElementById('blogModal');
    if (modal) {
        modal.style.display = "none";
        document.body.style.overflow = 'auto'; // Restore body scrolling
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target === modal) {
        closeBlogModal();
    }
}

// Call displayBlogs when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, calling displayBlogs');
    displayBlogs();
});

function showBlogInModal(blog) {
    const modal = document.getElementById('blogModal');
    const modalContent = document.createElement('div');
    modalContent.className = 'modal-content';

    // Header with close button
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        closeBlogModal();
    }
    modalHeader.appendChild(closeBtn);
    modalContent.appendChild(modalHeader);

    // Image container (will stay fixed while scrolling)
    if (blog.image) {
        const imageContainer = document.createElement('div');
        imageContainer.className = 'modal-image-container';
        const img = document.createElement('img');
        img.src = blog.image;
        img.alt = blog.title;
        imageContainer.appendChild(img);
        modalContent.appendChild(imageContainer);
    }

    // Body with scrollable text content
    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    
    const textContent = document.createElement('div');
    textContent.className = 'modal-text-content';
    textContent.innerHTML = `
        <h2>${blog.title}</h2>
        <p><strong>ደራሲ:</strong> ${blog.author}</p>
        <p><strong>ግዜ ንባብ:</strong> ${blog.readingTime} ደቒቕ</p>
        <div class="blog-content">${blog.content}</div>
    `;
    modalBody.appendChild(textContent);
    modalContent.appendChild(modalBody);

    // Clear previous content and add new
    modal.innerHTML = '';
    modal.appendChild(modalContent);
    modal.style.display = "block";
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('blogModal');
    if (event.target === modal) {
        closeBlogModal();
    }
}
