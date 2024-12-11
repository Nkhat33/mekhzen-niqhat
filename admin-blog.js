// Blog Management Functions
let blogs = [];
let editingBlogId = null;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Blog management initialized');
    
    // Initialize blogs array from localStorage
    blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    
    // Get DOM elements
    const blogForm = document.getElementById('blogForm');
    const blogImageUpload = document.getElementById('blogImageUpload');
    const blogImagePreview = document.getElementById('blogImagePreview');
    const resetButton = document.getElementById('resetBlog');

    // Reset button functionality
    if (resetButton) {
        resetButton.addEventListener('click', function(e) {
            e.preventDefault();
            resetForm();
        });
    }

    // Form submission
    if (blogForm) {
        blogForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('Form submitted');
            
            const formData = new FormData(blogForm);
            const title = formData.get('blogTitle')?.trim() || '';
            const author = formData.get('blogAuthor')?.trim() || '';
            const content = formData.get('blogContent')?.trim() || '';
            const readTime = formData.get('readTime')?.trim() || '';

            if (!title || !author || !content || !readTime) {
                showNotification('ኩሎም ዓውድታት ክምልኡ ኣለዎም።', 'error');
                return;
            }

            const blogData = {
                title,
                author,
                content,
                readTime
            };

            const submitButton = document.getElementById('submitBlog');
            const editId = submitButton.getAttribute('data-edit-id');
            const imageFile = blogImageUpload.files[0];
            const currentImage = document.getElementById('currentImage')?.value;

            if (!editId && !imageFile) {
                showNotification('በጃኻ ምስሊ ምረጽ።', 'error');
                return;
            }

            // Handle image and save blog
            if (imageFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    saveBlogWithImage(blogData, editId, e.target.result);
                };
                reader.readAsDataURL(imageFile);
            } else {
                // If editing and no new image selected, keep existing image
                saveBlogWithImage(blogData, editId, currentImage);
            }
        });
    }

    // Image upload preview
    if (blogImageUpload && blogImagePreview) {
        blogImagePreview.addEventListener('click', () => {
            blogImageUpload.click();
        });

        blogImageUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                handleImageUpload(file);
            }
        });

        // Drag and drop functionality
        blogImagePreview.addEventListener('dragover', (e) => {
            e.preventDefault();
            blogImagePreview.classList.add('dragover');
        });

        blogImagePreview.addEventListener('dragleave', () => {
            blogImagePreview.classList.remove('dragover');
        });

        blogImagePreview.addEventListener('drop', (e) => {
            e.preventDefault();
            blogImagePreview.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(file);
            } else {
                showNotification('በጃኻ ናይ ምስሊ ፋይል ጥራይ ምረጽ።', 'error');
            }
        });
    }

    // Display initial blogs
    displayBlogs();
});

function handleImageUpload(file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        showNotification('ዓቐን ናይ ምስሊ ካብ 5MB ክበዝሕ የብሉን።', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const blogImagePreview = document.getElementById('blogImagePreview');
        blogImagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        blogImagePreview.classList.add('has-image');
    };
    reader.readAsDataURL(file);
}

function saveBlogWithImage(blogData, editId, imageUrl) {
    try {
        if (!imageUrl) {
            showNotification('ምስሊ ክህሉ ኣለዎ።', 'error');
            return;
        }

        // Get existing blogs
        const existingBlogs = JSON.parse(localStorage.getItem('blogs')) || [];
        
        if (editId) {
            // Update existing blog
            const index = existingBlogs.findIndex(b => b.id === editId);
            if (index !== -1) {
                existingBlogs[index] = {
                    ...existingBlogs[index],
                    ...blogData,
                    image: imageUrl,
                    lastModified: new Date().toISOString()
                };
                showNotification('ጽሑፍ ብዓወት ተመሓይሹ ኣሎ።', 'success');
            }
        } else {
            // Create new blog
            const newBlog = {
                id: Date.now().toString(),
                ...blogData,
                image: imageUrl,
                date: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };
            existingBlogs.push(newBlog);
        }

        // Save to localStorage
        localStorage.setItem('blogs', JSON.stringify(existingBlogs));
        console.log('Blogs saved successfully:', existingBlogs);
        
        // Update global blogs array
        blogs = existingBlogs;
        
        // Reset form and update display
        resetForm();
        displayBlogs();
        
        if (!editId) {
            showNotification('ጽሑፍ ብዓወት ተወሲኹ ኣሎ።', 'success');
        }
    } catch (error) {
        console.error('Error saving blog:', error);
        showNotification('ጽሑፍ ኣብ ምውሳኽ ጸገም ተረኺቡ።', 'error');
    }
}

