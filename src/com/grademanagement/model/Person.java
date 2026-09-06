package com.grademanagement.model;

/**
 * Abstract Base Class: Person
 * Demonstrates: ABSTRACTION & INHERITANCE
 */
public abstract class Person {
    protected String id;
    protected String name;
    protected String email;

    public Person(String id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // Abstract method demonstrating Polymorphism in derived classes
    public abstract String getRoleDescription();

    @Override
    public String toString() {
        return String.format("Person [ID=%s, Name=%s, Email=%s]", id, name, email);
    }
}
