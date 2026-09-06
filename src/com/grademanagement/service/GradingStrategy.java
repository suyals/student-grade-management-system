package com.grademanagement.service;

import com.grademanagement.model.SubjectMarks;

/**
 * GradingStrategy Interface
 * Demonstrates: ABSTRACTION & POLYMORPHISM (Strategy Pattern)
 */
public interface GradingStrategy {
    String calculateGrade(double percentage);
    String getGradeDescription(String grade);
    double calculateGpa(double percentage);
    String evaluateStatus(double percentage);
}
