package com.grademanagement.util;

import com.grademanagement.model.Student;
import com.grademanagement.model.SubjectMarks;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility: GradeFileManager
 * Demonstrates: JAVA FILE I/O & CSV PERSISTENCE
 */
public class GradeFileManager {

    public static void exportToCsv(List<Student> students, File targetFile) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(targetFile), StandardCharsets.UTF_8))) {
            writer.write("Rank,Roll Number,Student Name,Class,Attendance (%),Email,Mathematics,Science,English,Computer Science,Social Studies,Total (500),Percentage (%),GPA,Grade,Status");
            writer.newLine();

            for (Student s : students) {
                SubjectMarks m = s.getMarks();
                String line = String.format("%d,\"%s\",\"%s\",\"%s\",%d,\"%s\",%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.1f,%.2f,\"%s\",\"%s\"",
                        s.getRank(),
                        s.getRollNumber(),
                        s.getName(),
                        s.getStudentClass(),
                        s.getAttendancePercentage(),
                        s.getEmail(),
                        m.getMathematics(),
                        m.getScience(),
                        m.getEnglish(),
                        m.getComputerScience(),
                        m.getSocialStudies(),
                        s.getTotalMarks(),
                        s.getPercentage(),
                        s.getGpa(),
                        s.getGrade(),
                        s.getStatus()
                );
                writer.write(line);
                writer.newLine();
            }
        }
    }
}
