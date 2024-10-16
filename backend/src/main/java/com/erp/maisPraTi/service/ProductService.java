package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.products.ProductDto;
import com.erp.maisPraTi.dto.products.ProductUpdateDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.model.Product;
import com.erp.maisPraTi.model.Supplier;
import com.erp.maisPraTi.repository.ProductRepository;
import com.erp.maisPraTi.service.exceptions.DatabaseException;
import com.erp.maisPraTi.service.exceptions.InvalidValueException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

import static com.erp.maisPraTi.util.EntityMapper.convertToDto;
import static com.erp.maisPraTi.util.EntityMapper.convertToEntity;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private SupplierService supplierService;

    @Transactional
    public ProductDto insert(ProductDto productDto) {
        validPrice(productDto.getPrice());
        Product product = convertToEntity(productDto, Product.class);
        insertOrUpdateSuppliers(productDto.getSuppliers(), product);
        if(productDto.getStock() != null)
            product.setStock(productDto.getStock());
        product = productRepository.save(product);
        return convertToDto(product, ProductDto.class);
    }

    @Transactional(readOnly = true)
    public Optional<ProductDto> findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não localizado: " + id));
        return Optional.of(convertToDto(product, ProductDto.class));
    }

    public Page<ProductDto> findAll(Pageable pageable) {
        Page<Product> products = productRepository.findAll(pageable);
        return products.map(c -> convertToDto(c, ProductDto.class));
    }

    @Transactional
    public ProductDto update(Long id, ProductUpdateDto productUpdateDto) {
        verifyExistsId(id);
        try {
            Product product = productRepository.getReferenceById(id);
            convertToEntity(productUpdateDto, product);
            insertOrUpdateSuppliers(productUpdateDto.getSuppliers(), product);
            product = productRepository.save(product);
            return convertToDto(product, ProductDto.class);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste produto.");
        } catch (Exception e) {
            throw new DatabaseException("Erro inesperado ao tentar atualizar produto.");
        }
    }

    @Transactional
    public void delete(Long id) {
        verifyExistsId(id);
        try {
            productRepository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível excluir este produto. Ele pode estar vinculado a outros registros.");
        } catch (Exception e) {
            throw new DatabaseException("Erro inesperado ao tentar excluir o produto.");
        }
    }

    private void verifyExistsId(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Id não localizado: " + id);
        }
    }

    private void insertOrUpdateSuppliers(List<SupplierSimpleDto> supplierDtos, Product product) {
        if(Objects.nonNull(product) && Objects.nonNull(product.getSuppliers())) product.getSuppliers().clear();
        supplierDtos.stream().forEach(supplierDto -> {
            Supplier supplier = convertToEntity(supplierService.findById(supplierDto.getId()), Supplier.class);
            product.getSuppliers().add(supplier);
        });
    }

    public void validPrice(BigDecimal price){
        if(price.compareTo(BigDecimal.ZERO) < 0)
            throw new InvalidValueException("O preço de custo do produto não pode ser negativo.");
    }

}


