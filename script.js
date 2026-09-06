/**
 * AcademiaPro — Java OOP Student Grade Management System
 * Architecture: Object-Oriented Principles (Encapsulation, Inheritance, Polymorphism, Abstraction)
 */

const STORAGE_KEY = "academiapro-grade-records-v2";

// Global State
let students = [];
let subjectChartInstance = null;
let gradeChartInstance = null;

// Initial Sample Demo Dataset
const DEMO_STUDENTS = [
  {
    id: "std-001",
    name: "Elena Rostova",
    rollNumber: "101",
    studentClass: "Grade 10-A",
    attendance: 98,
    email: "elena.rostova@academia.edu",
    marks: { math: 98, science: 95, english: 92, computer: 99, social: 94 }
  },
  {
    id: "std-002",
    name: "Marcus Aurelius Vance",
    rollNumber: "102",
    studentClass: "Grade 10-A",
    attendance: 94,
    email: "marcus.vance@academia.edu",
    marks: { math: 88, science: 84, english: 90, computer: 92, social: 86 }
  },
  {
    id: "std-003",
    name: "Sophia Chen",
    rollNumber: "103",
    studentClass: "Grade 10-B",
    attendance: 96,
    email: "sophia.chen@academia.edu",
    marks: { math: 92, science: 89, english: 85, computer: 96, social: 91 }
  },
  {
    id: "std-004",
    name: "David K. Miller",
    rollNumber: "104",
    studentClass: "Grade 10-A",
    attendance: 88,
    email: "david.miller@academia.edu",
    marks: { math: 74, science: 68, english: 78, computer: 80, social: 72 }
  },
  {
    id: "std-005",
    name: "Aaliyah Patel",
    rollNumber: "105",
    studentClass: "Grade 10-B",
    attendance: 91,
    email: "aaliyah.p@academia.edu",
    marks: { math: 82, science: 79, english: 88, computer: 85, social: 84 }
  },
  {
    id: "std-006",
    name: "Jordan Lee",
    rollNumber: "106",
    studentClass: "Grade 10-A",
    attendance: 72,
    email: "jordan.lee@academia.edu",
    marks: { math: 45, science: 52, english: 48, computer: 58, social: 42 }
  }
];

// DOM Element References
let studentForm;
let marksForm;
let studentSelect;
let studentTableBody;
let tableSearchInput;
let gradeFilterSelect;
let statusFilterSelect;
let sortBySelect;
let resetFiltersBtn;
let clearSearchBtn;
let themeToggleBtn;
let demoDataBtn;
let exportCsvBtn;
let clearAllDataBtn;
let reportCardModal;
let editStudentModal;
let oopArchitectureModal;
let oopArchitectureBtn;

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
  initDomReferences();
  initTheme();
  checkJavaBackendHealth();
  loadData();
  attachEventListeners();
  refreshAllViews();
});

function initDomReferences() {
  studentForm = document.getElementById("studentForm");
  marksForm = document.getElementById("marksForm");
  studentSelect = document.getElementById("studentSelect");
  studentTableBody = document.getElementById("studentTableBody");
  tableSearchInput = document.getElementById("tableSearchInput");
  gradeFilterSelect = document.getElementById("gradeFilterSelect");
  statusFilterSelect = document.getElementById("statusFilterSelect");
  sortBySelect = document.getElementById("sortBySelect");
  resetFiltersBtn = document.getElementById("resetFiltersBtn");
  clearSearchBtn = document.getElementById("clearSearchBtn");
  themeToggleBtn = document.getElementById("themeToggleBtn");
  demoDataBtn = document.getElementById("demoDataBtn");
  exportCsvBtn = document.getElementById("exportCsvBtn");
  clearAllDataBtn = document.getElementById("clearAllDataBtn");
  reportCardModal = document.getElementById("reportCardModal");
  editStudentModal = document.getElementById("editStudentModal");
  oopArchitectureModal = document.getElementById("oopArchitectureModal");
  oopArchitectureBtn = document.getElementById("oopArchitectureBtn");
}

async function checkJavaBackendHealth() {
  const badgeText = document.getElementById("backendStatusText");
  try {
    const res = await fetch("/api/health");
    if (res.ok) {
      const data = await res.json();
      if (badgeText) badgeText.textContent = data.engine || "Java 25 OOP Engine Active";
    }
  } catch (e) {
    // Fallback indicator
    if (badgeText) badgeText.textContent = "Java OOP Architecture";
  }
}

function initTheme() {
  const savedTheme = localStorage.getItem("academiapro-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  const themeIcon = document.getElementById("themeIcon");
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "fa-solid fa-moon" : "fa-solid fa-sun";
  }
}

