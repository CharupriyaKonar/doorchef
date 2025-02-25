const reviewsData = {
  "Chef Arjun": [
      { user: "Riya", rating: "⭐⭐⭐⭐⭐", review: "Amazing flavors, loved the authentic touch!" },
      { user: "Amit", rating: "⭐⭐⭐⭐", review: "Great spice balance, just like home-cooked food." }
  ],
  "Chef Priya": [
      { user: "John", rating: "⭐⭐⭐⭐⭐", review: "The pasta was simply perfect!" },
      { user: "Emma", rating: "⭐⭐⭐⭐", review: "Loved the creamy Alfredo sauce!" }
  ],
  "Chef Sameer": [
      { user: "Ananya", rating: "⭐⭐⭐⭐⭐", review: "Best dumplings ever!" },
      { user: "Raj", rating: "⭐⭐⭐⭐⭐", review: "Authentic Chinese taste, amazing experience!" }
  ],
  "Chef Rohan": [
      { user: "Meera", rating: "⭐⭐⭐⭐", review: "French cuisine at its finest!" },
      { user: "Sanjay", rating: "⭐⭐⭐⭐⭐", review: "Fantastic presentation and taste!" }
  ],
  "Chef Sanya": [
      { user: "Lisa", rating: "⭐⭐⭐⭐⭐", review: "Thai flavors were on point!" },
      { user: "Ravi", rating: "⭐⭐⭐⭐", review: "Loved the authentic Pad Thai!" }
  ],
  "Chef Amrita": [
      { user: "Kunal", rating: "⭐⭐⭐⭐⭐", review: "Great balance of spices!" },
      { user: "Neha", rating: "⭐⭐⭐⭐", review: "Delicious and beautifully plated." }
  ],
  "Chef Vikram": [
      { user: "Arnav", rating: "⭐⭐⭐⭐⭐", review: "Exquisite taste and quality." },
      { user: "Priyanka", rating: "⭐⭐⭐⭐", review: "Very professional and skilled chef!" }
  ],
  "Chef Nita": [
      { user: "Sameer", rating: "⭐⭐⭐⭐⭐", review: "Loved every dish she prepared!" },
      { user: "Tina", rating: "⭐⭐⭐⭐", review: "Perfect seasoning and texture." }
  ],
  "Chef Vikas": [
      { user: "Ramesh", rating: "⭐⭐⭐⭐⭐", review: "One of the best meals I’ve had!" },
      { user: "Sneha", rating: "⭐⭐⭐⭐", review: "Highly recommended for Thai food lovers." }
  ],
  "Chef Ranveer": [
      { user: "Krishna", rating: "⭐⭐⭐⭐⭐", review: "His flavors were extraordinary!" },
      { user: "Megha", rating: "⭐⭐⭐⭐", review: "Very skilled chef, loved his creations." }
  ],
  "Chef Garima": [
      { user: "Sahil", rating: "⭐⭐⭐⭐⭐", review: "Every dish was top-notch!" },
      { user: "Preeti", rating: "⭐⭐⭐⭐", review: "Great experience, would book again!" }
  ],
  "Chef Ritu": [
      { user: "Akash", rating: "⭐⭐⭐⭐⭐", review: "She made our evening special with her dishes!" },
      { user: "Sonali", rating: "⭐⭐⭐⭐", review: "Great service and amazing taste." }
  ]
};

// Function to Show Reviews Modal
function showReviews(chefName) {
  const modal = document.getElementById("reviewModal");
  const modalChefName = document.getElementById("modal-chef-name");
  const modalReviews = document.getElementById("modal-reviews");

  // Update modal title
  modalChefName.innerText = `Reviews for ${chefName}`;

  // Check if chef has reviews, otherwise show a message
  if (reviewsData[chefName]) {
      modalReviews.innerHTML = reviewsData[chefName]
          .map(review => `<p><strong>${review.user}</strong>: ${review.rating} - ${review.review}</p>`)
          .join("");
  } else {
      modalReviews.innerHTML = `<p>No reviews available for this chef yet.</p>`;
  }

  // Display the modal
  modal.style.display = "block";
}

// Function to Close Reviews Modal
function closeReviews() {
  document.getElementById("reviewModal").style.display = "none";
}

// Close modal when clicking outside content
window.onclick = function(event) {
  const modal = document.getElementById("reviewModal");
  if (event.target === modal) {
      closeReviews();
  }
};
