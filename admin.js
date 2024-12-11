// Get books from localStorage or initialize empty array
let books = JSON.parse(localStorage.getItem('bookstore_books')) || [];

// DOM Elements
const addBookForm = document.getElementById('addBookForm');
const bookList = document.getElementById('bookList');
const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const tagsInput = document.getElementById('tags');

// Initialize image upload functionality
function initializeImageUpload() {
    // Click to upload
    imagePreview.addEventListener('click', () => {
        imageUpload.click();
    });

    // Drag and drop functionality
    imagePreview.addEventListener('dragover', (e) => {
        e.preventDefault();
        imagePreview.classList.add('dragover');
    });

    imagePreview.addEventListener('dragleave', () => {
        imagePreview.classList.remove('dragover');
    });

    imagePreview.addEventListener('drop', (e) => {
        e.preventDefault();
        imagePreview.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                if (file.size <= 5 * 1024 * 1024) { // 5MB limit
                    imageUpload.files = files;
                    handleImageUpload(file);
                } else {
                    showNotification('ምስሊ ካብ 5MB ክዓቢ የብሉን።', 'error');
                }
            } else {
                showNotification('በጃኻ ናይ ምስሊ ፋይል ጥራይ ምረጽ።', 'error');
            }
        }
    });

    // File input change
    imageUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size <= 5 * 1024 * 1024) { // 5MB limit
                handleImageUpload(file);
            } else {
                showNotification('ምስሊ ካብ 5MB ክዓቢ የብሉን።', 'error');
                imageUpload.value = ''; // Clear the input
            }
        }
    });
}

// Handle image upload
function handleImageUpload(file) {
    const imagePreview = document.getElementById('imagePreview');
    const reader = new FileReader();

    reader.onload = (e) => {
        imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        imagePreview.classList.add('has-image');
    };

    reader.onerror = () => {
        showNotification('ጌጋ ኣብ ምንባብ ምስሊ።', 'error');
    };

    reader.readAsDataURL(file);
}

// Add Book Form Submit Handler
addBookForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const imageFile = imageUpload.files[0];
    if (!imageFile) {
        showNotification('በጃኻ ምስሊ ናይቲ መጽሓፍ ምረጽ።', 'error');
        return;
    }

    // Validate form fields
    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const price = parseFloat(document.getElementById('price').value);
    const stock = parseInt(document.getElementById('stock').value);
    const rating = parseFloat(document.getElementById('rating').value);
    const category = document.getElementById('category').value;
    const tags = tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const description = document.getElementById('description').value.trim();

    if (!title || !author || isNaN(price) || isNaN(stock) || !category) {
        showNotification('በጃኻ ኩሎም ዝድለዩ ሓበሬታታት ምላእ።', 'error');
        return;
    }

    if (price <= 0 || stock < 0) {
        showNotification('ዋጋን ብዝሒን ቅኑዕ ክኸውን ኣለዎ።', 'error');
        return;
    }

    try {
        const imageUrl = await readFileAsDataURL(imageFile);
        const newBook = {
            id: Date.now(),
            title,
            author,
            price,
            stock,
            rating,
            category,
            tags,
            description,
            image: imageUrl
        };

        books.push(newBook);
        saveBooks();
        displayBooks();
        addBookForm.reset();
        imagePreview.innerHTML = '<i class="fas fa-cloud-upload-alt"></i><p>ምስሊ ኣስሒብካ ኣብዚ ድርብዮ ወይ ጠውቕ</p>';
        imagePreview.classList.remove('has-image');
        showNotification('መጽሓፍ ብዓወት ተረኺቡ ኣሎ!', 'success');
    } catch (error) {
        console.error('Error adding book:', error);
        showNotification('ይቕረታ፡ ጌጋ ተረኺቡ። በጃኻ ደጊምካ ፈትን።', 'error');
    }
});

// Display Books
function displayBooks() {
    if (!bookList) return;

    if (books.length === 0) {
        bookList.innerHTML = '<p class="empty-message">ዝተወስኹ መጻሕፍቲ የለዉን</p>';
        return;
    }

    bookList.innerHTML = '';
    books.forEach(book => {
        const bookItem = document.createElement('div');
        bookItem.className = 'book-item';
        bookItem.innerHTML = `
            <img src="${book.image}" alt="${book.title}">
            <div class="book-details">
                <h3>${book.title}</h3>
                <p>ደራሲ: ${book.author}</p>
                <p>ዋጋ: $${book.price.toFixed(2)}</p>
                <p>ብዝሒ: ${book.stock}</p>
                ${book.rating ? `<p>ደረጃ: ${book.rating}/5</p>` : ''}
                ${book.category ? `<p>ዓይነት: ${book.category}</p>` : ''}
                ${book.tags ? `<p>መለለዪታት: ${book.tags.join(', ')}</p>` : ''}
                ${book.description ? `<p>መግለጺ: ${book.description}</p>` : ''}
                <div class="book-actions">
                    <button onclick="editBook(${book.id})" class="edit-btn">
                        <i class="fas fa-edit"></i> ምምሕያሽ
                    </button>
                    <button onclick="confirmDeleteBook(${book.id})" class="delete-btn">
                        <i class="fas fa-trash"></i> ምስራዝ
                    </button>
                </div>
            </div>
        `;
        bookList.appendChild(bookItem);
    });
}

// Edit Book
function editBook(id) {
    const book = books.find(b => b.id === id);
    if (!book) return;

    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('price').value = book.price;
    document.getElementById('stock').value = book.stock;
    document.getElementById('rating').value = book.rating || 5;
    document.getElementById('category').value = book.category || 'ልብ-ወለድ';
    document.getElementById('tags').value = book.tags.join(', ');
    document.getElementById('description').value = book.description || '';

    if (book.image) {
        imagePreview.innerHTML = `<img src="${book.image}" alt="${book.title}">`;
        imagePreview.classList.add('has-image');
    }

    addBookForm.dataset.editId = book.id;
    const submitBtn = addBookForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-save"></i> መጽሓፍ ኣመሓይሽ';
    
    // Scroll to form
    addBookForm.scrollIntoView({ behavior: 'smooth' });
}

// Confirm Delete Book
function confirmDeleteBook(id) {
    if (confirm('ነዚ መጽሓፍ ክትድምስሶ ትደሊ ዲኻ?')) {
        deleteBook(id);
    }
}

// Delete Book
function deleteBook(id) {
    books = books.filter(book => book.id !== id);
    saveBooks();
    displayBooks();
    showNotification('መጽሓፍ ተደምሲሱ ኣሎ', 'info');
}

// Save Books to localStorage
function saveBooks() {
    try {
        localStorage.setItem('bookstore_books', JSON.stringify(books));
        // Dispatch custom event for book updates
        window.dispatchEvent(new CustomEvent('booksUpdated'));
        // Also trigger storage event for cross-tab communication
        const storageEvent = new StorageEvent('storage', {
            key: 'bookstore_books',
            newValue: JSON.stringify(books),
            url: window.location.href
        });
        window.dispatchEvent(storageEvent);
    } catch (error) {
        console.error('Error saving books:', error);
        showNotification('ጌጋ ኣብ ምዕቃብ መጽሓፍ', 'error');
    }
}

// Read File as Data URL
function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
    });
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeImageUpload();
    displayBooks();
});
