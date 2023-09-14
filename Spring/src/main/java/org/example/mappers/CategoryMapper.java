package org.example.mappers;

import org.example.dto.category.CategoryCreateDTO;
import org.example.dto.category.CategoryItemDTO;
import org.example.dto.category.CategoryUpdateDTO;
import org.example.entities.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(source = "image", target = "imageAvatar", qualifiedByName = "imageAvatar")
    @Mapping(source = "image", target = "imageSmall", qualifiedByName = "imageSmall")
    @Mapping(source = "image", target = "imageNormal", qualifiedByName = "imageNormal")
    @Mapping(source = "image", target = "imageLarge", qualifiedByName = "imageLarge")
    CategoryItemDTO categoryToCategoryItemDTO(CategoryEntity category);
    List<CategoryItemDTO> listCategoriesToListCategoryItemDTO(List<CategoryEntity> categories);
    @Mapping(source = "image", target = "image", ignore = true)
    CategoryEntity createCategoryToCategory(CategoryCreateDTO dto);

    @Mapping(source = "image", target = "image", ignore = true)
    CategoryEntity updateCategoryToCategory(CategoryUpdateDTO dto);

    @Named("imageAvatar")
    public static String imageAvatar(String image) {
        return "images/32_"+image;
    }
    @Named("imageSmall")
    public static String imageSmall(String image) {
        return "images/150_"+image;
    }

    @Named("imageNormal")
    public static String imageNormal(String image) {
        return "images/300_"+image;
    }

    @Named("imageLarge")
    public static String imageLarge(String image) {
        return "images/600_"+image;
    }
}