package com.grademanagement;

import com.grademanagement.model.Student;
import com.grademanagement.model.SubjectMarks;
import com.grademanagement.service.StudentManagementSystem;
import com.grademanagement.util.GradeFileManager;

import java.io.File;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

/**
 * Main Application Class
 * Demonstrates: CLI INTERACTION, OOP INTEGRATION & COMPILATION ENTRY POINT
 */
public class Main {
    private static final StudentManagementSystem system = new StudentManagementSystem();
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        // Preload demo dataset
        system.loadDemoData();

        System.out.println("==================================================================");
        System.out.println("   ACADEMIAPRO — JAVA OOP STUDENT GRADE MANAGEMENT SYSTEM V2.0   ");
        System.out.println("   Demonstrating: Encapsulation, Inheritance, Polymorphism & Abstraction ");
        System.out.println("==================================================================");

        boolean running = true;
        while (running) {
            printMenu();
            System.out.print("Enter your choice (1-8): ");
            String choice = scanner.nextLine().trim();

            switch (choice) {
                case "1":
                    displayAllStudents();
                    break;
                case "2":
                    addNewStudent();
                    break;
                case "3":
                    assignSubjectMarks();
                    break;
                case "4":
                    generateStudentTranscript();
                    break;
                case "5":
                    displayClassAnalytics();
                    break;
                case "6":
                    searchStudent();
                    break;
                case "7":
                    exportCsvFile();
                    break;
                case "8":
                    System.out.println("\nThank you for using AcademiaPro Java OOP System. Goodbye!");
                    running = false;
                    break;
                default:
                    System.out.println("\n[!] Invalid choice. Please enter a number between 1 and 8.");
            }
        }
    }

    private static void printMenu() {
        System.out.println("\n----------------- MAIN MENU -----------------");
        System.out.println("1. View All Enrolled Students (Rank Matrix)");
        System.out.println("2. Register New Student");
        System.out.println("3. Assign / Update Subject Marks (5 Subjects)");
        System.out.println("4. Generate Official Student Academic Transcript");
        System.out.println("5. View Class Performance Analytics & Distribution");
        System.out.println("6. Search Student by Name or Roll Number");
        System.out.println("7. Export Academic Records to CSV");
        System.out.println("8. Exit Application");
        System.out.println("---------------------------------------------");
    }

    private static void displayAllStudents() {
        List<Student> list = system.getAllStudents();
        if (list.isEmpty()) {
            System.out.println("\nNo students enrolled in the system yet.");
            return;
        }

        System.out.println("\n================================ ENROLLED STUDENTS RANK MATRIX ================================");
        System.out.printf("%-5s %-8s %-22s %-12s %-12s %-8s %-6s %-12s%n",
                "Rank", "Roll", "Name", "Class", "Total (500)", "Avg %", "GPA", "Status");
        System.out.println("------------------------------------------------------------------------------------------------");

        for (Student s : list) {
            System.out.printf("#%-4d %-8s %-22s %-12s %-12.1f %-8.1f %-6.2f %-12s%n",
                    s.getRank(),
                    s.getRollNumber(),
                    s.getName(),
                    s.getStudentClass(),
                    s.getTotalMarks(),
                    s.getPercentage(),
                    s.getGpa(),
                    s.getStatus() + " (" + s.getGrade() + ")");
        }
        System.out.println("================================================================================================");
    }

    private static void addNewStudent() {
        System.out.println("\n--- Register New Student ---");
        System.out.print("Enter Full Name: ");
        String name = scanner.nextLine().trim();
        if (name.isBlank()) {
            System.out.println("[!] Student name cannot be empty.");
            return;
        }

        System.out.print("Enter Roll Number: ");
        String roll = scanner.nextLine().trim();
        if (roll.isBlank()) {
            System.out.println("[!] Roll number cannot be empty.");
            return;
        }

        if (system.findByRollNumber(roll) != null) {
            System.out.println("[!] A student with Roll Number '" + roll + "' already exists.");
            return;
        }

        System.out.print("Enter Class/Section (default: Grade 10-A): ");
        String sClass = scanner.nextLine().trim();
        if (sClass.isBlank()) sClass = "Grade 10-A";

        System.out.print("Enter Attendance Percentage (0-100, default: 95): ");
        String attStr = scanner.nextLine().trim();
        int att = 95;
        try {
            if (!attStr.isBlank()) att = Integer.parseInt(attStr);
        } catch (NumberFormatException ignored) {}

        String email = name.toLowerCase().replace(" ", ".") + "@academia.edu";
        String id = "std-" + System.currentTimeMillis();

        Student student = new Student(id, name, email, roll, sClass, att);
        boolean added = system.addStudent(student);

        if (added) {
            System.out.println("[✓] Successfully enrolled " + name + " (Roll " + roll + ")!");
        } else {
            System.out.println("[!] Failed to add student.");
        }
    }

    private static void assignSubjectMarks() {
        System.out.println("\n--- Assign / Update Subject Marks ---");
        System.out.print("Enter Roll Number of Student: ");
        String roll = scanner.nextLine().trim();

        Student student = system.findByRollNumber(roll);
        if (student == null) {
            System.out.println("[!] Student with Roll Number '" + roll + "' was not found.");
            return;
        }

        System.out.println("Updating marks for: " + student.getName() + " (" + student.getStudentClass() + ")");
        double math = readValidMark("Mathematics (0-100): ");
        double sci = readValidMark("Science (0-100): ");
        double eng = readValidMark("English (0-100): ");
        double cs = readValidMark("Computer Science (0-100): ");
        double soc = readValidMark("Social Studies (0-100): ");

        SubjectMarks newMarks = new SubjectMarks(math, sci, eng, cs, soc);
        system.updateMarks(roll, newMarks);

        System.out.println("[✓] Marks updated successfully!");
        System.out.printf("Total: %.1f/500 | Average: %.1f%% | GPA: %.2f | Grade: %s | Status: %s%n",
                student.getTotalMarks(), student.getPercentage(), student.getGpa(), student.getGrade(), student.getStatus());
    }

    private static double readValidMark(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();
            try {
                double val = Double.parseDouble(input);
                if (val >= 0.0 && val <= 100.0) {
                    return val;
                }
                System.out.println("[!] Mark must be between 0 and 100.");
            } catch (NumberFormatException e) {
                System.out.println("[!] Please enter a valid decimal number.");
            }
        }
    }

    private static void generateStudentTranscript() {
        System.out.println("\n--- Generate Student Academic Transcript ---");
        System.out.print("Enter Roll Number: ");
        String roll = scanner.nextLine().trim();

        Student s = system.findByRollNumber(roll);
        if (s == null) {
            System.out.println("[!] Student with Roll Number '" + roll + "' was not found.");
            return;
        }

        System.out.println("\n==========================================================================");
        System.out.println("                  ACADEMIAPRO INTERNATIONAL ACADEMY                       ");
        System.out.println("                  OFFICIAL STUDENT ACADEMIC TRANSCRIPT                    ");
        System.out.println("==========================================================================");
        System.out.printf("Student Name : %-25s | Roll Number : %s%n", s.getName(), s.getRollNumber());
        System.out.printf("Class/Sec    : %-25s | Class Rank  : #%d of %d%n", s.getStudentClass(), s.getRank(), system.getAllStudents().size());
        System.out.printf("Email        : %-25s | Attendance  : %d%%%n", s.getEmail(), s.getAttendancePercentage());
        System.out.println("--------------------------------------------------------------------------");
        System.out.printf("%-30s %-12s %-12s %-10s%n", "Subject", "Max Marks", "Obtained", "Grade");
        System.out.println("--------------------------------------------------------------------------");

        SubjectMarks m = s.getMarks();
        printTranscriptSubject("Mathematics & Analytical Calc", 100, m.getMathematics());
        printTranscriptSubject("Science (Physics & Chemistry)", 100, m.getScience());
        printTranscriptSubject("English Literature & Comm", 100, m.getEnglish());
        printTranscriptSubject("Computer Science & Coding", 100, m.getComputerScience());
        printTranscriptSubject("Social Studies & Global Hist", 100, m.getSocialStudies());

        System.out.println("==========================================================================");
        System.out.printf("Grand Total : %6.1f / 500  | Overall Percentage : %5.1f%%%n", s.getTotalMarks(), s.getPercentage());
        System.out.printf("Cumulative GPA : %4.2f (10.0) | Letter Grade : %s (%s)%n", s.getGpa(), s.getGrade(), s.getGradeDescription());
        System.out.printf("Academic Standing : %s%n", s.getStatus());
        System.out.println("==========================================================================");
    }

    private static void printTranscriptSubject(String name, int max, double obtained) {
        String grade = obtained >= 90 ? "A+" : obtained >= 80 ? "A" : obtained >= 70 ? "B+" : obtained >= 60 ? "B" : obtained >= 50 ? "C" : obtained >= 40 ? "D" : "F";
        System.out.printf("%-30s %-12d %-12.1f %-10s%n", name, max, obtained, grade);
    }

    private static void displayClassAnalytics() {
        System.out.println("\n======================= CLASS PERFORMANCE ANALYTICS =======================");
        System.out.printf("Total Enrolled Students : %d%n", system.getAllStudents().size());
        Student topper = system.getTopPerformer();
        if (topper != null) {
            System.out.printf("Top Performer (Rank 1)  : %s (Roll %s) — %.1f%% (%s)%n",
                    topper.getName(), topper.getRollNumber(), topper.getPercentage(), topper.getGrade());
        }
        System.out.printf("Overall Class Average   : %.1f%%%n", system.getClassAveragePercentage());
        System.out.printf("Overall Pass Rate       : %.1f%%%n", system.getPassRatePercentage());
        System.out.printf("Distinction Rate (>=75%%) : %.1f%%%n", system.getDistinctionRatePercentage());

        System.out.println("\n--- Subject-Wise Class Average ---");
        for (Map.Entry<String, Double> entry : system.getSubjectAverages().entrySet()) {
            System.out.printf("  • %-20s : %.1f / 100%n", entry.getKey(), entry.getValue());
        }

        System.out.println("\n--- Grade Distribution ---");
        for (Map.Entry<String, Long> entry : system.getGradeDistribution().entrySet()) {
            System.out.printf("  • Grade %-3s : %d student(s)%n", entry.getKey(), entry.getValue());
        }
        System.out.println("===========================================================================");
    }

    private static void searchStudent() {
        System.out.print("\nEnter search term (Name or Roll Number): ");
        String query = scanner.nextLine().trim();
        List<Student> results = system.searchStudents(query);

        if (results.isEmpty()) {
            System.out.println("[!] No student matched your query '" + query + "'.");
            return;
        }

        System.out.println("\n--- Search Results (" + results.size() + " found) ---");
        for (Student s : results) {
            System.out.printf("#%-2d | Roll: %-6s | Name: %-20s | Class: %-10s | Total: %.1f/500 | Avg: %.1f%% | Grade: %s%n",
                    s.getRank(), s.getRollNumber(), s.getName(), s.getStudentClass(), s.getTotalMarks(), s.getPercentage(), s.getGrade());
        }
    }

    private static void exportCsvFile() {
        File file = new File("AcademiaPro_Java_Grades_Export.csv");
        try {
            GradeFileManager.exportToCsv(system.getAllStudents(), file);
            System.out.println("[✓] Academic records successfully exported to file: " + file.getAbsolutePath());
        } catch (Exception e) {
            System.out.println("[!] Failed to export CSV: " + e.getMessage());
        }
    }
}
