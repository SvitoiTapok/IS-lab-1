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
@Table(name = "humans")
public class Human {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(
            name = "name",
    columnDefinition = "TEXT NOT NULL CHECK (LENGTH(name) > 0)")
    private String name; //Поле не может быть null, Строка не может быть пустой
}
