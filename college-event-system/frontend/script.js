const API = "https://college-event-system-production.up.railway.app";

// --- 1. STUDENT FUNCTIONS ---
function addStudent() {
  const name = document.getElementById("studentName").value;
  const roll = document.getElementById("rollNo").value;
  if(!name || !roll) return alert("Please fill all fields");

  fetch(API + "/students", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, roll_no: roll })
  }).then(res => res.json()).then(data => {
    alert(data.message || "Student added successfully");
  });
}

function registerEvent() {
  const studentId = document.getElementById("studentId").value;
  const eventId = document.getElementById("eventSelect").value;
  if(!studentId || !eventId) return alert("Select event and enter ID");

  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ student_id: studentId, event_id: eventId })
  }).then(res => res.json()).then(data => alert(data.message));
}

// --- 2. ORGANIZER FUNCTIONS ---
function addEvent() {
  const title = document.getElementById("eventTitle").value;
  const description = document.getElementById("eventDesc").value;
  const date = document.getElementById("eventDate").value;

  fetch(API + "/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, date })
  }).then(res => res.json()).then(data => {
    alert("Event Added!");
    loadEventsForOrganizer();
    loadEventsForCSV();
  });
}

// NEW: Added missing deleteEvent function
function deleteEvent() {
  const eventId = document.getElementById("deleteEventSelect").value;
  if(!eventId) return alert("Please select an event to delete");

  fetch(API + "/events/" + eventId, {
    method: "DELETE"
  }).then(res => res.json()).then(data => {
    alert(data.message || "Event deleted");
    loadEventsForOrganizer();
    loadEventsForCSV();
  });
}

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

// --- 3. DROPDOWN LOADERS ---
function loadEventsForStudents() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("eventSelect");
      select.innerHTML = `<option value="">-- Select Event --</option>`;
      events.forEach(e => {
        select.innerHTML += `<option value="${e.event_id}">${e.title}</option>`;
      });
    });
}

function loadEventsForOrganizer() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("deleteEventSelect");
      if (!select) return;
      select.innerHTML = `<option value="">-- Select Event --</option>`;
      events.forEach(e => {
        select.innerHTML += `<option value="${e.event_id}">${e.title}</option>`;
      });
    });
}

function loadEventsForCSV() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("csvEventSelect");
      if (!select) return;
      select.innerHTML = `<option value="">-- Select Event --</option>`;
      events.forEach(e => {
        select.innerHTML += `<option value="${e.event_id}">${e.title}</option>`;
      });
    });
}

// --- 4. CSV EXPORT LOGIC ---
function downloadCSVByEvent() {
  const select = document.getElementById("csvEventSelect");
  const eventId = select.value;
  const eventTitle = select.options[select.selectedIndex].text;

  if (!eventId) return alert("Please select an event");

  fetch(API + "/registrations")
    .then(res => res.json())
    .then(data => {
      // DEBUG: This will show you what the data actually looks like in the Console
      console.log("Registrations Data:", data);
      console.log("Searching for Event ID:", eventId);

      // We filter by checking the event_id or the title to be safe
      const filtered = data.filter(r => {
          const matchId = String(r.event_id) === String(eventId);
          const matchTitle = r.title === eventTitle;
          return matchId || matchTitle;
      });

      if (filtered.length === 0) {
        return alert("No registrations for this event. Check Console (F12) for data details.");
      }

      let csv = "Student Name,Roll No,Event Title\n";
      filtered.forEach(r => { csv += `${r.name},${r.roll_no},${r.title}\n`; });

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${eventTitle}_Registrations.csv`;
      link.click();
    });
}

function downloadCSV() {
  fetch(API + "/registrations")
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) return alert("No registrations found");
      let csv = "Student Name,Roll No,Event Title\n";
      data.forEach(r => { csv += `${r.name},${r.roll_no},${r.title}\n`; });
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "All_Registrations.csv";
      link.click();
    });
}