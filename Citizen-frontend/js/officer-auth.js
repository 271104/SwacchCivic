document.getElementById("officerLoginForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const phone = document.getElementById("phone").value;
    const password = document.getElementById("password").value;

    if (!phone || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ phone, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // 🔐 IMPORTANT ROLE CHECK
      if (data.user.role !== "officer") {
        alert("Access denied. Officer login only.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      alert("Officer login successful");
      window.location.href = "officer-dashboard.html";

    } catch (err) {
      console.error(err);
      alert("Backend not reachable");
    }
  });
