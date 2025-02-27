document.addEventListener("DOMContentLoaded", function () {
    const booking = JSON.parse(localStorage.getItem("bookingDetails"));

    if (booking) {
        document.getElementById("dish-name").textContent = booking.dishName;
        document.getElementById("location").textContent = booking.location;
        document.getElementById("booking-time").textContent = booking.bookingTime;
        document.getElementById("chef-name").textContent = booking.chefName;
        document.getElementById("chef-phone").textContent = booking.chefPhone;
    } else {
        document.querySelector(".confirmation-container").innerHTML = "<h2>No booking found.</h2>";
    }
});

function goToHome() {
    window.location.href = "/DoorChef/pages/index.html";
}

