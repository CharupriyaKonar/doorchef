
function populatePaymentTable(data) {
  const tableBody = document.querySelector("#payment-table tbody");
  tableBody.innerHTML = data
    .map(
      (payment) => `
    <tr>
      <td>${payment.user}</td>
      <td>${payment.amount}</td>
      <td>${payment.status}</td>
      <td>${payment.date}</td>
      <td>${payment.dishes}</td>
    </tr>`
    )
    .join("");
}

function populateAvailabilityTable(data) {
  const tableBody = document.querySelector("#availability-table tbody");
  tableBody.innerHTML = data
    .map(
      (chef) => `
    <tr>
      <td>${chef.user.name}</td>
      <td>${chef.Mobile}</td>
      <td>${chef.availableFrom	}</td>
      <td>${chef.availableTo	}</td>
    </tr>`
    )
    .join("");
}


// Function to populate the user table
function populateUserTable(data) {
  const tableBody = document.querySelector("#user-applications tbody");
  tableBody.innerHTML = data
    .map(
      (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <a href="#" onclick="deleteUser('${user._id}')">Delete</a>
        </td>
      </tr>`
    )
    .join("");
}

// Function to delete a user
function deleteUser(userId) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`http://localhost:5000/api/user/delete/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        location.reload(); // Reload table after deletion
      })
      .catch((error) => console.error("Error deleting user:", error));
  }
}
// Function to populate the chef table
function populateChefTable(data) {
  const tableBody = document.querySelector("#chef-table tbody");
  tableBody.innerHTML = data
    .map(
      (chef) => `
    <tr>
      <td>${chef.name}</td>
      <td>${chef.email}</td>
      <td>${chef.specialty.join(", ")}</td>
      <td>${chef.experience} years</td>
      <td>
        <a href="/api/chefs/delete/${chef._id}" onclick="return confirm('Are you sure you want to delete this chef?')">Delete</a>
      </td>
    </tr>`
    )
    .join("");
}


document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display chef applications
    fetch("api/chefs/all")
      .then((response) => response.json())
      .then((data) => populateChefTable(data));
  
    // Fetch and display user applications
    fetch("api/user/all")
      .then((response) => response.json())
      .then((data) => populateUserTable(data));
  
    // Fetch and display payment records
    fetch("api/payment/all")
      .then((response) => response.json())
      .then((data) => populatePaymentTable(data));
  
    // Fetch and display chef availability
    fetch("api/chefs/availability")
      .then((response) => response.json())
      .then((data) => populateAvailabilityTable(data));
  
    // Logout button functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
      window.location.href = "/logout"; // Redirect to login page
    });
  });

  // Approve/Reject actions
  function approveChef(id) {
    fetch(`api/chefs/approve/${id}`, { method: "POST" }).then(() =>
      alert("Chef approved!")
    );
  }
  
  function rejectChef(id) {
    fetch(`api/chefs/reject/${id}`, { method: "POST" }).then(() =>
      alert("Chef rejected!")
    );
  }
  
  function approveUser(id) {
    fetch(`api/users/approve/${id}`, { method: "POST" }).then(() =>
      alert("User approved!")
    );
  }
  
  function rejectUser(id) {
    fetch(`api/users/reject/${id}`, { method: "POST" }).then(() =>
      alert("User rejected!")
    );
  }
  