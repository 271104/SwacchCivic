alert("complaint.js loaded");

//test
// document.getElementById("complaintForm")
//   .addEventListener("submit", function (e) {
//     e.preventDefault();
//     alert("Submit clicked");
//   });
//testing over

// complaint.js

document.getElementById("complaintForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again");
      window.location.href = "login.html";
      return;
    }

    const type = document.getElementById("type").value;
    const description = document.getElementById("description").value;
    const location = document.getElementById("location").value;
    const photoInput = document.getElementById("photo");

    if (!type || !description || !location || photoInput.files.length === 0) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("type", type);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("photo", photoInput.files[0]); // MUST be 'photo'

    try {
      const res = await fetch(`${API_URL}/api/complaints`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
          // ❌ DO NOT set Content-Type
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to submit complaint");
        return;
      }

      alert("Complaint registered successfully");
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Complaint submit error:", error);
      alert("Network or server error");
    }
  });