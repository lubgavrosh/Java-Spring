package org.example.dto.product;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class ProductCreateDTO {
    @NotBlank(message = "Назва є обов'язковою")
    private String name;
    @NotBlank(message = "Опис є обов'язковим")
    private String description;
    private List<MultipartFile> images;
    private int categoryId;
}