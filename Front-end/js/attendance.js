document.addEventListener("DOMContentLoaded", () => {
    loadAttendance();

    // Add event listener to the Save button
    document.querySelector("#save").addEventListener("click", saveAttendance);
});

async function loadAttendance() {
    try {
        const response = await fetch("http://localhost:3000/users/getUsers",{
            headers:{
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
    });
        const students = await response.json();
        console.log(students);
        
        if (response.ok) {
            displayStudents(students);
        }
    } catch (error) {
        console.error(error);
        alert("Error loading student data.");
    }
}

function displayStudents(students) {
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = ""; // Clear previous entries

    students.forEach((student, index) => {
        const tr = document.createElement("tr");

        const td1 = document.createElement("td");
        td1.textContent = index + 1;

        const td2 = document.createElement("td");
        td2.textContent = student.name;

        const td3 = document.createElement("td");
        td3.textContent = student.register;

        const td4 = document.createElement("td");

        const td5=document.createElement("td");

        // Radio button for Present
     
        const presentRadio = document.createElement("input");
        presentRadio.type = "radio";
        presentRadio.name = `attendance-${index}`;
        presentRadio.value = "Present";
        presentRadio.dataset.id = student._id;
        presentRadio.dataset.name = student.name;
        presentRadio.dataset.register = student.register;
        presentRadio.checked = student.status === "Present";

        // Radio button for Absent
        
        const absentRadio = document.createElement("input");
        absentRadio.type = "radio";
        absentRadio.name = `attendance-${index}`;
        absentRadio.value = "Absent";
        absentRadio.dataset.id = student._id;
        absentRadio.dataset.name = student.name;
        absentRadio.dataset.register = student.register;
        absentRadio.checked = student.status === "Absent";

        // Append radio buttons and labels
        td4.append(presentRadio);
        td5.append( absentRadio);
        tr.append(td1, td2, td3, td4,td5);
        tbody.appendChild(tr);
    });

    // Call updateCount initially
    updateCount();
}

// Function to send updated attendance data to backend
async function saveAttendance() {
    let attendanceData = [];

    document.querySelectorAll('input[type="radio"]:checked').forEach((radio) => {
        attendanceData.push({
            studentId: radio.dataset.id,
            name: radio.dataset.name,
            status: radio.value,
            register: radio.dataset.register,
        });
    });

    try {
        const response = await fetch("http://localhost:3000/attendance/markAttendance", {
            method: "POST",
            headers: { "Content-Type": "application/json",Authorization: `Bearer ${localStorage.getItem("token")}`},
            body: JSON.stringify(attendanceData),
        });

        if (!response.ok) throw new Error("Failed to update attendance");

        alert("Attendance saved successfully!");
        updateCount();
    } catch (error) {
        console.error(error);
        alert("Error updating attendance.");
    }
}

// Function to update present/absent count
function updateCount() {
    let presentCount = document.querySelectorAll('input[type="radio"][value="Present"]:checked').length;
    let absentCount = document.querySelectorAll('input[type="radio"][value="Absent"]:checked').length;
    let totalStudents = document.querySelectorAll("#tbody tr").length;

    document.querySelector("#total-students").textContent = totalStudents;
    document.querySelector("#present-students").textContent = presentCount;
    document.querySelector("#absent-students").textContent = absentCount;
}
