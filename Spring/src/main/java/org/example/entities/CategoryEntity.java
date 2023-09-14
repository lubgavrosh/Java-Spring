package org.example.entities;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name="tbl_categories")
public class CategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="name", length = 250, nullable = false)
    private String name;
    @Column(name="description", length = 4000, nullable = true)
    private String description;
    @Column(name="image", length = 200, nullable = true)
    private String image;

}