// -------------------------------------------------------------
// Data Management & Computations (OOP Simulation & Storage)
// -------------------------------------------------------------
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      students = parsed.map(normalizeStudentData);
    } catch (e) {
      console.error("Error loading stored data", e);
      students = [];
    }
  } else {
    // Preload demo data
    students = DEMO_STUDENTS.map(normalizeStudentData);
    saveData();
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

function normalizeStudentData(s) {
  const marks = {
    math: Number(s.marks?.math || s.marks?.maths || 0),
    science: Number(s.marks?.science || 0),
    english: Number(s.marks?.english || 0),
    computer: Number(s.marks?.computer || s.marks?.cs || 0),
    social: Number(s.marks?.social || s.marks?.history || 0)
  };

  const total = marks.math + marks.science + marks.english + marks.computer + marks.social;
  const percentage = Number((total / 5).toFixed(1));
  const gradeInfo = computeGrade(percentage);

  let status = "Fail";
  if (percentage >= 75) {
    status = "Distinction";
  } else if (percentage >= 40) {
    status = "Pass";
  }

  return {
    id: s.id || `std-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: s.name || "Unnamed Student",
    rollNumber: String(s.rollNumber || ""),
    studentClass: s.studentClass || "Grade 10-A",
    attendance: Number(s.attendance || 90),
    email: s.email || `${(s.name || "student").toLowerCase().replace(/\s+/g, ".")}@academia.edu`,
    marks,
    total,
    percentage,
    cgpa: Number((percentage / 10).toFixed(2)),
    grade: gradeInfo.grade,
    gradeLabel: gradeInfo.label,
    gradePoint: gradeInfo.point,
    status
  };
}

function computeGrade(pct) {
  if (pct >= 90) return { grade: "A+", label: "Outstanding", point: 10.0 };
  if (pct >= 80) return { grade: "A", label: "Excellent", point: 9.0 };
  if (pct >= 70) return { grade: "B+", label: "Very Good", point: 8.0 };
  if (pct >= 60) return { grade: "B", label: "Good", point: 7.0 };
  if (pct >= 50) return { grade: "C", label: "Average", point: 6.0 };
  if (pct >= 40) return { grade: "D", label: "Pass", point: 5.0 };
  return { grade: "F", label: "Fail", point: 0.0 };
}

// -------------------------------------------------------------
// UI Rendering & View Updates
// -------------------------------------------------------------
function refreshAllViews() {
  assignRanks();
  renderKpiCards();
  renderStudentSelectOptions();
  renderTableRows();
  renderCharts();
}

function assignRanks() {
  const sorted = [...students].sort((a, b) => b.percentage - a.percentage);
  sorted.forEach((student, index) => {
    student.rank = index + 1;
  });
}

function renderKpiCards() {
  const total = students.length;
  const kpiTotal = document.getElementById("kpiTotalStudents");
  const kpiTopper = document.getElementById("kpiTopperName");
  const kpiTopperScore = document.getElementById("kpiTopperScore");
  const kpiClassAvg = document.getElementById("kpiClassAverage");
  const kpiClassCgpa = document.getElementById("kpiClassCgpa");
  const kpiPassRate = document.getElementById("kpiPassRate");
  const kpiPassCount = document.getElementById("kpiPassCount");
  const kpiDistRate = document.getElementById("kpiDistinctionRate");
  const kpiDistCount = document.getElementById("kpiDistinctionCount");

  if (kpiTotal) kpiTotal.textContent = total;

  if (total === 0) {
    if (kpiTopper) kpiTopper.textContent = "—";
    if (kpiTopperScore) kpiTopperScore.textContent = "No records";
    if (kpiClassAvg) kpiClassAvg.textContent = "0%";
    if (kpiClassCgpa) kpiClassCgpa.textContent = "CGPA: 0.0";
    if (kpiPassRate) kpiPassRate.textContent = "0%";
    if (kpiPassCount) kpiPassCount.textContent = "0 passed";
    if (kpiDistRate) kpiDistRate.textContent = "0%";
    if (kpiDistCount) kpiDistCount.textContent = "0 students";
    return;
  }

  // Topper (Rank 1)
  const topper = [...students].sort((a, b) => b.percentage - a.percentage)[0];
  if (kpiTopper) kpiTopper.textContent = topper.name;
  if (kpiTopperScore) kpiTopperScore.textContent = `${topper.percentage}% (${topper.grade})`;

  // Class Average
  const sumPct = students.reduce((acc, s) => acc + s.percentage, 0);
  const avgPct = Number((sumPct / total).toFixed(1));
  const avgCgpa = Number((avgPct / 10).toFixed(2));
  if (kpiClassAvg) kpiClassAvg.textContent = `${avgPct}%`;
  if (kpiClassCgpa) kpiClassCgpa.textContent = `CGPA: ${avgCgpa}`;

  // Pass Rate (Pass + Distinction)
  const passedStudents = students.filter(s => s.status !== "Fail").length;
  const passPct = Number(((passedStudents / total) * 100).toFixed(1));
  if (kpiPassRate) kpiPassRate.textContent = `${passPct}%`;
  if (kpiPassCount) kpiPassCount.textContent = `${passedStudents} of ${total} passed`;

  // Distinction Rate (>= 75%)
  const distinctionStudents = students.filter(s => s.percentage >= 75).length;
  const distPct = Number(((distinctionStudents / total) * 100).toFixed(1));
  if (kpiDistRate) kpiDistRate.textContent = `${distPct}%`;
  if (kpiDistCount) kpiDistCount.textContent = `${distinctionStudents} achieved distinction`;
}

function renderStudentSelectOptions() {
  if (!studentSelect) return;
  const currentVal = studentSelect.value;
  studentSelect.innerHTML = '<option value="">-- Choose a student from roster --</option>';

  students.forEach((s) => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = `${s.name} (Roll ${s.rollNumber} - ${s.studentClass})`;
    studentSelect.appendChild(opt);
  });

  if (currentVal && students.some(s => s.id === currentVal)) {
    studentSelect.value = currentVal;
  }
}

// -------------------------------------------------------------
// Table Filtering, Sorting & Rendering
// -------------------------------------------------------------
function getFilteredAndSortedStudents() {
  let list = [...students];

  // 1. Search Query
  const query = (tableSearchInput?.value || "").trim().toLowerCase();
  if (query) {
    list = list.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.rollNumber.toLowerCase().includes(query) ||
        s.studentClass.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query)
    );
  }

  // 2. Grade Filter
  const gradeFilter = gradeFilterSelect?.value || "ALL";
  if (gradeFilter !== "ALL") {
    list = list.filter((s) => s.grade === gradeFilter);
  }

  // 3. Status Filter
  const statusFilter = statusFilterSelect?.value || "ALL";
  if (statusFilter !== "ALL") {
    list = list.filter((s) => s.status === statusFilter);
  }

  // 4. Sorting (Demonstrates Comparable & Custom Comparators)
  const sortBy = sortBySelect?.value || "rank_asc";
  if (sortBy === "rank_asc") {
    list.sort((a, b) => a.rank - b.rank);
  } else if (sortBy === "pct_desc") {
    list.sort((a, b) => b.percentage - a.percentage);
  } else if (sortBy === "pct_asc") {
    list.sort((a, b) => a.percentage - b.percentage);
  } else if (sortBy === "name_asc") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "roll_asc") {
    list.sort((a, b) => {
      const numA = parseInt(a.rollNumber, 10);
      const numB = parseInt(b.rollNumber, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.rollNumber.localeCompare(b.rollNumber);
    });
  }

  return list;
}

function renderTableRows() {
  if (!studentTableBody) return;
  const filtered = getFilteredAndSortedStudents();
  const countEl = document.getElementById("tableRecordCount");

  if (countEl) {
    countEl.textContent = `Showing ${filtered.length} of ${students.length} student records`;
  }

  studentTableBody.innerHTML = "";

  if (filtered.length === 0) {
    studentTableBody.innerHTML = `
      <tr>
        <td colspan="15" class="text-center" style="padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
          No student records matching current filters.
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach((s) => {
    const row = document.createElement("tr");

    // Initials for avatar
    const initials = s.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    // Grade badge styling
    const gradeClass = getGradeClass(s.grade);

    // Status pill styling
    let statusClass = "status-pass";
    let statusIcon = "fa-solid fa-check";
    if (s.status === "Distinction") {
      statusClass = "status-distinction";
      statusIcon = "fa-solid fa-star";
    } else if (s.status === "Fail") {
      statusClass = "status-fail";
      statusIcon = "fa-solid fa-xmark";
    }

    // Rank badge styling
    let rankBadge = `<span class="rank-badge">${s.rank}</span>`;
    if (s.rank === 1) rankBadge = `<span class="rank-badge rank-1" title="Rank 1 - Top Performer">🥇</span>`;
    else if (s.rank === 2) rankBadge = `<span class="rank-badge rank-2" title="Rank 2">🥈</span>`;
    else if (s.rank === 3) rankBadge = `<span class="rank-badge rank-3" title="Rank 3">🥉</span>`;

    row.innerHTML = `
      <td class="text-center">${rankBadge}</td>
      <td>
        <div class="student-profile-cell">
          <div class="student-avatar">${initials}</div>
          <div>
            <div class="student-name-text">${escapeHtml(s.name)}</div>
            <div class="student-email-text">${escapeHtml(s.email)}</div>
          </div>
        </div>
      </td>
      <td><strong>${escapeHtml(s.rollNumber)}</strong></td>
      <td>${escapeHtml(s.studentClass)}</td>
      <td class="text-center">${s.marks.math}</td>
      <td class="text-center">${s.marks.science}</td>
      <td class="text-center">${s.marks.english}</td>
      <td class="text-center">${s.marks.computer}</td>
      <td class="text-center">${s.marks.social}</td>
      <td class="text-center font-bold"><strong>${s.total}</strong> / 500</td>
      <td class="text-center font-bold"><strong>${s.percentage}%</strong></td>
      <td class="text-center">${s.cgpa}</td>
      <td class="text-center"><span class="grade-tag ${gradeClass}">${s.grade}</span></td>
      <td class="text-center"><span class="status-pill ${statusClass}"><i class="${statusIcon}"></i> ${s.status}</span></td>
      <td class="text-right">
        <button class="table-action-btn view-report-btn" data-id="${s.id}" title="View Academic Transcript">
          <i class="fa-solid fa-file-lines"></i>
        </button>
        <button class="table-action-btn edit-student-btn" data-id="${s.id}" title="Edit Student & Marks">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="table-action-btn delete-btn delete-student-btn" data-id="${s.id}" title="Delete Student">
          <i class="fa-solid fa-trash"></i>
        </button>
      </td>
    `;

    studentTableBody.appendChild(row);
  });
}

function getGradeClass(grade) {
  switch (grade) {
    case "A+": return "grade-tag-aplus";
    case "A": return "grade-tag-a";
    case "B+": return "grade-tag-bplus";
    case "B": return "grade-tag-b";
    case "C": return "grade-tag-c";
    case "D": return "grade-tag-d";
    default: return "grade-tag-f";
  }
}

// -------------------------------------------------------------
// Interactive Charts (Chart.js)
// -------------------------------------------------------------
function renderCharts() {
  renderSubjectPerformanceChart();
  renderGradeDistributionChart();
}

function renderSubjectPerformanceChart() {
  const canvas = document.getElementById("subjectPerformanceChart");
  if (!canvas || typeof Chart === "undefined") return;

  const total = students.length;
  let mathAvg = 0, sciAvg = 0, engAvg = 0, csAvg = 0, socAvg = 0;

  if (total > 0) {
    mathAvg = Number((students.reduce((a, s) => a + s.marks.math, 0) / total).toFixed(1));
    sciAvg = Number((students.reduce((a, s) => a + s.marks.science, 0) / total).toFixed(1));
    engAvg = Number((students.reduce((a, s) => a + s.marks.english, 0) / total).toFixed(1));
    csAvg = Number((students.reduce((a, s) => a + s.marks.computer, 0) / total).toFixed(1));
    socAvg = Number((students.reduce((a, s) => a + s.marks.social, 0) / total).toFixed(1));
  }

  const data = {
    labels: ["Mathematics", "Science", "English", "Comp Sci", "Social Studies"],
    datasets: [
      {
        label: "Class Average Score",
        data: [mathAvg, sciAvg, engAvg, csAvg, socAvg],
        backgroundColor: [
          "rgba(6, 182, 212, 0.75)",
          "rgba(99, 102, 241, 0.75)",
          "rgba(139, 92, 246, 0.75)",
          "rgba(16, 185, 129, 0.75)",
          "rgba(245, 158, 11, 0.75)"
        ],
        borderColor: [
          "#06b6d4",
          "#6366f1",
          "#8b5cf6",
          "#10b981",
          "#f59e0b"
        ],
        borderWidth: 1.5,
        borderRadius: 8
      }
    ]
  };

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const textColor = isLight ? "#475569" : "#94a3b8";
  const gridColor = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";

  if (subjectChartInstance) {
    subjectChartInstance.destroy();
  }

  subjectChartInstance = new Chart(canvas, {
    type: "bar",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => ` Class Average: ${ctx.parsed.y} / 100`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: { color: textColor, stepSize: 20 },
          grid: { color: gridColor }
        },
        x: {
          ticks: { color: textColor },
          grid: { display: false }
        }
      }
    }
  });
}

