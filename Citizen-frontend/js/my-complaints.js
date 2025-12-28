// const token = localStorage.getItem("token");

// // Protect page
// if (!token) {
//   alert("Please login first");
//   window.location.href = "login.html";
// }

// // Fetch my complaints
// fetch(`${API_URL}/api/complaints/mine`, {
//   headers: {
//     Authorization: `Bearer ${token}`
//   }
// })
//   .then(res => res.json())
//   .then(data => {
//     const container = document.getElementById("complaints");

//     if (!data.length) {
//       container.innerHTML = "<p>No complaints registered yet.</p>";
//       return;
//     }

//     // data.forEach(c => {
//     //   container.innerHTML += `
//     //     <div class="complaint">
//     //       <p><b>Type:</b> ${c.type}</p>
//     //       <p><b>Description:</b> ${c.description || "-"}</p>
//     //       <p><b>Location:</b> ${c.location || "-"}</p>
//     //       <p class="status">Status: ${c.status}</p>
//     //       ${
//     //         c.photoPath
//     //           ? `<img src="${API_URL}/${c.photoPath.replace(/\\/g, "/")}" />`
//     //           : ""
//     //       }
//     //       <p><small>Created: ${new Date(c.createdAt).toLocaleString()}</small></p>
//     //     </div>
//     //   `;
//     // });
//     data.forEach(c => {
//       div.innerHTML += `
//         <div style="border:1px solid #ccc; padding:10px; margin-bottom:10px">
//           <h4>${c.type}</h4>
//           <p>${c.description || ""}</p>
//           <p><b>Location:</b> ${c.location || "-"}</p>

//           <p>
//             <b>Status:</b>
//             <span class="status ${c.status}">
//               ${c.status.replace("_", " ").toUpperCase()}
//             </span>
//           </p>

//           ${
//             c.status === "resolved"
//               ? `<p style="color:green;"><b>✅ Action has been taken by authorities</b></p>`
//               : ""
//           }

//           <img src="${c.photoUrl || ""}" width="200"
//             onerror="this.style.display='none'" />
//         </div>
//       `;
//     });

//   })
//   .catch(err => {
//     console.error(err);
//     alert("Failed to load complaints");
//   });

const token = localStorage.getItem("token");

// Protect page
if (!token) {
  alert("Please login first");
  window.location.href = "login.html";
}

// Fetch my complaints
fetch(`${API_URL}/api/complaints/mine`, {
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then(res => {
    if (!res.ok) throw new Error("Unauthorized or server error");
    return res.json();
  })
  .then(data => {
    const container = document.getElementById("complaints");
    container.innerHTML = "";

    if (!data.length) {
      container.innerHTML = "<p>No complaints registered yet.</p>";
      return;
    }

    data.forEach(c => {
      container.innerHTML += `
        <div class="complaint">
          <h4>${c.type}</h4>
          <p>${c.description || ""}</p>
          <p><b>Location:</b> ${c.location || "-"}</p>

          <p>
            <b>Status:</b>
            <span class="status ${c.status}">
              ${c.status.replace("_", " ").toUpperCase()}
            </span>
          </p>

          ${
            c.status === "resolved"
              ? `<p style="color:green;"><b>✅ Action has been taken by authorities</b></p>`
              : ""
          }

          ${
            c.photoUrl
              ? `<img src="${c.photoUrl}" width="200" />`
              : ""
          }

          <p><small>Created: ${new Date(c.createdAt).toLocaleString()}</small></p>
        </div>
      `;
    });
  })
  .catch(err => {
    console.error(err);
    alert("Failed to load complaints");
  });
