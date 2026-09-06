package com.grademanagement.model;

/**
 * Encapsulated SubjectMarks class
 * Demonstrates: ENCAPSULATION & DATA VALIDATION
 */
public class SubjectMarks {
    private double mathematics;
    private double science;
    private double english;
    private double computerScience;
    private double socialStudies;

    public SubjectMarks() {
        this(0, 0, 0, 0, 0);
    }

    public SubjectMarks(double math, double science, double english, double cs, double social) {
        setMathematics(math);
        setScience(science);
        setEnglish(english);
        setComputerScience(cs);
        setSocialStudies(social);
    }

    private double validateMark(double mark) {
        if (mark < 0.0) return 0.0;
        if (mark > 100.0) return 100.0;
        return Math.round(mark * 10.0) / 10.0;
    }

    public double getMathematics() { return mathematics; }
    public void setMathematics(double mathematics) { this.mathematics = validateMark(mathematics); }

    public double getScience() { return science; }
    public void setScience(double science) { this.science = validateMark(science); }

    public double getEnglish() { return english; }
    public void setEnglish(double english) { this.english = validateMark(english); }

    public double getComputerScience() { return computerScience; }
    public void setComputerScience(double computerScience) { this.computerScience = validateMark(computerScience); }

    public double getSocialStudies() { return socialStudies; }
    public void setSocialStudies(double socialStudies) { this.socialStudies = validateMark(socialStudies); }

    public double getTotalMarks() {
        return mathematics + science + english + computerScience + socialStudies;
    }

    public double getAveragePercentage() {
        return Math.round((getTotalMarks() / 5.0) * 10.0) / 10.0;
    }

    @Override
    public String toString() {
        return String.format("Math: %.1f, Science: %.1f, English: %.1f, CS: %.1f, Social: %.1f (Total: %.1f/500)",
                mathematics, science, english, computerScience, socialStudies, getTotalMarks());
    }
}
