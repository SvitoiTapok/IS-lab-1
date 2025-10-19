package com.example.islab1.util;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

public class City {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; //Поле не может быть null, Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически
    private String name; //Поле не может быть null, Строка не может быть пустой
    private Coordinates coordinates; //Поле не может быть null
    private java.time.LocalDateTime creationDate; //Поле не может быть null, Значение этого поля должно генерироваться автоматически
    private Integer area; //Значение поля должно быть больше 0, Поле не может быть null
    private Long population; //Значение поля должно быть больше 0, Поле не может быть null
    private java.time.LocalDateTime establishmentDate;
    private Boolean capital; //Поле не может быть null
    private double metersAboveSeaLevel;
    private Integer populationDensity; //Значение поля должно быть больше 0
    private int telephoneCode; //Значение поля должно быть больше 0, Максимальное значение поля: 100000
    private Climate climate; //Поле может быть null
    private Human governor; //Поле не может быть null
}
