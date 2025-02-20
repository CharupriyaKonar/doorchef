document.addEventListener("DOMContentLoaded", () => {
    // Fetch and display chef applications
    fetch("api/chefs")
      .then((response) => response.json())
      .then((data) => populateChefTable(data));
  
    // Fetch and display user applications
    fetch("api/users")
      .then((response) => response.json())
      .then((data) => populateUserTable(data));
  
    // Fetch and display payment records
    fetch("api/payments")
      .then((response) => response.json())
      .then((data) => populatePaymentTable(data));
  
    // Fetch and display chef availability
    fetch("api/chefs/availability")
      .then((response) => response.json())
      .then((data) => populateAvailabilityTable(data));
  
    // Logout button functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
      window.location.href = "login.html"; // Redirect to login page
    });
  });
  
  // Functions to populate tables
  function populateChefTable(data) {
    const tableBody = document.querySelector("#chef-table tbody");
    tableBody.innerHTML = data
      .map(
        (chef) => `
      <tr>
        <td>${chef.name}</td>
        <td>${chef.email}</td>
        <td>${chef.specialty}</td>
        <td>${chef.experience} years</td>
        <td>
          <button onclick="approveChef('${chef.id}')">Approve</button>
          <button onclick="rejectChef('${chef.id}')">Reject</button>
        </td>
      </tr>`
      )
      .join("");
  }
  
  function populateUserTable(data) {
    const tableBody = document.querySelector("#user-table tbody");
    tableBody.innerHTML = data
      .map(
        (user) => `
      <tr>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>
          <button onclick="approveUser('${user.id}')">Approve</button>
          <button onclick="rejectUser('${user.id}')">Reject</button>
        </td>
      </tr>`
      )
      .join("");
  }
  
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
        <td>${chef.name}</td>
        <td>${chef.specialty}</td>
        <td>${chef.availability}</td>
      </tr>`
      )
      .join("");
  }
  
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
  