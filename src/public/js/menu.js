let cart = [];

// Load cart items from localStorage
function loadCart() {
  const savedCart = localStorage.getItem('cart');
  try {
    if (!savedCart) {
      return [];
    }
    return JSON.parse(savedCart);
  } catch (error) {
    console.error('Error parsing cart data from localStorage:', error);
    localStorage.removeItem('cart');
    return [];
  }
}

// Save cart items to localStorage
function saveCart(cart) {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart data to localStorage:', error);
  }
}

// Open the cart modal and display items
function openCart() {
  const cart = loadCart();
  const cartModal = document.getElementById('cart-modal');
  const cartItemsList = document.getElementById('cart-items');
  const totalAmount = document.getElementById('total-amount');

  if (!cartModal || !cartItemsList || !totalAmount) {
    console.error('Cart modal elements not found on the page.');
    return;
  }

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
  if (cartModal) {
    cartModal.style.display = 'none';
  } else {
    console.error('Cart modal not found on the page.');
  }
}

// Proceed to payment (placeholder)
function proceedToPayment() {
  const cart = loadCart();
  if (cart.length === 0) {
    alert('Your cart is empty. Add items to proceed.');
    return;
  }
  alert('Proceeding to payment...');
  window.location.href = 'payment'; // Redirect to payment page
}

// Update the cart count on the cart icon
function updateCartCount() {
  const cart = loadCart();
  const cartCount = document.getElementById('cart-count');
  if (cartCount) {
    cartCount.textContent = cart.length;
  }
}

// Show a specific category when a category button is clicked
function showCategory(category) {
  // Hide all categories
  const categories = document.querySelectorAll('.category');
  categories.forEach((cat) => (cat.style.display = 'none'));

  // Show the selected category
  const selectedCategory = document.getElementById(category);
  if (selectedCategory) {
    selectedCategory.style.display = 'block';
  } else {
    console.error(`Category with ID '${category}' not found.`);
  }

  // Ensure the cart modal and booking form are hidden
  closeBookingForm();
  closeCart();
}

// Open the booking form when "Add to Cart" is clicked
function openBookingForm(dishName, dishPrice) {
  // Populate the booking form with the selected dish name and price
  document.getElementById('selected-dish-name').textContent = dishName;
  document.getElementById('selected-dish-price').value = dishPrice;

  // Show the booking form modal
  const bookingFormModal = document.getElementById('booking-form-modal');
  bookingFormModal.style.display = 'flex';
}

// Close the booking form
function closeBookingForm() {
  const bookingFormModal = document.getElementById('booking-form-modal');
  bookingFormModal.style.display = 'none';
}

// Add booking details to the cart when "Add to Cart" is clicked in the form
function addToCart() {
  // Get details from the booking form
  const dishName = document.getElementById('selected-dish-name').textContent;
  const dishPrice = parseFloat(document.getElementById('selected-dish-price').value.replace('₹', ''));
  const personCount = parseInt(document.getElementById('person-count').value, 10);
  const allergies = document.getElementById('allergies').value;
  const mealTiming = document.getElementById('meal-timing').value;
  const date = document.getElementById('date').value;
  const venue = document.getElementById('venue').value;
  const contactInfo = document.getElementById('contact-info').value;

  // Validate the form inputs
  if (!date || !venue || !contactInfo) {
    alert('Please fill in all the required fields (Date, Venue, Contact Info).');
    return;
  }

  // Add the dish to the cart
  const totalPrice = dishPrice * personCount;
  const cart = loadCart();
  cart.push({
    dishName,
    dishPrice,
    personCount,
    totalPrice,
    allergies,
    mealTiming,
    date,
    venue,
    contactInfo,
  });

  // Save the cart to localStorage
  saveCart(cart);

  // Update the cart count on the cart icon
  updateCartCount();

  // Close the booking form
  closeBookingForm();
  alert(`${dishName} has been added to the cart.`);
}

// Open the customization form
function openCustomizationForm() {
  console.log("Opening Customization Form...");
  const modal = document.getElementById('customization-form-modal');
  if (modal) {
    modal.style.display = 'flex';
  } else {
    console.error("Error: Customization modal not found in the DOM.");
  }
}

// Close the customization form
function closeCustomizationForm() {
  console.log("Closing Customization Form...");
  const modal = document.getElementById('customization-form-modal');
  if (modal) {
    modal.style.display = 'none';
  } else {
    console.error("Error: Customization modal not found in the DOM.");
  }
}

// Calculate customization cost dynamically
function calculateCustomizationCost() {
  const guests = parseInt(document.getElementById('number-of-guests').value, 10);
  const eventType = document.getElementById('event-type').value;
  let baseCost = 0;

  switch (eventType) {
    case 'Birthday': baseCost = 500; break;
    case 'Wedding': baseCost = 1000; break;
    case 'Corporate': baseCost = 800; break;
    default: baseCost = 300;
  }

  const totalCost = baseCost * guests;
  document.getElementById('customization-cost').textContent = `₹${totalCost}`;
}

// Add customization details to the cart
function addCustomizationToCart() {
  const eventType = document.getElementById('event-type').value;
  const customizedDishes = document.getElementById('customized-dishes').value;
  const guests = parseInt(document.getElementById('number-of-guests').value, 10);
  const specialRequirements = document.getElementById('special-requirements').value;
  const venueAddress = document.getElementById('venue-address').value;
  const contactDetails = document.getElementById('contact-details').value;
  const costText = document.getElementById('customization-cost').textContent;

  if (!eventType || !venueAddress || !contactDetails) {
    alert('Please fill in all required fields.');
    return;
  }

  const cart = loadCart();
  cart.push({
    eventType,
    customizedDishes,
    guests,
    specialRequirements,
    venueAddress,
    contactDetails,
    cost: costText
  });

  saveCart(cart);
  alert('Customization has been added to the cart.');
  closeCustomizationForm();
}

// Book now function
async function bookNow() {
  const userId = localStorage.getItem("userId"); // Assuming user is logged in
  const cart = loadCart();

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const allergies = document.getElementById("allergies").value;
  const mealTiming = document.getElementById("meal-timing").value;
  const date = document.getElementById("date").value;
  const venue = document.getElementById("venue").value;
  const contactInfo = document.getElementById("contact-info").value;

  if (!date || !venue || !contactInfo) {
    alert("Please fill in all required fields.");
    return;
  }

  const bookingData = {
    userId,
    dishes: cart,
    totalPrice,
    allergies,
    mealTiming,
    date,
    venue,
    contactInfo,
  };

  try {
    const response = await fetch("http://localhost:5000/api/bookings/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Booking saved! Redirecting to payment...");
      localStorage.setItem("bookingId", data.bookingId);
      window.location.href = "paymentchef/profile";
    } else {
      alert("Error: " + data.error);
    }
  } catch (error) {
    console.error("Error booking:", error);
    alert("Server error. Please try again.");
  }
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  loadCart(); // Load cart items from localStorage
  updateCartCount(); // Update cart count
});

// Attach functions to the global window object
window.openCart = openCart;
window.closeCart = closeCart;
window.showCategory = showCategory;
window.openBookingForm = openBookingForm;
window.addToCart = addToCart;
window.proceedToPayment = proceedToPayment;
window.openCustomizationForm = openCustomizationForm;
window.closeCustomizationForm = closeCustomizationForm;
window.calculateCustomizationCost = calculateCustomizationCost;
window.addCustomizationToCart = addCustomizationToCart;
window.bookNow = bookNow;