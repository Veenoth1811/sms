document.addEventListener("DOMContentLoaded", () => {
  fetchStudents();
  fetchStudentMarks();
});

// Fetch student details and populate the dropdown
async function fetchStudents() {
  try {
    const resUsers = await fetch("http://localhost:3000/users/getUsers", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const users = await resUsers.json();

    const select = document.getElementById("studentSelect");
    select.innerHTML = `<option value="">Select Student</option>`;

    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user._id; // Use student ID
      option.textContent = user.name;
      select.appendChild(option);
    });
  } catch (error) {
    console.error("Error fetching students:", error);
  }
}

let selectedStudent = null;

// When selecting a student, fetch their marks
document.getElementById("studentSelect").addEventListener("change", async (event) => {
  const studentId = event.target.value;
  console.log(studentId);
  selectedStudent = studentId;
  if (!studentId) return;

  try {
    const resMarks = await fetch(`http://localhost:3000/marks/getMarks/${studentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(resMarks);
    const student = await resMarks.json();

    if (student.marks) {
      document.getElementById("tamil").value = student.marks.Tamil || 0;
      document.getElementById("english").value = student.marks.English || 0;
      document.getElementById("maths").value = student.marks.Maths || 0;
      document.getElementById("science").value = student.marks.Science || 0;
      document.getElementById("social").value = student.marks.Social || 0;
    }
  } catch (error) {
    console.error("Error fetching student marks:", error);
  }
});

// Open Popup for adding marks
document.getElementById("openPopup").addEventListener("click", () => {
  document.getElementById("marksPopup").style.display = "block";
});

// Close Popup
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("marksPopup").style.display = "none";
});

// Submit Marks
document.getElementById("submitMarks").addEventListener("click", async () => {
  const studentId = document.getElementById("studentSelect").value;
  console.log(studentId);
  console.log("I clicked the submitMarks");
  console.log(studentId);
  if (!studentId) {
    alert("Please select a student");
    return;
  }

  const marks = {
    Tamil: parseInt(document.getElementById("tamil").value) || 0,
    English: parseInt(document.getElementById("english").value) || 0,
    Maths: parseInt(document.getElementById("maths").value) || 0,
    Science: parseInt(document.getElementById("science").value) || 0,
    Social: parseInt(document.getElementById("social").value) || 0,
  };

  try {
    const res = await fetch("http://localhost:3000/marks/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ selectedStudent: studentId, ...marks }),
    });

    const data = await res.json();
    if (res.ok) {
      document.getElementById("marksPopup").style.display = "none";
      fetchStudentMarks();
    } else {
      alert(data.message || "Error saving marks");
    }
  } catch (error) {
    console.error("Error submitting marks:", error);
    alert("An error occurred. Please try again.");
  }
});

// Fetch student marks and populate table
async function fetchStudentMarks() {
  try {
    const resMarks = await fetch("http://localhost:3000/marks/getMarks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const students = await resMarks.json();

    const table = document.getElementById("resultsTable");
    table.innerHTML = `
      <tr>
        <th>Register No</th>
        <th>Name</th>
        <th>Tamil</th>
        <th>English</th>
        <th>Maths</th>
        <th>Science</th>
        <th>Social</th>
        <th>Total</th>
        <th>Grade</th>
        <th>Actions</th>
      </tr>
    `;

    students.forEach((student) => updateTable(student));
  } catch (error) {
    console.error("Error fetching student marks:", error);
  }
}

// Function to update the table
function updateTable(student) {
  const table = document.getElementById("resultsTable");

  const row = document.createElement("tr");

  // Check if the student has failed any subject
  const hasFailed = Object.values(student.marks).some((mark) => mark < 35);

  // Helper function to determine the color for individual subjects
  const getSubjectColorClass = (mark) => (mark < 35 ? "red" : "green");

  // Determine the color class for total and grade based on whether the student has failed
  const totalGradeColorClass = hasFailed ? "red" : "green";

  console.log("159",student._id);

  row.innerHTML = `
    <td>${student.register}</td>
    <td>${student.name}</td>
    <td class="${getSubjectColorClass(student.marks.Tamil)}">${student.marks.Tamil}</td>
    <td class="${getSubjectColorClass(student.marks.English)}">${student.marks.English}</td>
    <td class="${getSubjectColorClass(student.marks.Maths)}">${student.marks.Maths}</td>
    <td class="${getSubjectColorClass(student.marks.Science)}">${student.marks.Science}</td>
    <td class="${getSubjectColorClass(student.marks.Social)}">${student.marks.Social}</td>
    <td class="${totalGradeColorClass}">${student.total}</td>
    <td class="${totalGradeColorClass}">${student.grade}</td>

    <td>
      <button class="update-btn" id="studentSelect" onclick="editStudent('${student._id}')">Update</button>
      <button class="delete-btn" onclick="deleteStudent('${student._id}')">Delete</button>
    </td>
  `;console.log(student._id);;

  table.appendChild(row);
}

// DELETE Student Function
async function deleteStudent(studentId) {
  if (!confirm("Are you sure you want to delete this student's marks?")) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/marks/deleteMarks/${studentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      alert(data.message || "Student marks deleted successfully");
      fetchStudentMarks();
    } else {
      alert(data.message || "Error deleting student marks");
    }
  } catch (error) {
    console.error("Error deleting student:", error);
  }
}

// EDIT Student Function
async function editStudent(studentId) {
  console.log(studentId);
  try {
    const res = await fetch(`http://localhost:3000/marks/getMarks/${studentId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const student = await res.json();
console.log("216",student);

    if (student) {
      // Set the selectedStudent value
      selectedStudent = studentId;

      // Update the dropdown to reflect the selected student
      document.getElementById("studentSelect").value = student.name;

      // Populate the marks fields
      document.getElementById("tamil").value = student.marks.Tamil || 0;
      document.getElementById("english").value = student.marks.English || 0;
      document.getElementById("maths").value = student.marks.Maths || 0;
      document.getElementById("science").value = student.marks.Science || 0;
      document.getElementById("social").value = student.marks.Social || 0;

      // Show the popup
      document.getElementById("marksPopup").style.display = "block";
    }
  } catch (error) {
    console.error("Error fetching student details:", error);
    console.log(error);
  }
}