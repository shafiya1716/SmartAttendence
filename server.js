const express = require("express");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("data/public"));

// File path
const filePath = "./data/attendance.json";

// Create file if not exists
if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]");
}

// Load data
function loadData() {
    return JSON.parse(fs.readFileSync(filePath));
}

// Save data
function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// POST - Save attendance
app.post("/submit-attendance", (req, res) => {
    let records = loadData();
    records.push(req.body);
    saveData(records);

    res.json({ success: true, message: "Attendance saved!" });
});

// GET - View all attendance
app.get("/attendance", (req, res) => {
    res.json(loadData());
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
