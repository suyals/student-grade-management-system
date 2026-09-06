package com.grademanagement.model;

import com.grademanagement.service.GradingStrategy;
import com.grademanagement.service.StandardGradingStrategy;

/**
 * Student Class
 * Demonstrates: INHERITANCE (extends Person), ENCAPSULATION, POLYMORPHISM (Comparable)
 */
public class Student extends Person implements Comparable<Student> {
    private String rollNumber;
    private String studentClass;
    private int attendancePercentage;
    private SubjectMarks marks;
    private int rank;
    private transient GradingStrategy gradingStrategy;

    public Student(String id, String name, String email, String rollNumber, String studentClass, int attendance) {
        super(id, name, email);
        this.rollNumber = rollNumber;
        this.studentClass = studentClass != null && !studentClass.isBlank() ? studentClass : "Grade 10-A";
        this.attendancePercentage = Math.max(0, Math.min(100, attendance));
        this.marks = new SubjectMarks();
        this.gradingStrategy = new StandardGradingStrategy();
    }

    public Student(String id, String name, String email, String rollNumber, String studentClass, int attendance, SubjectMarks marks) {
        this(id, name, email, rollNumber, studentClass, attendance);
        if (marks != null) {
            this.marks = marks;
        }
    }

    // Encapsulation: Getters & Setters
    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getStudentClass() { return studentClass; }
    public void setStudentClass(String studentClass) { this.studentClass = studentClass; }

    public int getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(int attendance) {
        this.attendancePercentage = Math.max(0, Math.min(100, attendance));
    }

    public SubjectMarks getMarks() { return marks; }
    public void setMarks(SubjectMarks marks) { this.marks = marks != null ? marks : new SubjectMarks(); }

    public int getRank() { return rank; }
    public void setRank(int rank) { this.rank = rank; }

    public void setGradingStrategy(GradingStrategy strategy) {
        if (strategy != null) {
            this.gradingStrategy = strategy;
        }
    }

    private GradingStrategy getStrategy() {
        if (this.gradingStrategy == null) {
            this.gradingStrategy = new StandardGradingStrategy();
        }
        return this.gradingStrategy;
    }

    // Computed Academic Attributes
    public double getTotalMarks() {
        return marks.getTotalMarks();
    }

    public double getPercentage() {
        return marks.getAveragePercentage();
    }

    public double getGpa() {
        return getStrategy().calculateGpa(getPercentage());
    }

    public String getGrade() {
        return getStrategy().calculateGrade(getPercentage());
    }

    public String getGradeDescription() {
        return getStrategy().getGradeDescription(getGrade());
    }

    public String getStatus() {
        return getStrategy().evaluateStatus(getPercentage());
    }

    // Polymorphism: Implementing abstract method from Person
    @Override
    public String getRoleDescription() {
        return String.format("Student enrolled in %s (Roll: %s)", studentClass, rollNumber);
    }

    // Polymorphism: Natural sorting order based on descending percentage (Rank)
    @Override
    public int compareTo(Student other) {
        if (other == null) return 1;
        return Double.compare(other.getPercentage(), this.getPercentage());
    }

    @Override
    public String toString() {
        return String.format("Student [Roll=%s, Name=%s, Class=%s, Total=%.1f/500, Percentage=%.1f%%, Grade=%s, Status=%s]",
                rollNumber, name, studentClass, getTotalMarks(), getPercentage(), getGrade(), getStatus());
    }
}
