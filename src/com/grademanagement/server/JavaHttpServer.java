package com.grademanagement.server;

import com.grademanagement.model.Student;
import com.grademanagement.model.SubjectMarks;
import com.grademanagement.service.StudentManagementSystem;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

/**
 * Java Built-in HTTP Server with REST APIs & Static Content Serving
 * Demonstrates: JAVA NETWORKING, MULTI-THREADING & BACKEND INTEGRATION
 */
public class JavaHttpServer {
    private static final int PORT = 8080;
    private static final StudentManagementSystem system = new StudentManagementSystem();
    private static final Path WEB_ROOT = Paths.get(".").toAbsolutePath().normalize();

    public static void main(String[] args) throws IOException {
        system.loadDemoData();

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.setExecutor(java.util.concurrent.Executors.newCachedThreadPool());

        // REST API Handlers
        server.createContext("/api/health", new HealthHandler());
        server.createContext("/api/oop-info", new OopInfoHandler());
        server.createContext("/api/students", new StudentsApiHandler());
        
        // Static Files Handler (Fallback)
        server.createContext("/", new StaticFileHandler());

        server.start();
        System.out.println("==================================================================");
        System.out.println("  AcademiaPro Java OOP Server active at: http://localhost:" + PORT);
        System.out.println("  Full OOP Architecture, REST Endpoints and Web Dashboard Loaded! ");
        System.out.println("==================================================================");
    }

    static class HealthHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "{\"status\":\"healthy\",\"engine\":\"Java 25 OOP Engine\",\"port\":" + PORT + "}";
            sendJsonResponse(exchange, 200, response);
        }
    }

    static class OopInfoHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String json = "{\n" +
                    "  \"projectName\": \"AcademiaPro Student Grade Management System\",\n" +
                    "  \"language\": \"Java (OOP)\",\n" +
                    "  \"corePillars\": {\n" +
                    "    \"Encapsulation\": \"SubjectMarks & Student classes with private fields and validated mutators.\",\n" +
                    "    \"Inheritance\": \"Student extends abstract Person base class.\",\n" +
                    "    \"Polymorphism\": \"Comparable<Student> natural ordering and GradingStrategy interface implementation.\",\n" +
                    "    \"Abstraction\": \"GradingStrategy interface and abstract Person class definition.\"\n" +
                    "  },\n" +
                    "  \"classes\": [\"Person\", \"Student\", \"SubjectMarks\", \"GradingStrategy\", \"StandardGradingStrategy\", \"StudentManagementSystem\", \"GradeFileManager\"]\n" +
                    "}";
            sendJsonResponse(exchange, 200, json);
        }
    }

    static class StudentsApiHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            if ("GET".equalsIgnoreCase(exchange.getRequestMethod())) {
                StringBuilder sb = new StringBuilder("[");
                int count = 0;
                for (Student s : system.getAllStudents()) {
                    if (count++ > 0) sb.append(",");
                    SubjectMarks m = s.getMarks();
                    sb.append(String.format(
                            "{\"id\":\"%s\",\"name\":\"%s\",\"rollNumber\":\"%s\",\"studentClass\":\"%s\",\"attendance\":%d,\"email\":\"%s\"," +
                                    "\"marks\":{\"math\":%.1f,\"science\":%.1f,\"english\":%.1f,\"computer\":%.1f,\"social\":%.1f}," +
                                    "\"total\":%.1f,\"percentage\":%.1f,\"cgpa\":%.2f,\"grade\":\"%s\",\"status\":\"%s\",\"rank\":%d}",
                            escapeJson(s.getId()), escapeJson(s.getName()), escapeJson(s.getRollNumber()),
                            escapeJson(s.getStudentClass()), s.getAttendancePercentage(), escapeJson(s.getEmail()),
                            m.getMathematics(), m.getScience(), m.getEnglish(), m.getComputerScience(), m.getSocialStudies(),
                            s.getTotalMarks(), s.getPercentage(), s.getGpa(), s.getGrade(), s.getStatus(), s.getRank()
                    ));
                }
                sb.append("]");
                sendJsonResponse(exchange, 200, sb.toString());
            } else {
                sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
            }
        }
    }

    static class StaticFileHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String pathStr = exchange.getRequestURI().getPath();
            if (pathStr.equals("/") || pathStr.isEmpty()) {
                pathStr = "/index.html";
            }

            Path filePath = WEB_ROOT.resolve(pathStr.substring(1)).normalize();
            if (!filePath.startsWith(WEB_ROOT) || !Files.exists(filePath) || Files.isDirectory(filePath)) {
                String notFound = "<h1>404 File Not Found</h1>";
                exchange.sendResponseHeaders(404, notFound.length());
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(notFound.getBytes(StandardCharsets.UTF_8));
                }
                return;
            }

            String contentType = getMimeType(filePath.toString());
            byte[] bytes = Files.readAllBytes(filePath);

            exchange.getResponseHeaders().set("Content-Type", contentType);
            exchange.sendResponseHeaders(200, bytes.length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(bytes);
            }
        }
    }

    private static String getMimeType(String path) {
        if (path.endsWith(".html")) return "text/html; charset=utf-8";
        if (path.endsWith(".css")) return "text/css; charset=utf-8";
        if (path.endsWith(".js")) return "application/javascript; charset=utf-8";
        if (path.endsWith(".json")) return "application/json; charset=utf-8";
        if (path.endsWith(".png")) return "image/png";
        if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
        if (path.endsWith(".svg")) return "image/svg+xml";
        return "application/octet-stream";
    }

    private static void sendJsonResponse(HttpExchange exchange, int status, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=utf-8");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.sendResponseHeaders(status, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static String escapeJson(String str) {
        if (str == null) return "";
        return str.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "");
    }
}
