
// DOM Elements
const loginForm = document.getElementById("login-form");
const registerUserLink = document.getElementById("register-user-link");
const registerChefLink = document.getElementById("register-chef-link");
const loginLink = document.getElementById("login-link");
const registeruserForm = document.getElementById("register-user-form");
const registerChefForm = document.getElementById("register-chef-form");

// Show User Registration Form
if (registerUserLink) {
  registerUserLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (loginForm) loginForm.classList.add("hidden");
    if (registerChefForm) registerChefForm.classList.add("hidden");
    if (registerUserForm) registerUserForm.classList.remove("hidden");
  });
}

// Show Chef Registration Form
if (registerChefLink) {
  registerChefLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (loginForm) loginForm.classList.add("hidden");
    if (registerUserForm) registerUserForm.classList.add("hidden");
    if (registerChefForm) registerChefForm.classList.remove("hidden");
  });
}

// Show Login Form
if (loginLink) {
  loginLink.addEventListener("click", (e) => {
    e.preventDefault();
    if (registerUserForm) registerUserForm.classList.add("hidden");
    if (registerChefForm) registerChefForm.classList.add("hidden");
    if (loginForm) loginForm.classList.remove("hidden");
  });
}
const registerUserForm = document.getElementById("register-user-form");

// User Registration
if (registerUserForm) {
  registerUserForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("reg-name").value.trim();
    const email = document.getElementById("reg-email").value.trim();
    const password = document.getElementById("reg-password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill out all fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("User registered successfully!");
      window.location.href = "/home"; // Redirect to home page
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Please try again later.");
    }
  });
}

// Chef Registration
if (registerChefForm) {
  registerChefForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("chef-name").value.trim();
    const email = document.getElementById("chef-email").value.trim();
    const password = document.getElementById("chef-password").value.trim();
    const specialty = document.getElementById("specialty").value.trim();
    const experience = document.getElementById("experience").value.trim();
    const resume = document.getElementById("resume").files[0];

    if (!name || !email || !password || !specialty || !experience || !resume) {
      alert("Please fill out all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("specialty", specialty);
    formData.append("experience", experience);
    formData.append("availability", false);
    formData.append("resume", resume);

    try {
      const response = await fetch("http://localhost:5000/api/auth/chef/register", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (!response.ok) {
        alert(data.message || "Registration failed.");
        return;
      }

      alert("Chef registered successfully!");
      window.location.href = "chef/login"; // Redirect to chef portal
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Please try again later.");
    }
  });
}

// Login
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("API Response:", data); // Debugging

      if (!response.ok) {
        alert(data.message || "Invalid login credentials.");
        return;
      }

      // Store token & role in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);

      // Redirect based on role
      window.location.href = data.redirect;
    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Please try again later.");
    }
  });
}