function renderGradeDistributionChart() {
  const canvas = document.getElementById("gradeDistributionChart");
  if (!canvas || typeof Chart === "undefined") return;

  const counts = { "A+": 0, A: 0, "B+": 0, B: 0, C: 0, D: 0, F: 0 };
  students.forEach((s) => {
    if (counts[s.grade] !== undefined) counts[s.grade]++;
  });

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  const textColor = isLight ? "#475569" : "#94a3b8";

  const data = {
    labels: ["A+ (>=90%)", "A (80-89%)", "B+ (70-79%)", "B (60-69%)", "C (50-59%)", "D (40-49%)", "F (<40%)"],
    datasets: [
      {
        data: [counts["A+"], counts.A, counts["B+"], counts.B, counts.C, counts.D, counts.F],
        backgroundColor: [
          "#10b981", // A+ Emerald
          "#06b6d4", // A Cyan
          "#6366f1", // B+ Indigo
          "#8b5cf6", // B Violet
          "#f59e0b", // C Amber
          "#f97316", // D Orange
          "#f43f5e"  // F Rose
        ],
        borderWidth: 2,
        borderColor: isLight ? "#ffffff" : "#121a2f"
      }
    ]
  };

  if (gradeChartInstance) {
    gradeChartInstance.destroy();
  }

  gradeChartInstance = new Chart(canvas, {
    type: "doughnut",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: textColor,
            font: { size: 11 },
            boxWidth: 12
          }
        }
      },
      cutout: "65%"
    }
  });
}

