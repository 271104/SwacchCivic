// ---------------- REGISTER ----------------
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Registration failed");
        return;
      }

      alert("Registration successful");
      window.location.href = "login.html";

    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    }
  });
}

// ---------------- LOGIN ----------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      phone: document.getElementById("phone").value.trim(),
      password: document.getElementById("password").value,
    };

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.message || "Login failed");
        return;
      }

      localStorage.setItem("token", result.token);
      window.location.href = "dashboard.html";

    } catch (err) {
      alert("Backend not reachable");
      console.error(err);
    }
  });
}
