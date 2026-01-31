require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
// Add this right after your db connection logic
db.query("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS college_name VARCHAR(255)", (err) => {
    console.log(err ? "Column exists or error: " + err.message : "College column added!");
});
db.query("ALTER TABLE registrations ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)", (err) => {
    console.log(err ? "Column exists or error: " + err.message : "Phone column added!");
});
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("College Event System Backend Running");
});
/* ================= STUDENTS ================= */
// --- ADD THIS TO SERVER.JS ---
// View All Students (Required for the frontend to find IDs by Roll No)
app.get("/students", (req, res) => {
  db.query("SELECT * FROM students", (err, result) => {
    if (err) {
      console.error("Fetch Students Error:", err);
      return res.status(500).json({ message: "Failed to fetch students" });
    }
    res.json(result);
  });
});

// Get a single student's ID by their Roll Number
app.get("/students/roll/:roll_no", (req, res) => {
  const roll = req.params.roll_no;
  db.query("SELECT student_id FROM students WHERE roll_no = ?", [roll], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length === 0) return res.status(404).json({ message: "Student not found" });
    res.json(result[0]); // Returns just { "student_id": 12 }
  });
});
// Add Student
// Inside your Add Student route
app.post("/students", (req, res) => {
  const { name, roll_no } = req.body;

  db.query(
    "INSERT INTO students (name, roll_no) VALUES (?, ?)",
    [name, roll_no],
    (err, result) => {
      if (err) {
        // This prints the real error in your VS Code terminal (look there!)
        console.error("DEBUGGING DATABASE ERROR:", err); 
        
        // This makes the browser alert tell you the EXACT reason
        return res.status(500).json({ 
          message: "Database Error: " + err.sqlMessage 
        });
      }
      res.json({ message: "Student added successfully" });
    }
  );
});

// Edit Student
app.put("/students/:id", (req, res) => {
  const { name, roll_no } = req.body;

  db.query(
    "UPDATE students SET name=?, roll_no=? WHERE student_id=?",
    [name, roll_no, req.params.id],
    err => {
      if (err) return res.status(500).json({ message: "Failed to update student" });
      res.json({ message: "Student updated successfully" });
    }
  );
});

// Delete Student (also remove registrations)
app.delete("/students/:id", (req, res) => {
  const studentId = req.params.id;

  db.query(
    "DELETE FROM registrations WHERE student_id=?",
    [studentId],
    err => {
      if (err) return res.status(500).json({ message: "Failed to delete registrations" });

      db.query(
        "DELETE FROM students WHERE student_id=?",
        [studentId],
        err => {
          if (err) return res.status(500).json({ message: "Failed to delete student" });
          res.json({ message: "Student deleted successfully" });
        }
      );
    }
  );
});

/* ================= EVENTS ================= */

// Add Event
app.post("/events", (req, res) => {
  const { title, description, event_date } = req.body;

  db.query(
    "INSERT INTO events (title, description, event_date) VALUES (?, ?, ?)",
    [title, description, event_date],
    err => {
      if (err) return res.status(500).json({ message: "Failed to add event" });
      res.json({ message: "Event added successfully" });
    }
  );
});

// View Events
app.get("/events", (req, res) => {
  db.query("SELECT * FROM events", (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to fetch events" });
    res.json(result);
  });
});

// Edit Event
app.put("/events/:id", (req, res) => {
  const { title, description, event_date } = req.body;

  db.query(
    "UPDATE events SET title=?, description=?, event_date=? WHERE event_id=?",
    [title, description, event_date, req.params.id],
    err => {
      if (err) return res.status(500).json({ message: "Failed to update event" });
      res.json({ message: "Event updated successfully" });
    }
  );
});

// ✅ FIXED Delete Event (NO undefined now)
app.delete("/events/:id", (req, res) => {
  const eventId = req.params.id;

  // Step 1: delete registrations
  db.query(
    "DELETE FROM registrations WHERE event_id=?",
    [eventId],
    err => {
      if (err) return res.status(500).json({ message: "Failed to delete registrations" });

      // Step 2: delete event
      db.query(
        "DELETE FROM events WHERE event_id=?",
        [eventId],
        err => {
          if (err) return res.status(500).json({ message: "Failed to delete event" });
          res.json({ message: "Event deleted successfully" });
        }
      );
    }
  );
});

/* ================= REGISTRATIONS ================= */

// Register Student
app.post("/register", (req, res) => {
  const { student_id, event_id, college_name, phone_number } = req.body;

  db.query(
    `INSERT INTO registrations 
     (student_id, event_id, college_name, phone_number) 
     VALUES (?, ?, ?, ?)`,
    [student_id, event_id, college_name, phone_number],
    err => {
      if (err) {
        console.error("Registration Error:", err);
        return res.status(500).json({ message: "Registration failed" });
      }
      res.json({ message: "Registration successful" });
    }
  );
});


// View Registrations
app.get("/registrations", (req, res) => {
  const sql = `
    SELECT 
      students.name,
      students.roll_no,
      registrations.college_name,
      registrations.phone_number,
      events.title,
      events.description,
      events.event_date
    FROM registrations
    JOIN students ON registrations.student_id = students.student_id
    JOIN events ON registrations.event_id = events.event_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to load registrations" });
    res.json(result);
  });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app; // Add this below app.listen