function displayBlogs() {
    const articlesList = document.getElementById('articlesList');
    if (!articlesList) {
        console.error('Articles list element not found');
        return;
    }

    // Get fresh copy of blogs from localStorage
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    console.log('Displaying blogs:', blogs);

    // Sort blogs by date (newest first)
    blogs.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Create header with actions
    const header = document.createElement('div');
    header.className = 'articles-header';
    header.innerHTML = `
        <div class="articles-count">${blogs.length} ጽሑፋት</div>
        <div class="articles-actions">
            <button onclick="clearAllBlogs()" class="action-button delete-all">
                <i class="fas fa-trash-alt"></i> ኩሎም ጽሑፋት ሰርዝ
            </button>
        </div>
    `;
    
    // Create articles grid
    const articlesGrid = document.createElement('div');
    articlesGrid.className = 'articles-grid';

    if (blogs.length === 0) {
        articlesGrid.innerHTML = '<div class="empty-message">ዝተዘርገሐ ጽሑፍ የለን</div>';
    } else {
        blogs.forEach(blog => {
            const article = document.createElement('div');
            article.className = 'article-card';
            
            // Truncate content for preview
            const maxLength = 150;
            let truncatedContent = blog.content;
            if (blog.content.length > maxLength) {
                truncatedContent = blog.content.substr(0, maxLength);
                truncatedContent = truncatedContent.substr(0, Math.min(truncatedContent.length, truncatedContent.lastIndexOf(' ')));
                truncatedContent += '...';
            }

            article.innerHTML = `
                <div class="article-image">
                    <img src="${blog.image || './images/default-blog.jpg'}" alt="${blog.title}" onerror="this.src='./images/default-blog.jpg'">
                </div>
                <div class="article-content">
                    <h4>${blog.title}</h4>
                    <div class="article-meta">
                        <span><i class="fas fa-user"></i> ${blog.author}</span>
                        <span><i class="fas fa-clock"></i> ${blog.readTime} ደቒቕ</span>
                        <span><i class="fas fa-calendar"></i> ${new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <p class="article-excerpt">${truncatedContent}</p>
                    <div class="article-actions">
                        <button onclick="editBlog('${blog.id}')" class="edit-btn">
                            <i class="fas fa-edit"></i> ኣመሓይሽ
                        </button>
                        <button onclick="deleteBlog('${blog.id}')" class="delete-btn">
                            <i class="fas fa-trash"></i> ሰርዝ
                        </button>
                    </div>
                </div>
            `;
            articlesGrid.appendChild(article);
        });
    }

    // Clear and update the display
    articlesList.innerHTML = '';
    articlesList.appendChild(header);
    articlesList.appendChild(articlesGrid);
}

function resetForm() {
    const blogForm = document.getElementById('blogForm');
    const blogImagePreview = document.getElementById('blogImagePreview');
    const submitButton = document.getElementById('submitBlog');
    
    if (blogForm) {
        blogForm.reset();
    }
    
    if (blogImagePreview) {
        blogImagePreview.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <p>ምስሊ ኣስሒብካ ኣብዚ ድርብዮ ወይ ጠውቕ</p>
        `;
        blogImagePreview.classList.remove('has-image');
    }
    
    if (submitButton) {
        submitButton.textContent = 'ጽሑፍ ወስኽ';
        submitButton.removeAttribute('data-edit-id');
    }
}

function editBlog(id) {
    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    // Set form values
    document.getElementById('blogTitle').value = blog.title;
    document.getElementById('blogAuthor').value = blog.author;
    document.getElementById('blogContent').value = blog.content;
    document.getElementById('readTime').value = blog.readTime;

    // Handle image preview
    const blogImagePreview = document.getElementById('blogImagePreview');
    if (blog.image) {
        blogImagePreview.innerHTML = `<img src="${blog.image}" alt="Preview">`;
        blogImagePreview.classList.add('has-image');
        // Add hidden input for current image
        const currentImageInput = document.createElement('input');
        currentImageInput.type = 'hidden';
        currentImageInput.id = 'currentImage';
        currentImageInput.value = blog.image;
        blogImagePreview.appendChild(currentImageInput);
    }

    // Update submit button
    const submitButton = document.getElementById('submitBlog');
    submitButton.textContent = 'ጽሑፍ ኣመሓይሽ';
    submitButton.setAttribute('data-edit-id', id);
}

function deleteBlog(id) {
    if (!confirm('ነዚ ጽሑፍ ክትሰርዞ ትደሊ ዲኻ?')) return;

    const blogs = JSON.parse(localStorage.getItem('blogs')) || [];
    const newBlogs = blogs.filter(blog => blog.id !== id);
    localStorage.setItem('blogs', JSON.stringify(newBlogs));
    
    displayBlogs();
    showNotification('ጽሑፍ ብዓወት ተሰሪዙ ኣሎ።', 'success');
}

function clearAllBlogs() {
    if (confirm('ኩሎም ጽሑፋት ክድምሰሱ እዮም። ርግጸኛ ዲኻ?')) {
        localStorage.removeItem('blogs');
        displayBlogs(); // Refresh the display
        showNotification('ኩሎም ጽሑፋት ተደምሲሶም ኣለዉ።', 'success');
    }
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}
