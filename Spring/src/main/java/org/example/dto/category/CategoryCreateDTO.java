package org.example.dto.category;


import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
  @Data
    public class CategoryCreateDTO {
        @NotBlank(message = "Назва є обов'язковою")
        private String name;
        @NotBlank(message = "Опис є обов'язковим")
        private String description;
      private MultipartFile image;

}