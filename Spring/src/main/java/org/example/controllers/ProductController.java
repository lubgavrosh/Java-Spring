package org.example.controllers;

import lombok.AllArgsConstructor;
import org.example.dto.product.ProductCreateDTO;
import org.example.dto.product.ProductItemDTO;
import org.example.dto.product.ProductUpdateDTO;
import org.example.entities.ProductEntity;
import org.example.entities.ProductImageEntity;
import org.example.mappers.ProductMapper;
import org.example.repositories.ProductImageRepository;
import org.example.repositories.ProductRepository;
import org.example.storage.FileSaveFormat;
import org.example.storage.StorageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("api/products")
public class ProductController {
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final ProductMapper productMapper;
    private final StorageService storageService;

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ProductItemDTO> create(@ModelAttribute ProductCreateDTO dto) {
        var p = productMapper.productByCreateProductDTO(dto);
        p.setImages(new ArrayList<>());
        productRepository.save(p);
        for (MultipartFile image : dto.getImages()) {
            var imageSave = storageService.saveByFormat(image, FileSaveFormat.JPG);
            var pi = new ProductImageEntity()
                    .builder()
                    .image(imageSave)
                    .product(p)
                    .build();
            productImageRepository.save(pi);
            p.getImages().add(pi);
        }
        return ResponseEntity.ok().body(productMapper.productToItemDTO(p));
    }

    @PutMapping(value = "{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Transactional // Добавляем аннотацию для транзакций
    public ResponseEntity<ProductItemDTO> updateProduct(@PathVariable int id, @ModelAttribute ProductUpdateDTO dto) {
        try {
            Optional<ProductEntity> existingProduct = productRepository.findById(id);

            if (existingProduct.isPresent()) {
                ProductEntity product = productMapper.productByUpdateProductDTO(dto);
                product.setImages(new ArrayList<>());
                product.setId(id);

                List<ProductImageEntity> existingImages = existingProduct.get().getImages();
                if (!existingImages.isEmpty()) { // Проверяем, что список изображений не пустой
                    for (ProductImageEntity existingImage : existingImages) {
                        storageService.removeFile(existingImage.getImage());
                        productImageRepository.deleteById(existingImage.getId());
                    }
                }

                for (MultipartFile image : dto.getImages()) {
                    String imageSave = storageService.saveByFormat(image, FileSaveFormat.JPG);
                    var pi = new ProductImageEntity()
                            .builder()
                            .image(imageSave)
                            .product(product)
                            .build();
                    productImageRepository.save(pi);
                    product.getImages().add(pi);
                }
                productRepository.save(product);
                return ResponseEntity.ok().body(productMapper.productToItemDTO(product));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            // Обработка ошибок или логирование
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("{id}")
    public ResponseEntity<ProductItemDTO> getProduct(@PathVariable int id) {
        return productRepository.findById(id)
                .map(product -> ResponseEntity.ok().body(productMapper.productToItemDTO(product)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping()
    public ResponseEntity<List<ProductItemDTO>> getAllCategories() {
        return ResponseEntity.ok(productMapper.listProductsToItemDTO(productRepository.findAll()));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable int id) {
        Optional<ProductEntity> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {
            ProductEntity product = optionalProduct.get();
            List<ProductImageEntity> productImages = product.getImages();
            for (ProductImageEntity productImage : productImages) {
                storageService.removeFile(productImage.getImage());
            }
            productRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{productId}/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable int productId, @PathVariable int imageId) {
        Optional<ProductEntity> optionalProduct = productRepository.findById(productId);

        if (optionalProduct.isPresent()) {
            ProductEntity product = optionalProduct.get();
            List<ProductImageEntity> productImages = product.getImages();

            // Пошук фотографії за imageId
            Optional<ProductImageEntity> optionalImage = productImages.stream()
                    .filter(image -> image.getId() == imageId)
                    .findFirst();

            if (optionalImage.isPresent()) {
                ProductImageEntity imageToDelete = optionalImage.get();
                storageService.removeFile(imageToDelete.getImage());
                productImages.remove(imageToDelete); // Видалення фотографії зі списку фотографій продукта
                productImageRepository.deleteById(imageToDelete.getId()); // Видалення фотографії з репозиторію фотографій
                productRepository.save(product); // Оновлення продукта у репозиторії продуктів
                return ResponseEntity.noContent().build();
            } else {
                return ResponseEntity.notFound().build(); // Фотографія не знайдена
            }
        } else {
            return ResponseEntity.notFound().build(); // Продукт не знайдений
        }
    }
}