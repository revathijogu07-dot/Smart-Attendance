/* =====================================
   Smart Attendance System
   script.js
   ===================================== */

let students = JSON.parse(localStorage.getItem("students")) || [];

/* -------------------------------
   Add Student
-------------------------------- */

function addStudent() {
    const name = document.getElementById("studentName").value.trim();
    const roll = document.getElementById("studentRoll").value.trim();

    if (name === "" || roll === "") {
        alert("Please enter student name and roll number.");
        return;
    }

    // Check duplicate roll number
    const duplicate = students.some(
        student => student.roll === roll
    );

    if (duplicate) {
        alert("Roll number already exists.");
        return;
    }

    const student = {
        name: name,
        roll: roll,
        status: "Not Marked"
    };

    students.push(student);

    saveData();

    // Clear input fields
    document.getElementById("studentName").value = "";
    document.getElementById("studentRoll").value = "";

    displayStudents();
}


/* -------------------------------
   Mark Attendance
-------------------------------- */

function markAttendance(index, status) {

    students[index].status = status;

    saveData();
    displayStudents();
}


/* -------------------------------
   Delete Student
-------------------------------- */

function deleteStudent(index) {

    const confirmation = confirm(
        "Are you sure you want to delete this student?"
    );

    if (confirmation) {
        students.splice(index, 1);

        saveData();
        displayStudents();
    }
}


/* -------------------------------
   Display Students
-------------------------------- */

function displayStudents() {

    const table = document.getElementById("studentTable");
    const searchInput = document.getElementById("search");

    const search = searchInput
        ? searchInput.value.toLowerCase()
        : "";

    table.innerHTML = "";

    students.forEach((student, index) => {

        // Search student
        if (
            !student.name.toLowerCase().includes(search) &&
            !student.roll.toLowerCase().includes(search)
        ) {
            return;
        }

        let statusHTML = "";

        if (student.status === "Present") {

            statusHTML =
                '<span class="present">Present</span>';

        } else if (student.status === "Absent") {

            statusHTML =
                '<span class="absent">Absent</span>';

        } else {

            statusHTML = "Not Marked";
        }

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.roll}</td>

            <td>${student.name}</td>

            <td>${statusHTML}</td>

            <td>
                <div class="actions">

                    <button
                        class="present-btn"
                        onclick="markAttendance(${index}, 'Present')">
                        Present
                    </button>

                    <button
                        class="absent-btn"
                        onclick="markAttendance(${index}, 'Absent')">
                        Absent
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteStudent(${index})">
                        Delete
                    </button>

                </div>
            </td>
        `;

        table.appendChild(row);
    });

    updateStatistics();
}


/* -------------------------------
   Update Statistics
-------------------------------- */

function updateStatistics() {

    const total = students.length;

    const present = students.filter(
        student => student.status === "Present"
    ).length;

    const absent = students.filter(
        student => student.status === "Absent"
    ).length;

    let percentage = 0;

    if (total > 0) {
        percentage = Math.round(
            (present / total) * 100
        );
    }

    document.getElementById("totalStudents")
        .textContent = total;

    document.getElementById("presentStudents")
        .textContent = present;

    document.getElementById("absentStudents")
        .textContent = absent;

    document.getElementById("attendancePercentage")
        .textContent = percentage + "%";
}


/* -------------------------------
   Save Data
-------------------------------- */

function saveData() {

    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}


/* -------------------------------
   Download CSV Report
-------------------------------- */

function downloadReport() {

    if (students.length === 0) {
        alert("No students available.");
        return;
    }

    let csv =
        "Roll Number,Student Name,Attendance Status\n";

    students.forEach(student => {

        csv +=
            `"${student.roll}","${student.name}","${student.status}"\n`;
    });

    const blob = new Blob(
        [csv],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "attendance_report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
}


/* -------------------------------
   Search Students
-------------------------------- */

function searchStudents() {
    displayStudents();
}


/* -------------------------------
   Initialize Application
-------------------------------- */

document.addEventListener("DOMContentLoaded", function () {

    displayStudents();

});
