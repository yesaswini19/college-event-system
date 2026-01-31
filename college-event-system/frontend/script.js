const API = "https://college-event-system-h9i6.vercel.app";

// --- HELPER FUNCTION ---
async function getStudentIdByRoll(roll) {
  try {
    const res = await fetch(API + "/students/roll/" + roll);
    if (res.status === 404) return null;
    const data = await res.json();
    return data.student_id; 
  } catch (err) {
    console.error("Lookup error:", err);
    return null;
  }
}

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

// ✅ UPDATED: Now collects and sends College Name and Phone Number
async function registerEvent() {
  const rollNo = document.getElementById("studentId").value; 
  const eventId = document.getElementById("eventSelect").value;
  
  // New input fields required by your updated backend
  const collegeName = document.getElementById("collegeName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  if(!rollNo || !eventId || !collegeName || !phoneNumber) {
    return alert("❌ Please fill all fields: Roll No, Event, College Name, and Phone Number");
  }

  const studentId = await getStudentIdByRoll(rollNo);
  if (!studentId) return alert("❌ Roll Number not found. Please create a profile first.");

  fetch(API + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      student_id: studentId, 
      event_id: eventId,
      college_name: collegeName,
      phone_number: phoneNumber
    })
  })
  .then(res => res.json())
  .then(data => {
    if(data.message.includes("successful")) {
        alert("✅ " + data.message);
    } else {
        alert("❌ " + data.message);
    }
  });
}

async function editStudent() {
  const currentRoll = document.getElementById("searchRoll").value; 
  const newName = document.getElementById("newStudentName").value;
  const newRoll = document.getElementById("newStudentRoll").value;

  if(!currentRoll || !newName || !newRoll) return alert("Please fill all fields");

  const studentId = await getStudentIdByRoll(currentRoll);
  if (!studentId) return alert("❌ Current Roll Number not found!");

  fetch(API + "/students/" + studentId, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName, roll_no: newRoll })
  })
  .then(res => res.json())
  .then(data => alert("✅ " + data.message));
}

// --- 2. ORGANIZER FUNCTIONS ---
function addEvent() {
  const title = document.getElementById("eventTitle").value;
  const description = document.getElementById("eventDesc").value;
  const date = document.getElementById("eventDate").value;

  fetch(API + "/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description, event_date: date })
  }).then(res => res.json()).then(data => {
    alert("Event Added!");
    loadEventsForOrganizer();
    loadEventsForCSV();
  });
}

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

// --- 3. DROPDOWN LOADERS ---
function loadEventsForStudents() {
  fetch(API + "/events")
    .then(res => res.json())
    .then(events => {
      const select = document.getElementById("eventSelect");
      if (!select) return;
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
      const filtered = data.filter(r => r.title === eventTitle);
      if (filtered.length === 0) return alert("No registrations for this event.");

      let csv = "Student Name,Roll No,College,Phone,Event Title\n";
      filtered.forEach(r => { 
        csv += `${r.name},${r.roll_no},${r.college_name},${r.phone_number},${r.title}\n`; 
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${eventTitle}_Registrations.csv`;
      link.click();
    });
}

// Updated viewRegistrations
function viewRegistrations() {
  fetch(API + "/registrations")
    .then(res => res.json())
    .then(data => {
      // FIX: Check if data is an array
      if (!Array.isArray(data)) {
        console.error("Backend error:", data.message);
        return alert("Error loading list: " + (data.message || "Unknown error"));
      }

      const list = document.getElementById("list");
      list.innerHTML = "";
      data.forEach(r => {
        list.innerHTML += `
          <li style="margin-bottom: 10px; border-bottom: 1px solid #ccc; padding-bottom: 5px;">
            <strong>${r.name}</strong> (${r.roll_no})<br>
            College: ${r.college_name} | Phone: ${r.phone_number}<br>
            Event: <i>${r.title}</i>
          </li>`;
      });
    });
}

// Updated downloadCSV
function downloadCSV() {
  fetch(API + "/registrations")
    .then(res => res.json())
    .then(data => {
      // FIX: Check if data is an array
      if (!Array.isArray(data)) {
        return alert("Could not download: " + (data.message || "Server Error"));
      }
      
      if (data.length === 0) return alert("No registrations found");
      // ... rest of your code ...
    });
}