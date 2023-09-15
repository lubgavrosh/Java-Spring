package org.example.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Table(name="tbl_product_images")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    @Column(name="image", length = 250, nullable = false)
    private String image;
    @ManyToOne
    @JoinColumn(name="product_id", nullable = false)
    private ProductEntity product;
}