// -------------------------------------------------------------
// Event Listeners & Interactive Handlers
// -------------------------------------------------------------
function attachEventListeners() {
  // 1. Student Registration Form
  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    const studentClass = document.getElementById("studentClass").value.trim() || "Grade 10-A";
    const attendance = Number(document.getElementById("studentAttendance").value) || 95;
    const email = document.getElementById("studentEmail").value.trim() || `${name.toLowerCase().replace(/\s+/g, ".")}@academia.edu`;

    if (!name || !rollNumber) {
      showToast("Please provide both student name and roll number.", "error");
      return;
    }

    const exists = students.some((s) => s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
    if (exists) {
      showToast(`Roll Number "${rollNumber}" is already registered.`, "warning");
      return;
    }

    const newStudent = normalizeStudentData({
      id: `std-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      rollNumber,
      studentClass,
      attendance,
      email,
      marks: { math: 0, science: 0, english: 0, computer: 0, social: 0 }
    });

    students.push(newStudent);
    saveData();
    refreshAllViews();

    studentForm.reset();
    document.getElementById("studentClass").value = "Grade 10-A";
    document.getElementById("studentAttendance").value = "95";

    // Auto select this newly added student in Marks Form for quick workflow
    studentSelect.value = newStudent.id;
    populateMarksFromSelected();

    showToast(`Registered "${name}" (Roll ${rollNumber}) via Java Student Model!`, "success");
  });

  // 2. Select Student in Marks Form -> autofill current marks if present
  studentSelect.addEventListener("change", () => {
    populateMarksFromSelected();
  });

  // Live Score Calculator
  const markInputs = document.querySelectorAll("#marksForm .mark-input");
  markInputs.forEach((input) => {
    input.addEventListener("input", updateLiveCalculationBar);
  });

  // 3. Save Marks Form
  marksForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentId = studentSelect.value;
    if (!studentId) {
      showToast("Please select an enrolled student first.", "warning");
      return;
    }

    const mMath = Number(document.getElementById("maths").value);
    const mSci = Number(document.getElementById("science").value);
    const mEng = Number(document.getElementById("english").value);
    const mCs = Number(document.getElementById("computer").value);
    const mSoc = Number(document.getElementById("social").value);

    const scores = [mMath, mSci, mEng, mCs, mSoc];
    if (scores.some((m) => isNaN(m) || m < 0 || m > 100)) {
      showToast("Every subject mark must be a valid number between 0 and 100.", "error");
      return;
    }

    const idx = students.findIndex((s) => s.id === studentId);
    if (idx === -1) {
      showToast("Selected student was not found.", "error");
      return;
    }

    students[idx].marks = { math: mMath, science: mSci, english: mEng, computer: mCs, social: mSoc };
    students[idx] = normalizeStudentData(students[idx]);

    saveData();
    refreshAllViews();
    showToast(`SubjectMarks encapsulated and GPA evaluated for ${students[idx].name}!`, "success");
  });

  // 4. Search & Filter Inputs
  tableSearchInput.addEventListener("input", () => {
    clearSearchBtn.style.display = tableSearchInput.value ? "block" : "none";
    renderTableRows();
  });

  clearSearchBtn.addEventListener("click", () => {
    tableSearchInput.value = "";
    clearSearchBtn.style.display = "none";
    renderTableRows();
  });

  gradeFilterSelect.addEventListener("change", renderTableRows);
  statusFilterSelect.addEventListener("change", renderTableRows);
  sortBySelect.addEventListener("change", renderTableRows);

  resetFiltersBtn.addEventListener("click", () => {
    tableSearchInput.value = "";
    clearSearchBtn.style.display = "none";
    gradeFilterSelect.value = "ALL";
    statusFilterSelect.value = "ALL";
    sortBySelect.value = "rank_asc";
    renderTableRows();
    showToast("Filters reset to default.", "info");
  });

  // 5. Table Dynamic Action Buttons (View, Edit, Delete)
  studentTableBody.addEventListener("click", (e) => {
    const viewBtn = e.target.closest(".view-report-btn");
    const editBtn = e.target.closest(".edit-student-btn");
    const deleteBtn = e.target.closest(".delete-student-btn");

    if (viewBtn) {
      const id = viewBtn.getAttribute("data-id");
      openReportCardModal(id);
    } else if (editBtn) {
      const id = editBtn.getAttribute("data-id");
      openEditModal(id);
    } else if (deleteBtn) {
      const id = deleteBtn.getAttribute("data-id");
      deleteStudent(id);
    }
  });

  // 6. Report Card Modal Controls
  document.getElementById("closeReportModalBtn").addEventListener("click", closeReportCardModal);
  document.getElementById("closeReportModalFooterBtn").addEventListener("click", closeReportCardModal);
  document.getElementById("printReportCardBtn").addEventListener("click", () => {
    window.print();
  });

  // 7. Edit Modal Controls
  document.getElementById("closeEditModalBtn").addEventListener("click", closeEditModal);
  document.getElementById("closeEditModalFooterBtn").addEventListener("click", closeEditModal);
  document.getElementById("editStudentForm").addEventListener("submit", saveEditedStudent);

  // 8. OOP Architecture Modal
  if (oopArchitectureBtn) {
    oopArchitectureBtn.addEventListener("click", () => {
      oopArchitectureModal.classList.add("active");
      oopArchitectureModal.setAttribute("aria-hidden", "false");
    });
  }
  document.getElementById("closeOopModalBtn").addEventListener("click", () => {
    oopArchitectureModal.classList.remove("active");
    oopArchitectureModal.setAttribute("aria-hidden", "true");
  });
  document.getElementById("closeOopModalFooterBtn").addEventListener("click", () => {
    oopArchitectureModal.classList.remove("active");
    oopArchitectureModal.setAttribute("aria-hidden", "true");
  });

  // 9. Theme Toggle
  themeToggleBtn.addEventListener("click", toggleTheme);

  // 10. Load Demo Data
  demoDataBtn.addEventListener("click", () => {
    students = DEMO_STUDENTS.map(normalizeStudentData);
    saveData();
    refreshAllViews();
    showToast("Loaded 6 demo student profiles with complete records!", "success");
  });

  // 11. Export CSV
  exportCsvBtn.addEventListener("click", exportRecordsToCsv);

  // 12. Clear All Data
  clearAllDataBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all student records? This action cannot be undone.")) {
      students = [];
      saveData();
      refreshAllViews();
      showToast("All student records cleared from memory.", "info");
    }
  });
}

function populateMarksFromSelected() {
  const id = studentSelect.value;
  if (!id) {
    resetMarkInputs();
    updateLiveCalculationBar();
    return;
  }
  const student = students.find((s) => s.id === id);
  if (student) {
    document.getElementById("maths").value = student.marks.math || "";
    document.getElementById("science").value = student.marks.science || "";
    document.getElementById("english").value = student.marks.english || "";
    document.getElementById("computer").value = student.marks.computer || "";
    document.getElementById("social").value = student.marks.social || "";
  }
  updateLiveCalculationBar();
}

function resetMarkInputs() {
  document.getElementById("maths").value = "";
  document.getElementById("science").value = "";
  document.getElementById("english").value = "";
  document.getElementById("computer").value = "";
  document.getElementById("social").value = "";
}

function updateLiveCalculationBar() {
  const m1 = parseFloat(document.getElementById("maths").value) || 0;
  const m2 = parseFloat(document.getElementById("science").value) || 0;
  const m3 = parseFloat(document.getElementById("english").value) || 0;
  const m4 = parseFloat(document.getElementById("computer").value) || 0;
  const m5 = parseFloat(document.getElementById("social").value) || 0;

  const total = m1 + m2 + m3 + m4 + m5;
  const pct = Number((total / 5).toFixed(1));
  const gradeInfo = computeGrade(pct);

  document.getElementById("liveTotalPreview").textContent = `${total} / 500`;
  document.getElementById("livePercentPreview").textContent = `${pct}%`;

  const badge = document.getElementById("liveGradePreview");
  badge.textContent = `${gradeInfo.grade} (${gradeInfo.label})`;
  badge.className = `badge ${getGradeClass(gradeInfo.grade)}`;
}

// -------------------------------------------------------------
// Report Card Transcript Modal
// -------------------------------------------------------------
function openReportCardModal(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  const infoWrap = document.getElementById("transcriptStudentInfo");
  infoWrap.innerHTML = `
    <div class="transcript-info-item"><span>Student Name:</span><strong>${escapeHtml(student.name)}</strong></div>
    <div class="transcript-info-item"><span>Roll Number:</span><strong>${escapeHtml(student.rollNumber)}</strong></div>
    <div class="transcript-info-item"><span>Class & Section:</span><strong>${escapeHtml(student.studentClass)}</strong></div>
    <div class="transcript-info-item"><span>Class Rank:</span><strong>Rank #${student.rank} of ${students.length}</strong></div>
    <div class="transcript-info-item"><span>Attendance Rate:</span><strong>${student.attendance}%</strong></div>
    <div class="transcript-info-item"><span>Student Email:</span><strong>${escapeHtml(student.email)}</strong></div>
  `;

  const subjects = [
    { name: "Mathematics & Analytical Geometry", score: student.marks.math },
    { name: "Science (Physics, Chemistry & Biology)", score: student.marks.science },
    { name: "English Language & Literature", score: student.marks.english },
    { name: "Computer Science & Programming", score: student.marks.computer },
    { name: "Social Studies & World History", score: student.marks.social }
  ];

  const tableBody = document.getElementById("transcriptTableBody");
  tableBody.innerHTML = "";

  subjects.forEach((sub) => {
    const sGrade = computeGrade(sub.score);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${sub.name}</strong></td>
      <td class="text-center">100</td>
      <td class="text-center font-bold"><strong>${sub.score}</strong></td>
      <td class="text-center">${sub.score}%</td>
      <td class="text-center">${sGrade.point.toFixed(1)}</td>
      <td class="text-center"><span class="grade-tag ${getGradeClass(sGrade.grade)}">${sGrade.grade}</span></td>
      <td class="text-center">${sGrade.label}</td>
    `;
    tableBody.appendChild(row);
  });

  document.getElementById("transcriptGrandTotal").textContent = `${student.total} / 500`;
  document.getElementById("transcriptGrandPercent").textContent = `${student.percentage}%`;
  document.getElementById("transcriptGrandCgpa").textContent = `${student.cgpa} (GPA)`;
  document.getElementById("transcriptGrandGrade").innerHTML = `<span class="grade-tag ${getGradeClass(student.grade)}">${student.grade}</span>`;
  document.getElementById("transcriptGrandStatus").innerHTML = `<span class="status-pill status-${student.status.toLowerCase()}">${student.status}</span>`;

  // Dynamic Evaluator Remark
  let remark = "";
  if (student.percentage >= 90) {
    remark = "Exemplary academic achievement! Demonstrates exceptional problem-solving and mastery across all disciplines.";
  } else if (student.percentage >= 80) {
    remark = "Outstanding performance and commendable consistency throughout the examination semester.";
  } else if (student.percentage >= 70) {
    remark = "Very good understanding of core subjects. Well done with clear potential for further excellence.";
  } else if (student.percentage >= 50) {
    remark = "Satisfactory academic performance. Encouraged to focus more time on analytical subjects.";
  } else {
    remark = "Needs additional guidance and remedial support in core subject fundamentals to improve marks.";
  }
  document.getElementById("transcriptEvaluatorRemarks").textContent = remark;

  const standingBadge = document.getElementById("transcriptStandingBadge");
  standingBadge.innerHTML = `<span class="badge badge-lg ${getGradeClass(student.grade)}">Standing: ${student.gradeLabel}</span>`;

  reportCardModal.classList.add("active");
  reportCardModal.setAttribute("aria-hidden", "false");
}

function closeReportCardModal() {
  reportCardModal.classList.remove("active");
  reportCardModal.setAttribute("aria-hidden", "true");
}

// -------------------------------------------------------------
// Edit Student & Marks Modal
// -------------------------------------------------------------
function openEditModal(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  document.getElementById("editStudentId").value = student.id;
  document.getElementById("editName").value = student.name;
  document.getElementById("editRoll").value = student.rollNumber;
  document.getElementById("editClass").value = student.studentClass;
  document.getElementById("editAttendance").value = student.attendance;
  document.getElementById("editEmail").value = student.email;

  document.getElementById("editMath").value = student.marks.math;
  document.getElementById("editScience").value = student.marks.science;
  document.getElementById("editEnglish").value = student.marks.english;
  document.getElementById("editComputer").value = student.marks.computer;
  document.getElementById("editSocial").value = student.marks.social;

  editStudentModal.classList.add("active");
  editStudentModal.setAttribute("aria-hidden", "false");
}

function closeEditModal() {
  editStudentModal.classList.remove("active");
  editStudentModal.setAttribute("aria-hidden", "true");
}

function saveEditedStudent(e) {
  e.preventDefault();
  const id = document.getElementById("editStudentId").value;
  const name = document.getElementById("editName").value.trim();
  const rollNumber = document.getElementById("editRoll").value.trim();
  const studentClass = document.getElementById("editClass").value.trim();
  const attendance = Number(document.getElementById("editAttendance").value);
  const email = document.getElementById("editEmail").value.trim();

  const math = Number(document.getElementById("editMath").value);
  const science = Number(document.getElementById("editScience").value);
  const english = Number(document.getElementById("editEnglish").value);
  const computer = Number(document.getElementById("editComputer").value);
  const social = Number(document.getElementById("editSocial").value);

  // Check roll duplication with other students
  const rollTaken = students.some((s) => s.id !== id && s.rollNumber.toLowerCase() === rollNumber.toLowerCase());
  if (rollTaken) {
    showToast(`Roll Number "${rollNumber}" is already in use by another student.`, "error");
    return;
  }

  const idx = students.findIndex((s) => s.id === id);
  if (idx !== -1) {
    students[idx] = normalizeStudentData({
      id,
      name,
      rollNumber,
      studentClass,
      attendance,
      email,
      marks: { math, science, english, computer, social }
    });

    saveData();
    refreshAllViews();
    closeEditModal();
    showToast(`Profile & grades updated for ${name}!`, "success");
  }
}

// -------------------------------------------------------------
// Delete Student
// -------------------------------------------------------------
function deleteStudent(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  if (confirm(`Are you sure you want to remove "${student.name}" (Roll ${student.rollNumber})?`)) {
    students = students.filter((s) => s.id !== studentId);
    saveData();
    refreshAllViews();
    showToast(`Student record for ${student.name} deleted.`, "info");
  }
}

// -------------------------------------------------------------
// CSV Export
// -------------------------------------------------------------
function exportRecordsToCsv() {
  if (students.length === 0) {
    showToast("No student records to export.", "warning");
    return;
  }

  const headers = [
    "Rank",
    "Roll Number",
    "Student Name",
    "Class",
    "Attendance (%)",
    "Email",
    "Mathematics",
    "Science",
    "English",
    "Computer Science",
    "Social Studies",
    "Total (500)",
    "Percentage (%)",
    "CGPA",
    "Letter Grade",
    "Academic Status"
  ];

  const rows = students.map((s) => [
    s.rank,
    `"${s.rollNumber}"`,
    `"${s.name}"`,
    `"${s.studentClass}"`,
    s.attendance,
    `"${s.email}"`,
    s.marks.math,
    s.marks.science,
    s.marks.english,
    s.marks.computer,
    s.marks.social,
    s.total,
    s.percentage,
    s.cgpa,
    `"${s.grade}"`,
    `"${s.status}"`
  ]);

  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `AcademiaPro_Java_Grades_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast("Academic records exported as CSV file successfully!", "success");
}

// -------------------------------------------------------------
// Theme Toggle
// -------------------------------------------------------------
function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("academiapro-theme", newTheme);
  updateThemeIcon(newTheme);
  renderCharts();
  showToast(`Switched to ${newTheme === "dark" ? "Dark Space" : "Clean Light"} theme.`, "info");
}

// -------------------------------------------------------------
// Toast Notifications
// -------------------------------------------------------------
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;

  let iconClass = "fa-solid fa-circle-info";
  if (type === "success") iconClass = "fa-solid fa-circle-check";
  else if (type === "error") iconClass = "fa-solid fa-triangle-exclamation";
  else if (type === "warning") iconClass = "fa-solid fa-circle-exclamation";

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <span>${escapeHtml(message)}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastSlideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards";
    setTimeout(() => {
      if (toast.parentElement) toast.parentElement.removeChild(toast);
    }, 300);
  }, 3500);
}

// Security Helper: Escape HTML
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
