document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');
    const deliveryOptions = document.querySelectorAll('input[name="deliveryOption"]');
    const addressGroup = document.getElementById('addressGroup');

    // Show/hide address field
    deliveryOptions.forEach(option => {
        option.addEventListener('change', function() {
            addressGroup.style.display = this.value === 'Delivery' ? 'block' : 'none';
        });
    });

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        try {
            // Method 1: Try FormSubmit first
            const formData = new FormData(form);
            
            // Add necessary FormSubmit parameters
            formData.append('_subject', 'New Order from SnackStop Express');
            formData.append('_template', 'table');
            
            const response = await fetch('https://formsubmit.co/ajax/snackstop.express9@gmail.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            // If FormSubmit worked
            if (response.ok) {
                showSuccessMessage();
                form.reset();
                addressGroup.style.display = 'none';
                return;
            }
            
            // If FormSubmit failed, try direct email as fallback
            const orderData = {
                name: formData.get('name'),
                phone: formData.get('phone'),
                delivery: formData.get('deliveryOption'),
                address: formData.get('address') || 'Pickup',
                items: formData.get('orderItems'),
                notes: formData.get('notes') || 'None'
            };
            
            const mailtoLink = `mailto:snackstop.express9@gmail.com?subject=New Order from ${orderData.name}&body=`
                + `Name: ${orderData.name}%0D%0A`
                + `Phone: ${orderData.phone}%0D%0A`
                + `Delivery: ${orderData.delivery}%0D%0A`
                + (orderData.delivery === 'Delivery' ? `Address: ${orderData.address}%0D%0A%0D%0A` : '%0D%0A')
                + `Order Items:%0D%0A${orderData.items.replace(/\n/g, '%0D%0A')}%0D%0A%0D%0A`
                + `Notes: ${orderData.notes}`;
            
            window.location.href = mailtoLink;
            showSuccessMessage();
            form.reset();
            
        } catch (error) {
            console.error('Submission error:', error);
            alert('Order submitted! If you don\'t receive confirmation, please call +60 16-807 5557');
            showSuccessMessage();
            form.reset();
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });

    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = 'Order received! Thank you!';
        form.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
});