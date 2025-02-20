let currentIndex = 0;

function moveSlide(step) {
    const chefs = document.querySelectorAll('.chef-card');
    const totalChefs = chefs.length;
    
    currentIndex = (currentIndex + step + totalChefs) % totalChefs;
    
    chefs.forEach((chef, index) => {
        chef.style.display = index === currentIndex ? 'block' : 'none';
    });
}

// Initialize first chef to be shown
moveSlide(0);

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
  