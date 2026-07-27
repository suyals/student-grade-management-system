const STORAGE_KEY = "grade-management-system";

let studentForm;
let marksForm;
let studentSelect;
let studentTableBody;
let studentMessage;
let marksMessage;
let students = [];

function initApp() {
  studentForm = document.getElementById("studentForm");
  marksForm = document.getElementById("marksForm");
  studentSelect = document.getElementById("studentSelect");
  studentTableBody = document.getElementById("studentTableBody");
  studentMessage = document.getElementById("studentMessage");
  marksMessage = document.getElementById("marksMessage");

  if (!studentForm || !marksForm || !studentSelect || !studentTableBody || !studentMessage || !marksMessage) {
    return;
  }

  students = loadStudents();
  students.forEach((student) => updateStudentMetrics(student));
  renderStudents();

  studentForm.onsubmit = function (event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();

    if (!name || !rollNumber) {
      showMessage(studentMessage, "Please enter both student name and roll number.", true);
      return;
    }

    const existingRoll = students.some((student) => student.rollNumber === rollNumber);
    if (existingRoll) {
      showMessage(studentMessage, "A student with this roll number already exists.", true);
      return;
    }

    const newStudent = {
      id: createStudentId(),
      name,
      rollNumber,
      marks: { math: 0, science: 0, english: 0 },
      average: 0,
      grade: "F",
      status: "Fail",
    };

    students.push(newStudent);
    saveStudents();
    renderStudents();
    studentForm.reset();
    showMessage(studentMessage, `${name} added successfully.`);
  };

  marksForm.onsubmit = function (event) {
    event.preventDefault();

    const studentId = studentSelect.value;
    const maths = Number(document.getElementById("maths").value);
    const science = Number(document.getElementById("science").value);
    const english = Number(document.getElementById("english").value);

    if (!studentId) {
      showMessage(marksMessage, "Please select a student first.", true);
      return;
    }

    if ([maths, science, english].some((mark) => Number.isNaN(mark) || mark < 0 || mark > 100)) {
      showMessage(marksMessage, "Each mark must be a number between 0 and 100.", true);
      return;
    }

    const student = students.find((item) => item.id === studentId);
    if (!student) {
      showMessage(marksMessage, "Selected student could not be found.", true);
      return;
    }

    student.marks = { math: maths, science, english };
    updateStudentMetrics(student);
    saveStudents();
    renderStudents();
    marksForm.reset();
    showMessage(marksMessage, `Marks updated for ${student.name}.`);
  };

  window.gradeMgmtReady = true;
}

function createStudentId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `student-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function loadStudents() {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveStudents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function calculateGrade(average) {
  if (average >= 90) return "A+";
  if (average >= 80) return "A";
  if (average >= 70) return "B";
  if (average >= 60) return "C";
  if (average >= 50) return "D";
  return "F";
}

function calculateAverage(marks) {
  return (marks.math + marks.science + marks.english) / 3;
}

function updateStudentMetrics(student) {
  const average = calculateAverage(student.marks);
  student.average = Number(average.toFixed(1));
  student.grade = calculateGrade(student.average);
  student.status = student.average >= 40 ? "Pass" : "Fail";
}

function renderStudents() {
  if (!studentTableBody || !studentSelect) {
    return;
  }

  studentTableBody.innerHTML = "";
  studentSelect.innerHTML = '<option value="">Choose a student</option>';

  if (students.length === 0) {
    studentTableBody.innerHTML = '<tr><td colspan="8">No students added yet.</td></tr>';
    updateSummary();
    return;
  }

  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.rollNumber}</td>
      <td>${student.marks.math}</td>
      <td>${student.marks.science}</td>
      <td>${student.marks.english}</td>
      <td>${student.average.toFixed(1)}</td>
      <td>${student.grade}</td>
      <td class="${student.status === "Pass" ? "status-pass" : "status-fail"}">${student.status}</td>
    `;
    studentTableBody.appendChild(row);

    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} (Roll ${student.rollNumber})`;
    studentSelect.appendChild(option);
  });

  updateSummary();
}

function updateSummary() {
  const totalStudents = document.getElementById("totalStudents");
  const topperName = document.getElementById("topperName");
  const classAverage = document.getElementById("classAverage");

  totalStudents.textContent = students.length;

  if (students.length === 0) {
    topperName.textContent = "—";
    classAverage.textContent = "—";
    return;
  }

  const topper = [...students].sort((a, b) => b.average - a.average)[0];
  topperName.textContent = `${topper.name} (${topper.average.toFixed(1)})`;

  const averageScores = students.reduce((sum, student) => sum + student.average, 0);
  const avg = averageScores / students.length;
  classAverage.textContent = `${avg.toFixed(1)}%`;
}

function showMessage(element, text, isError = false) {
  element.textContent = text;
  element.style.color = isError ? "#fb7185" : "#5eead4";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
