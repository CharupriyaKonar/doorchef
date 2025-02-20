document.addEventListener("DOMContentLoaded", () => {
    // Store initial chef ratings and rating counts
    const chefRatings = {
      arjun: { total: 4.5 * 10, count: 10 }, // Initial total = 4.5 * 10 votes
      priya: { total: 4.8 * 10, count: 10 },
    };
  
    // Handle rating submissions
    document.querySelectorAll(".rate-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const form = e.target.closest(".rating-form");
        const chef = form.getAttribute("data-chef");
        const input = form.querySelector("input[type='number']");
        const newRating = parseFloat(input.value);
  
        if (newRating >= 1 && newRating <= 5) {
          // Update rating data
          chefRatings[chef].total += newRating;
          chefRatings[chef].count += 1;
  
          // Calculate new average rating
          const newAverage = (
            chefRatings[chef].total / chefRatings[chef].count
          ).toFixed(1);
  
          // Update the UI
          document.getElementById(`rating-${chef}`).textContent = newAverage;
  
          // Clear the input field
          input.value = "";
  
          alert("Thank you for rating!");
        } else {
          alert("Please enter a rating between 1 and 5.");
        }
      });
    });
  });
  