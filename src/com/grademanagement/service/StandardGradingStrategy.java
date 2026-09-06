package com.grademanagement.service;

/**
 * Standard Grading System Implementation
 * Demonstrates: POLYMORPHISM (implements GradingStrategy)
 */
public class StandardGradingStrategy implements GradingStrategy {

    @Override
    public String calculateGrade(double percentage) {
        if (percentage >= 90.0) return "A+";
        if (percentage >= 80.0) return "A";
        if (percentage >= 70.0) return "B+";
        if (percentage >= 60.0) return "B";
        if (percentage >= 50.0) return "C";
        if (percentage >= 40.0) return "D";
        return "F";
    }

    @Override
    public String getGradeDescription(String grade) {
        switch (grade) {
            case "A+": return "Outstanding Performance";
            case "A": return "Excellent Performance";
            case "B+": return "Very Good Performance";
            case "B": return "Good Performance";
            case "C": return "Average Performance";
            case "D": return "Pass / Basic Requirement";
            default: return "Fail / Remedial Action Required";
        }
    }

    @Override
    public double calculateGpa(double percentage) {
        // Standard 10-point GPA scale
        return Math.round((percentage / 10.0) * 100.0) / 100.0;
    }

    @Override
    public String evaluateStatus(double percentage) {
        if (percentage >= 75.0) return "Distinction";
        if (percentage >= 40.0) return "Pass";
        return "Fail";
    }
}
