package com.military.assetmanagement.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bases")
public class Base {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 20)
    private String code;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "command_region", length = 50)
    private String commandRegion;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public Base() {}

    public Base(Long id, String name, String code, String location, String commandRegion) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.location = location;
        this.commandRegion = commandRegion;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCommandRegion() { return commandRegion; }
    public void setCommandRegion(String commandRegion) { this.commandRegion = commandRegion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
