// DOM Elements
const loginForm = document.getElementById('login-form');
const userRegisterForm = document.getElementById('register-user-form');
const chefRegisterForm = document.getElementById('register-chef-form');

// Links
const registerUserLink = document.getElementById('register-user-link');
const registerChefLink = document.getElementById('register-chef-link');
const loginLinks = document.querySelectorAll('#login-link');

// Helper Function to Hide All Forms
function hideAllForms() {
  loginForm.classList.add('hidden');
  userRegisterForm.classList.add('hidden');
  chefRegisterForm.classList.add('hidden');
}

// Show respective form on click
registerUserLink.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  userRegisterForm.classList.remove('hidden');
});

registerChefLink.addEventListener('click', (e) => {
  e.preventDefault();
  hideAllForms();
  chefRegisterForm.classList.remove('hidden');
});

loginLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllForms();
    loginForm.classList.remove('hidden');
  });
});

// ✅ LOGIN FUNCTION
document.getElementById("login-form").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Invalid login credentials.");
      return;
    }

    // ✅ Store JWT Token in localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userRole", data.user.role); // Store role for future access

    // ✅ Redirect based on user role
    if (data.user.role === "admin") {
      window.location.href = "/DoorChef/pages/admin.html";
    } else if (data.user.role === "chef") {
      window.location.href = "/DoorChef/pages/chef-portal.html";
    } else {
      window.location.href = "/DoorChef/pages/index.html";
    }

  } catch (error) {
    console.error("Login error:", error);
    alert("Server error. Please try again later.");
  }
});
