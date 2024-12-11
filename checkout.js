// Get cart items from localStorage
const cart = JSON.parse(localStorage.getItem('cart')) || [];
const orderItems = document.getElementById('orderItems');
const orderTotal = document.getElementById('orderTotal');
const checkoutForm = document.getElementById('checkoutForm');
const creditCardDetails = document.getElementById('creditCardDetails');
const paymentMethods = document.getElementsByName('paymentMethod');

// Display order summary
function displayOrderSummary() {
    if (cart.length === 0) {
        window.location.href = 'index.html';
        return;
    }

    let total = 0;
    orderItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="order-item">
                <img src="${item.image}" alt="${item.title}">
                <div class="order-item-details">
                    <h4>${item.title}</h4>
                    <p>ብዝሒ: ${item.quantity}</p>
                    <p>ዋጋ: $${item.price.toFixed(2)}</p>
                </div>
                <div class="order-item-total">
                    $${itemTotal.toFixed(2)}
                </div>
            </div>
        `;
    }).join('');

    // Add shipping cost based on selected method
    const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
    const shippingCost = shippingMethod.value === 'express' ? 15 : 5;
    total += shippingCost;

    orderTotal.textContent = `$${total.toFixed(2)}`;
}

// Toggle payment method details
function togglePaymentDetails() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    if (selectedMethod === 'credit') {
        creditCardDetails.style.display = 'block';
    } else {
        creditCardDetails.style.display = 'none';
    }
}

// Handle shipping method change
document.getElementsByName('shippingMethod').forEach(radio => {
    radio.addEventListener('change', displayOrderSummary);
});

// Handle payment method change
paymentMethods.forEach(radio => {
    radio.addEventListener('change', togglePaymentDetails);
});

// Format credit card number
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
});

// Format expiry date
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// Format CVV
document.getElementById('cvv').addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
});

// Form validation
checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }

    // Show loading state
    const submitButton = checkoutForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'ትእዛዝ ይስራሕ ኣሎ...';

    try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Clear cart
        localStorage.removeItem('cart');
        
        // Show success message
        showNotification('ትእዛዝካ ብዓወት ተመዝጊቡ ኣሎ!', 'success');
        
        // Redirect to confirmation page after a short delay
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    } catch (error) {
        showNotification('ይቕረታ፡ ጌጋ ተረኺቡ። በጃኻ ደጊምካ ፈትን።', 'error');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    
    if (!name || !email || !phone || !address) {
        showNotification('በጃኻ ኩሎም ዝድለዩ ሓበሬታታት ምላእ።', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('በጃኻ ቅኑዕ ኢመይል ኣድራሻ ኣእቱ።', 'error');
        return false;
    }
    
    const selectedPayment = document.querySelector('input[name="paymentMethod"]:checked');
    if (!selectedPayment) {
        showNotification('በጃኻ ኣገባብ ክፍሊት ምረጽ።', 'error');
        return false;
    }
    
    if (selectedPayment.value === 'credit') {
        const cardNumber = document.getElementById('cardNumber').value.trim();
        const expiry = document.getElementById('expiry').value.trim();
        const cvv = document.getElementById('cvv').value.trim();
        
        if (!cardNumber || !expiry || !cvv) {
            showNotification('በጃኻ ኩሎም ዝድለዩ ናይ ክረዲት ካርድ ሓበሬታታት ምላእ።', 'error');
            return false;
        }
    }
    
    return true;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page
displayOrderSummary();
togglePaymentDetails();
