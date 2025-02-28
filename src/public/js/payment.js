
// Fetch total amount dynamically from localStorage or sessionStorage
document.addEventListener("DOMContentLoaded", function () {
  const totalAmountField = document.getElementById("total-amount");

  // Example: Fetch total from sessionStorage (set during cart checkout)
  let totalAmount = 0;
  JSON.parse(localStorage.getItem('cart')).forEach(element => {
    totalAmount += element.totalPrice;
  });
  console.log(totalAmount)
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
document.getElementById("payment-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const totalAmount = document.getElementById("total-amount").value;
  const paymentMethod = document.getElementById("payment-method").value;
  
  if (!email || !phone) {
    alert("Please fill in all the required fields.");
    return;
  }
  dish_list = [];
  dishes = JSON.parse(localStorage.getItem('cart')).forEach(element => {
    dish_list.push(element.dishName);
  });
  console.log(dish_list);
  // Simulate payment processing
    const response = await fetch("http://localhost:5000/api/payment/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user: localStorage.getItem("userId"),
        amount:totalAmount,
        status:"completed",
        dishes:dish_list,
      }),
    });

  alert(`Payment of ${totalAmount} is successful! Thank you for using DoorChef.`);
  localStorage.clear();
  window.location.href = "home"; // Redirect to home page
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
async function completePayment() {
  const bookingId = localStorage.getItem("bookingId");
  if (!bookingId) {
    alert("No booking found.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/bookings/allocate-chef", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    const data = await response.json();
    if (response.ok) {
      alert(`Chef ${data.chef.name} has been allocated to your booking.`);
      window.location.href = "confirmation.html"; // Redirect to confirmation page
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error allocating chef:", error);
    alert("Server error. Please try again.");
  }
}