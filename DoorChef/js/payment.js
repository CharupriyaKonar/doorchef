// Fetch total amount dynamically from localStorage or sessionStorage
document.addEventListener("DOMContentLoaded", function () {
  const totalAmountField = document.getElementById("total-amount");

  // Example: Fetch total from sessionStorage (set during cart checkout)
  const totalAmount = sessionStorage.getItem("totalAmount") || "0.00";
  totalAmountField.value = `₹${totalAmount}`;
});

// Toggle payment method sections
document.getElementById("payment-method").addEventListener("change", function () {
  const selectedMethod = this.value;

  // Hide all sections
  document.getElementById("card-details").style.display = "none";
  document.getElementById("upi-details").style.display = "none";
  document.getElementById("wallet-details").style.display = "none";

  // Show the selected section
  if (selectedMethod === "card") {
    document.getElementById("card-details").style.display = "block";
  } else if (selectedMethod === "upi") {
    document.getElementById("upi-details").style.display = "block";
  } else if (selectedMethod === "wallet") {
    document.getElementById("wallet-details").style.display = "block";
  }
});

// Handle form submission
document.getElementById("payment-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const totalAmount = document.getElementById("total-amount").value;

  if (!email || !phone) {
    alert("Please fill in all the required fields.");
    return;
  }

  // Simulate payment processing
  alert(`Payment of ${totalAmount} is successful! Thank you for using DoorChef.`);
  window.location.href = "index.html"; // Redirect to home page
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

