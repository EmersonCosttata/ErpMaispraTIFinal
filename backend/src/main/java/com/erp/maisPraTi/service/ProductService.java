package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.dto.products.ProductDto;
import com.erp.maisPraTi.dto.products.ProductUpdateDto;
import com.erp.maisPraTi.dto.saleItems.SaleInsertItemDto;
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
import java.util.List;
import java.util.Objects;
import java.util.Optional;

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
        validPrice(productDto.getProductPrice());
        Product product = convertToEntity(productDto, Product.class);
        insertOrUpdateSuppliers(productDto.getSuppliers(), product);
        if(productDto.getStock() != null)
            product.setStock(productDto.getStock());
        product = productRepository.save(product);
        return convertToDto(product, ProductDto.class);
    }

    public void validPrice(BigDecimal price) {
        if (price == null || price.compareTo(BigDecimal.ZERO) < 0) {
            throw new InvalidValueException("O preço de custo do produto não pode ser nulo ou negativo.");
        }
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

    @Transactional(readOnly = true)
    void verifyExistsId(Long id) {
        if (productRepository.findById(id).isEmpty()) {
            throw new ResourceNotFoundException("Produto não localizado.");
        }
    }

    @Transactional
    private void insertOrUpdateSuppliers(List<SupplierSimpleDto> supplierDtos, Product product) {
        if (Objects.isNull(supplierDtos)) {
            return; // Ignorar a atualização dos fornecedores se a lista for nula
        }
        // Limpa a lista de fornecedores do produto, se não for nula
        if (Objects.nonNull(product) && Objects.nonNull(product.getSuppliers())) {
            product.getSuppliers().clear();
        }
        // Itera sobre os SupplierSimpleDto fornecidos
        supplierDtos.forEach(supplierDto -> {
            Supplier supplier = convertToEntity(supplierService.findById(supplierDto.getId()), Supplier.class);
            product.getSuppliers().add(supplier);
        });
    }

    @Transactional
    public void updateStockBySale(SaleInsertItemDto dto) {
        verifyExistsId(dto.getProductId());
        try {
            Product product = productRepository.getReferenceById(dto.getProductId());
            product.setReservedStock(product.getReservedStock().add(dto.getQuantitySold()));
            productRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste produto.");
        }
    }

    @Transactional
    public void updateStockBySale(Long productId, BigDecimal quantitySold) {
        verifyExistsId(productId);
        try {
            Product product = productRepository.getReferenceById(productId);
            product.setReservedStock(product.getReservedStock().add(quantitySold));
            productRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste produto.");
        }
    }

    @Transactional
    public void updateStockByUpdateSale(Long productId, BigDecimal updatedSold) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não localizado."));
            product.setReservedStock(product.getReservedStock().add(updatedSold));
            productRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste produto.");
        }
    }

    @Transactional
    public void updateDeletedItemToSaleItems(Long productId, BigDecimal quantityUpdate) {
        try {
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new ResourceNotFoundException("Produto não localizado."));
            product.setReservedStock(product.getReservedStock().subtract(quantityUpdate));
            productRepository.save(product);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste produto.");
        }
    }

    public void updateItemDeliveryQuantity(Long productId, BigDecimal quantityDelivery) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não localizado."));
        product.setReservedStock(product.getReservedStock().subtract(quantityDelivery));
        product.setStock(product.getStock().subtract(quantityDelivery));
        productRepository.save(product);
    }
}

