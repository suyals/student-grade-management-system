# AcademiaPro — Java OOP Student Grade Management & Analytics System

An academic performance management platform demonstrating **Object-Oriented Programming (OOP) in Java 25** paired with a glassmorphic **Web Analytics Dashboard**.

---

## 🏛️ Object-Oriented Architecture & 4 Pillars of OOP

This project showcases all 4 fundamental OOP principles:

1. **Encapsulation (`SubjectMarks.java`, `Student.java`)**:
   - Private member attributes protected with validated getters and mutators.
   - Strict range verification ensuring marks are within `[0.0, 100.0]`.

2. **Inheritance (`Person.java` ➔ `Student.java`)**:
   - `Student` extends abstract class `Person`, inheriting personal identifiers (`id`, `name`, `email`).

3. **Polymorphism (`GradingStrategy.java`, `Comparable<Student>`)**:
   - **Strategy Pattern**: `GradingStrategy` interface implemented by `StandardGradingStrategy` for flexible GPA / grade rules.
   - **Method Overriding**: Overridden `getRoleDescription()` and `Comparable<Student>` natural rank ordering.

4. **Abstraction (`GradingStrategy.java`, `Person.java`)**:
   - High-level business logic is decoupled from low-level formula computations.

---

## 🚀 How to Run the Project

### Option 1: Run the Interactive Web Dashboard
```bash
# Node Server:
node server.js
# Access in browser at: http://localhost:8000

# OR Pure Java HTTP Server:
java -cp bin com.grademanagement.server.JavaHttpServer
# Access in browser at: http://localhost:8080
```

### Option 2: Run the Java Console CLI
```bash
# Compile sources:
cmd.exe /c "javac -d bin @sources.txt"

# Run Console Application:
java -cp bin com.grademanagement.Main
```

---

## 📁 Project Structure
```
├── src/com/grademanagement/
│   ├── model/
│   │   ├── Person.java            # Abstract base class (Abstraction/Inheritance)
│   │   ├── Student.java           # Main Student model (Encapsulation/Polymorphism)
│   │   └── SubjectMarks.java      # 5-Subject marks model with validation
│   ├── service/
│   │   ├── GradingStrategy.java   # Strategy pattern interface
│   │   ├── StandardGradingStrategy.java
│   │   └── StudentManagementSystem.java # Collections & business logic
│   ├── util/
│   │   └── GradeFileManager.java  # CSV File Export I/O
│   ├── server/
│   │   └── JavaHttpServer.java    # Built-in Java REST backend
│   └── Main.java                  # Console CLI entry point
├── index.html                     # Web Dashboard & UML Architecture Modal
├── styles.css                     # Glassmorphic Responsive CSS
├── script.js                      # Analytics, Chart.js & state handling
├── server.js                      # Static Node.js server
└── README.md                      # Documentation
```

---

## ✨ Features
- **5-Subject Grade Evaluation**: Mathematics, Science, English, Computer Science, Social Studies.
- **Analytics & Visual Charts**: Subject performance comparison & grade distribution graphs via Chart.js.
- **Student Transcripts & Report Cards**: Official printable report card modal.
- **Rank & Metric Calculations**: Class average, GPA, pass rate, and distinction counts.
- **Search, Filter & Sort**: Live search by name/roll number, grade tier filter, and multi-criteria sorting.
- **Data Export**: Export academic performance records to CSV.
