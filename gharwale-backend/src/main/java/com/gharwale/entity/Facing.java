package com.gharwale.entity;

public enum Facing {
    North, South, East, West,
    NorthEast("North-East"), NorthWest("North-West"),
    SouthEast("South-East"), SouthWest("South-West");

    private final String value;

    Facing() { this.value = this.name(); }
    Facing(String value) { this.value = value; }

    public String getValue() { return value; }
    public static Facing fromValue(String dbValue) {
        for (Facing f : values()) {
            if (f.value.equalsIgnoreCase(dbValue)) {
                return f;
            }
        }
        throw new IllegalArgumentException("Unknown Facing: " + dbValue);
    }
}
