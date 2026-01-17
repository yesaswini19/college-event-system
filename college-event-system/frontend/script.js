const API = "https://college-event-system-production.up.railway.app";

/* ================= STUDENT FUNCTIONS ================= */

// Add Student
function addStudent() {
  const name = document.getElementById("studentName").value;
  const roll = document.getElementById("rollNo").value;

  fetch(API + "/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roll_no: roll })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Student added successfully");
    document.getElementById("studentName").value = "";
    document.getElementById("rollNo").value = "";
  });
}

// Edit Student
function editStudent() {
  fetch(API + "/students/" + document.getElementById("editStudentId").value, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("editStudentName").value,
      roll_no: document.getElementById("editStudentRoll").value
    })
  })
  .then(res => res.json())
  .then(data => alert(data.message || "Student updated"));
}

// Delete Student
function deleteStudent() {
  fetch(API + "/students/" + document.getElementById("deleteStudentId").value, {
    method: "DELETE"
  })
  .then(res => res.json())
  .then(data => alert(data.message || "Student deleted"));
}

// Load Events for Students
function loadEventsForStudents() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("eventSelect");
      select.innerHTML = `<option value="">-- Select Event --</option>`;

      events.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.event_id;
        opt.textContent = `${e.title} (${e.event_date})`;
        select.appendChild(opt);
      });
    });
}

// Register Event
function registerEvent() {
  const studentId = document.getElementById("studentId").value;
  const eventId = document.getElementById("eventSelect").value;

  if (!studentId || !eventId) {
    alert("❌ Enter Student ID and select Event");
    return;
  }

  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, event_id: eventId })
  })
  .then(res => res.json())
  .then(data => alert(data.message || "Registered successfully"));
}

/* ================= ORGANIZER FUNCTIONS ================= */

// Load Events for Organizer
function loadEventsForOrganizer() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("deleteEventSelect");
      select.innerHTML = `<option value="">-- Select Event to Delete --</option>`;

      events.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.event_id;
        opt.textContent = `${e.title} (${e.event_date})`;
        select.appendChild(opt);
      });
    });
}

// Add Event
function addEvent() {
  fetch(API + "/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: document.getElementById("eventTitle").value,
      description: document.getElementById("eventDesc").value,
      event_date: document.getElementById("eventDate").value
    })
  })
  .then(res => res.json())
  .then(data => {
    alert(data.message || "Event added");
    loadEventsForStudents();
    loadEventsForOrganizer();
    document.getElementById("eventTitle").value = "";
    document.getElementById("eventDesc").value = "";
    document.getElementById("eventDate").value = "";
  });
}

// Delete Event
function deleteEvent() {
  const select = document.getElementById("deleteEventSelect");
  const eventId = select.value;

  if (!eventId) {
    alert("❌ Please select an event");
    return;
  }

  fetch(API + "/events/" + eventId, { method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      alert(data.message || "Event deleted");

      // 🔥 HARD REFRESH FROM SERVER
      loadEventsForOrganizer();
      loadEventsForStudents();
    });
}


// View Registrations
function viewRegistrations() {
  fetch(API + "/registrations")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";
      data.forEach(r => {
        list.innerHTML += `<li>${r.name} (${r.roll_no}) → ${r.title}</li>`;
      });
    });
}
