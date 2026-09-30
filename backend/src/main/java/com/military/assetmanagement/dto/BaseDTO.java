package com.military.assetmanagement.dto;

public class BaseDTO {
    private Long id;
    private String name;
    private String code;
    private String location;
    private String commandRegion;

    public BaseDTO() {}

    public BaseDTO(Long id, String name, String code, String location, String commandRegion) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.location = location;
        this.commandRegion = commandRegion;
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
}
