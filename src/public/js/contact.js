document.getElementById("contact-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form from reloading the page
    
    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // Perform basic validation (you can expand this as needed)
    if (!name || !email || !message) {
        alert("All fields are required.");
        return;
    }

    // Simulate sending the data (in real case, you'd send this to a server)
    console.log("Form Data:", { name, email, message });

    // Update form status
    document.getElementById("form-status").textContent = "Your message has been sent! We'll get back to you soon.";
    document.getElementById("form-status").style.color = "green";
    
    // Reset form
    document.getElementById("contact-form").reset();
});
document.addEventListener('DOMContentLoaded', () => {
    // Open cart modal and display items
    function openCart() {
      const cartModal = document.getElementById('cart-modal');
      const cartItemsList = document.getElementById('cart-items');
      const totalAmount = document.getElementById('total-amount');
  
      // Clear previous items
      cartItemsList.innerHTML = '';
      let total = 0;
  
      // Populate cart items
      cart.forEach((item, index) => {
        total += item.totalPrice;
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${item.dishName} x ${item.personCount} = ₹${item.totalPrice} (Date: ${item.date})`;
        cartItemsList.appendChild(li);
      });
  
      // Show the total amount
      totalAmount.textContent = `Total: ₹${total}`;
  
      // Show the cart modal
      cartModal.style.display = 'flex';
    }
  
    // Close the cart modal
    function closeCart() {
      const cartModal = document.getElementById('cart-modal');
      cartModal.style.display = 'none';
    }
  
    // Attach the functions to the global `window` object
    window.openCart = openCart;
    window.closeCart = closeCart;
  });
  
  