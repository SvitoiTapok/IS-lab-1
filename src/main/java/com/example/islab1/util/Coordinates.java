package com.example.islab1.util;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "coordinastes")
public class Coordinates {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;


    private float x;
    @Column(name = "y",
    columnDefinition = "INTEGER CHECK(y>-563)")
    private int y; //Значение поля должно быть больше -563
}
