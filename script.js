document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("appointmentForm");
  const dateInput = document.getElementById("date");
  const adminLoginBtn = document.getElementById("adminLogin");
  const adminPasswordInput = document.getElementById("adminPassword");
  const adminPanel = document.getElementById("adminPanel");
  const loginMessage = document.getElementById("loginMessage");

  const ADMIN_PASSWORD = "Christian2004"; // Change this to your own password

  // ✅ Disable past dates
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split("T")[0];
  dateInput.min = minDate;

  // ✅ Handle appointment submission
  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!name || !date || !time) {
      alert("Please fill in all fields!");
      return;
    }

    let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    // Check if the slot is already taken or pending
    const isTaken = appointments.some(
      appt => appt.date === date && appt.time === time
    );

    if (isTaken) {
      alert("⚠️ This time slot is already taken or pending approval.");
      return;
    }

    // Add new appointment as "Pending"
    const newAppointment = { name, date, time, status: "Pending" };
    appointments.push(newAppointment);
    localStorage.setItem("appointments", JSON.stringify(appointments));

    alert("✅ Appointment request submitted! Awaiting approval.");
    form.reset();
     nameInput.value = "";
  dateInput.value = "";
  timeInput.value = "";
    displayAppointments();
  });

  // ✅ Display appointments for user
  function displayAppointments() {
    const appointmentList = document.getElementById("appointmentList");
    appointmentList.innerHTML = "";

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.forEach(appt => {
      if (appt.status !== "Pending") {
        const li = document.createElement("li");
        li.textContent = `${appt.name} — ${appt.date} at ${appt.time} [${appt.status}]`;
        appointmentList.appendChild(li);
      }
    });
  }

  // ✅ Display pending appointments (for admin)
  function displayPendingAppointments() {
    const pendingList = document.getElementById("pendingList");
    pendingList.innerHTML = "";

    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

    appointments.forEach((appt, index) => {
      if (appt.status === "Pending") {
        const li = document.createElement("li");
        li.textContent = `${appt.name} — ${appt.date} at ${appt.time} [${appt.status}]`;

        const approveBtn = document.createElement("button");
        approveBtn.textContent = "Approve";
        approveBtn.addEventListener("click", () => updateStatus(index, "Approved"));

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.addEventListener("click", () => updateStatus(index, "Rejected"));

        const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.style.marginLeft = "10px";
  deleteBtn.addEventListener("click", function() {
  deleteAppointment(index);
});
li.appendChild(deleteBtn);

        li.appendChild(approveBtn);
        li.appendChild(rejectBtn);
        pendingList.appendChild(li);
      }
    });
  }

  // ✅ Update appointment status
  function updateStatus(index, newStatus) {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    appointments[index].status = newStatus;
    localStorage.setItem("appointments", JSON.stringify(appointments));
    displayPendingAppointments();
    displayAppointments();
  }
  function deleteAppointment(index) {
  let appointments = JSON.parse(localStorage.getItem("appointments")) || [];

  const confirmDelete = confirm("Are you sure you want to delete this appointment?");
  if (!confirmDelete) return;

  // Remove the selected appointment by index
  appointments.splice(index, 1);

  // Save updated list
  localStorage.setItem("appointments", JSON.stringify(appointments));

  // Refresh both views
  displayAppointments();
  displayPendingAppointments();

  alert("Appointment deleted successfully!");
}

  // ✅ Admin login logic
  adminLoginBtn.addEventListener("click", function() {
    const enteredPassword = adminPasswordInput.value.trim();

    if (enteredPassword === ADMIN_PASSWORD) {
      loginMessage.textContent = "✅ Access granted!";
      adminPanel.style.display = "block";
      displayPendingAppointments();
    } else {
      loginMessage.textContent = "❌ Incorrect password!";
    }
  });

  displayAppointments();
});
