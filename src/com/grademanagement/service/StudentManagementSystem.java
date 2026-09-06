package com.grademanagement.service;

import com.grademanagement.model.Student;
import com.grademanagement.model.SubjectMarks;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service Layer: StudentManagementSystem
 * Demonstrates: OOP DESIGN, COLLECTIONS FRAMEWORK, STREAMS & DATA AGGREGATION
 */
public class StudentManagementSystem {
    private final List<Student> studentList;
    private final Map<String, Student> rollNumberIndex;

    public StudentManagementSystem() {
        this.studentList = new ArrayList<>();
        this.rollNumberIndex = new HashMap<>();
    }

    public synchronized boolean addStudent(Student student) {
        if (student == null || student.getRollNumber() == null) return false;
        String key = student.getRollNumber().trim().toLowerCase();
        if (rollNumberIndex.containsKey(key)) {
            return false; // Roll number already exists
        }
        studentList.add(student);
        rollNumberIndex.put(key, student);
        updateRanks();
        return true;
    }

    public synchronized boolean removeStudent(String studentId) {
        Iterator<Student> iterator = studentList.iterator();
        while (iterator.hasNext()) {
            Student s = iterator.next();
            if (s.getId().equals(studentId) || s.getRollNumber().equalsIgnoreCase(studentId)) {
                iterator.remove();
                rollNumberIndex.remove(s.getRollNumber().trim().toLowerCase());
                updateRanks();
                return true;
            }
        }
        return false;
    }

    public synchronized boolean updateMarks(String rollOrId, SubjectMarks newMarks) {
        Student student = findByRollNumber(rollOrId);
        if (student == null) {
            student = findById(rollOrId);
        }
        if (student != null) {
            student.setMarks(newMarks);
            updateRanks();
            return true;
        }
        return false;
    }

    public Student findByRollNumber(String rollNumber) {
        if (rollNumber == null) return null;
        return rollNumberIndex.get(rollNumber.trim().toLowerCase());
    }

    public Student findById(String id) {
        return studentList.stream()
                .filter(s -> s.getId().equals(id))
                .findFirst()
                .orElse(null);
    }

    public List<Student> getAllStudents() {
        return Collections.unmodifiableList(studentList);
    }

    public List<Student> searchStudents(String query) {
        if (query == null || query.isBlank()) return getAllStudents();
        String q = query.trim().toLowerCase();
        return studentList.stream()
                .filter(s -> s.getName().toLowerCase().contains(q)
                        || s.getRollNumber().toLowerCase().contains(q)
                        || s.getStudentClass().toLowerCase().contains(q)
                        || s.getEmail().toLowerCase().contains(q))
                .collect(Collectors.toList());
    }

    public synchronized void updateRanks() {
        // Sort students using natural order (Comparable -> descending percentage)
        List<Student> sorted = new ArrayList<>(studentList);
        Collections.sort(sorted);
        for (int i = 0; i < sorted.size(); i++) {
            sorted.get(i).setRank(i + 1);
        }
    }

    public Student getTopPerformer() {
        if (studentList.isEmpty()) return null;
        return studentList.stream()
                .max(Comparator.comparingDouble(Student::getPercentage))
                .orElse(null);
    }

    public double getClassAveragePercentage() {
        if (studentList.isEmpty()) return 0.0;
        double sum = studentList.stream().mapToDouble(Student::getPercentage).sum();
        return Math.round((sum / studentList.size()) * 10.0) / 10.0;
    }

    public double getPassRatePercentage() {
        if (studentList.isEmpty()) return 0.0;
        long passed = studentList.stream().filter(s -> !s.getStatus().equalsIgnoreCase("Fail")).count();
        return Math.round(((double) passed / studentList.size() * 100.0) * 10.0) / 10.0;
    }

    public double getDistinctionRatePercentage() {
        if (studentList.isEmpty()) return 0.0;
        long distinction = studentList.stream().filter(s -> s.getPercentage() >= 75.0).count();
        return Math.round(((double) distinction / studentList.size() * 100.0) * 10.0) / 10.0;
    }

    public Map<String, Double> getSubjectAverages() {
        Map<String, Double> map = new LinkedHashMap<>();
        if (studentList.isEmpty()) {
            map.put("Mathematics", 0.0);
            map.put("Science", 0.0);
            map.put("English", 0.0);
            map.put("Computer Science", 0.0);
            map.put("Social Studies", 0.0);
            return map;
        }

        int n = studentList.size();
        double mathSum = studentList.stream().mapToDouble(s -> s.getMarks().getMathematics()).sum();
        double sciSum = studentList.stream().mapToDouble(s -> s.getMarks().getScience()).sum();
        double engSum = studentList.stream().mapToDouble(s -> s.getMarks().getEnglish()).sum();
        double csSum = studentList.stream().mapToDouble(s -> s.getMarks().getComputerScience()).sum();
        double socSum = studentList.stream().mapToDouble(s -> s.getMarks().getSocialStudies()).sum();

        map.put("Mathematics", Math.round((mathSum / n) * 10.0) / 10.0);
        map.put("Science", Math.round((sciSum / n) * 10.0) / 10.0);
        map.put("English", Math.round((engSum / n) * 10.0) / 10.0);
        map.put("Computer Science", Math.round((csSum / n) * 10.0) / 10.0);
        map.put("Social Studies", Math.round((socSum / n) * 10.0) / 10.0);
        return map;
    }

    public Map<String, Long> getGradeDistribution() {
        Map<String, Long> dist = new LinkedHashMap<>();
        dist.put("A+", studentList.stream().filter(s -> s.getGrade().equals("A+")).count());
        dist.put("A", studentList.stream().filter(s -> s.getGrade().equals("A")).count());
        dist.put("B+", studentList.stream().filter(s -> s.getGrade().equals("B+")).count());
        dist.put("B", studentList.stream().filter(s -> s.getGrade().equals("B")).count());
        dist.put("C", studentList.stream().filter(s -> s.getGrade().equals("C")).count());
        dist.put("D", studentList.stream().filter(s -> s.getGrade().equals("D")).count());
        dist.put("F", studentList.stream().filter(s -> s.getGrade().equals("F")).count());
        return dist;
    }

    public void loadDemoData() {
        studentList.clear();
        rollNumberIndex.clear();

        addStudent(new Student("std-001", "Elena Rostova", "elena.rostova@academia.edu", "101", "Grade 10-A", 98,
                new SubjectMarks(98, 95, 92, 99, 94)));
        addStudent(new Student("std-002", "Marcus Aurelius Vance", "marcus.vance@academia.edu", "102", "Grade 10-A", 94,
                new SubjectMarks(88, 84, 90, 92, 86)));
        addStudent(new Student("std-003", "Sophia Chen", "sophia.chen@academia.edu", "103", "Grade 10-B", 96,
                new SubjectMarks(92, 89, 85, 96, 91)));
        addStudent(new Student("std-004", "David K. Miller", "david.miller@academia.edu", "104", "Grade 10-A", 88,
                new SubjectMarks(74, 68, 78, 80, 72)));
        addStudent(new Student("std-005", "Aaliyah Patel", "aaliyah.p@academia.edu", "105", "Grade 10-B", 91,
                new SubjectMarks(82, 79, 88, 85, 84)));
        addStudent(new Student("std-006", "Jordan Lee", "jordan.lee@academia.edu", "106", "Grade 10-A", 72,
                new SubjectMarks(45, 52, 48, 58, 42)));
    }
}
