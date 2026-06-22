const classes = {
    A: ["Aarav", "Aditi", "Arjun", "Divya", "Kiran"],
    B: ["Rohit", "Riya", "Kabir", "Simran", "Vikram"],
    C: ["Meera", "Yash", "Ananya", "Rahul", "Shreya"]
};

function loadStudents() {
    let cls = document.getElementById("classSelect").value;
    let tbody = document.getElementById("studentBody");
    tbody.innerHTML = "";

    classes[cls].forEach((name, i) => {
        let row = `
            <tr>
                <td>${cls}${String(i + 1).padStart(3, '0')}</td>
                <td>${name}</td>
                <td><input type="checkbox" class="att"></td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

document.getElementById("classSelect").addEventListener("change", loadStudents);
window.onload = loadStudents;

document.getElementById("submitBtn").addEventListener("click", async () => {
    let date = document.getElementById("date").value;
    if (!date) return alert("Please select a date!");

    let cls = document.getElementById("classSelect").value;
    let attendance = [];

    document.querySelectorAll("#studentBody tr").forEach(row => {
        attendance.push({
            regNo: row.children[0].innerText,
            name: row.children[1].innerText,
            present: row.children[2].children[0].checked
        });
    });

    const data = { date, class: cls, attendance };

    let res = await fetch("/submit-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    let result = await res.json();
    alert(result.message);
});

document.getElementById("viewRecordsBtn").addEventListener("click", async () => {
    let container = document.getElementById("attendanceRecords");
    let list = document.getElementById("recordsList");

    let res = await fetch("/attendance");
    let records = await res.json();

    if (records.length === 0) {
        list.innerHTML = "<p>No attendance records found.</p>";
        container.style.display = "block";
        return;
    }

    let html = "";
    records.slice().reverse().forEach(rec => {
        let present = rec.attendance.filter(s => s.present).length;
        let total = rec.attendance.length;
        let absent = total - present;

        html += `<div class="record-item">
            <div class="record-date">${rec.date}</div>
            <div class="record-class">Class ${rec.class} | Present: ${present}/${total} (Absent: ${absent})</div>
            <div>`;

        rec.attendance.forEach(s => {
            let status = s.present ? "present" : "absent";
            html += `<span class="record-student student-${status}">${s.name}</span>`;
        });

        html += `</div></div>`;
    });

    list.innerHTML = html;
    container.style.display = "block";
});
