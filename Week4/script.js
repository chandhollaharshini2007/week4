
let students = JSON.parse(
    localStorage.getItem("students")
) || [];

const form = document.getElementById("studentForm");
const studentList = document.getElementById("studentList");

function saveData() {
    localStorage.setItem(
        "students",
        JSON.stringify(students)
    );
}

function displayStudents() {
    studentList.innerHTML = "";

    const searchValue =
        document.getElementById("search").value.toLowerCase();

    const filterValue =
        document.getElementById("filter").value;

    const filteredStudents = students.filter(student => {
        const matchesSearch =
            student.name.toLowerCase().includes(searchValue) ||
            student.roll.toLowerCase().includes(searchValue);

        const matchesDepartment =
            filterValue === "" ||
            student.department.toLowerCase() ===
            filterValue.toLowerCase();

        return matchesSearch && matchesDepartment;
    });

    filteredStudents.forEach(student => {
        const index = students.indexOf(student);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.roll)}</td>
            <td>${escapeHTML(student.department)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>
                <button class="edit"
                    onclick="editStudent(${index})">
                    Edit
                </button>

                <button class="delete"
                    onclick="deleteStudent(${index})">
                    Delete
                </button>
            </td>
        `;

        studentList.appendChild(row);
    });

    document.getElementById("count").textContent =
        "Total Students: " + students.length;
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const department =
        document.getElementById("department").value.trim();
    const email = document.getElementById("email").value.trim();

    const editIndex =
        document.getElementById("editIndex").value;

    if (!name || !roll || !department || !email) {
        alert("Please fill all fields");
        return;
    }

    const duplicate = students.some((student, index) =>
        student.roll.toLowerCase() === roll.toLowerCase() &&
        String(index) !== editIndex
    );

    if (duplicate) {
        alert("Roll number already exists!");
        return;
    }

    const student = {
        name,
        roll,
        department,
        email
    };

    if (editIndex !== "") {
        students[Number(editIndex)] = student;
        alert("Student Updated Successfully!");
    } else {
        students.push(student);
        alert("Student Added Successfully!");
    }

    saveData();
    form.reset();

    document.getElementById("editIndex").value = "";
    document.getElementById("formTitle").textContent =
        "Add Student";
    document.getElementById("submitBtn").textContent =
        "Add Student";

    displayStudents();
});

function editStudent(index) {
    const student = students[index];

    document.getElementById("name").value = student.name;
    document.getElementById("roll").value = student.roll;
    document.getElementById("department").value =
        student.department;
    document.getElementById("email").value = student.email;

    document.getElementById("editIndex").value = index;

    document.getElementById("formTitle").textContent =
        "Edit Student";
    document.getElementById("submitBtn").textContent =
        "Update Student";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteStudent(index) {
    if (confirm("Are you sure you want to delete this student?")) {
        students.splice(index, 1);
        saveData();
        displayStudents();
        alert("Student Deleted Successfully!");
    }
}

document.getElementById("search").addEventListener(
    "input", displayStudents
);

document.getElementById("filter").addEventListener(
    "change", displayStudents
);

displayStudents();
