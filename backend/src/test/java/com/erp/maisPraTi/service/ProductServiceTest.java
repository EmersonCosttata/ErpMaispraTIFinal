package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.dto.products.ProductDto;
import com.erp.maisPraTi.dto.products.ProductUpdateDto;
import com.erp.maisPraTi.dto.saleItems.SaleInsertItemDto;
import com.erp.maisPraTi.enums.UnitOfMeasure;
import com.erp.maisPraTi.fixture.ProductFixture;
import com.erp.maisPraTi.model.Product;
import com.erp.maisPraTi.repository.ProductRepository;
import com.erp.maisPraTi.service.exceptions.DatabaseException;
import com.erp.maisPraTi.service.exceptions.InvalidValueException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import com.erp.maisPraTi.util.EntityMapper;
import jakarta.persistence.Converter;
import jakarta.persistence.EntityNotFoundException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static com.erp.maisPraTi.util.EntityMapper.convertToDto;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @InjectMocks
    private ProductService productService;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private EntityMapper entityMapper;

    @Mock
    private Converter converter;

    private ProductDto productDto;

    @Mock
    private SupplierService supplierService;
    private Product product;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

    }

    @Test
    void deveInserirProdutoComSucesso() {
        ProductDto productDto = new ProductDto();
        productDto.setName("Produto Exemplo");
        productDto.setProductPrice(new BigDecimal("150.00"));

        Product product = ProductFixture.productFixture();
        when(productRepository.save(any(Product.class))).thenReturn(product);

        ProductDto result = productService.insert(productDto);

        assertNotNull(result);
        assertEquals("Produto Exemplo", result.getName());
    }

    @Test
    void deveLancarExcecaoQuandoPrecoNegativo() {
        ProductDto productDto = new ProductDto();
        productDto.setProductPrice(new BigDecimal("-10.00"));

        assertThrows(InvalidValueException.class, () -> productService.insert(productDto));
    }

    @Test
    void deveRetornarProdutoQuandoBuscarPorId() {
        Product product = ProductFixture.productFixture();
        when(productRepository.findById(anyLong())).thenReturn(Optional.of(product));

        Optional<ProductDto> result = productService.findById(1L);

        assertTrue(result.isPresent());
        assertEquals("Produto Exemplo", result.get().getName());
    }

    @Test
    void deveLancarExcecaoQuandoIdNaoExistenteAoBuscar() {
        when(productRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.findById(1L));
    }

    @Test
    void deveLancarExcecaoQuandoPrecoForNulo() {
        ProductDto productDto = new ProductDto();
        productDto.setProductPrice(null);

        assertThrows(InvalidValueException.class, () -> productService.insert(productDto));
    }



    @Test
    void deveAtualizarListaDeFornecedoresQuandoListaFornecida() {
        ProductDto productDto = new ProductDto();
        productDto.setName("Produto Exemplo");
        productDto.setProductPrice(new BigDecimal("150.00"));

        SupplierSimpleDto supplierDto = new SupplierSimpleDto();
        supplierDto.setId(1L);
        supplierDto.setFullName("Fornecedor Exemplo");

        List<SupplierSimpleDto> suppliers = List.of(supplierDto);

        productDto.setSuppliers(suppliers);

        SupplierDto supplierDtoResult = new SupplierDto();
        supplierDtoResult.setId(supplierDto.getId());
        supplierDtoResult.setFullName(supplierDto.getFullName());

        when(supplierService.findById(supplierDto.getId())).thenReturn(Optional.of(supplierDtoResult));
        Product product = ProductFixture.productFixture();
        when(productRepository.save(any(Product.class))).thenReturn(product);

        productService.insert(productDto);

        verify(supplierService, times(1)).findById(supplierDto.getId());
    }



    @Test
    void deveLancarExcecaoAoAtualizarProdutoComIdInexistente() {
        when(productRepository.existsById(anyLong())).thenReturn(false);

        ProductUpdateDto updateDto = new ProductUpdateDto();
        assertThrows(ResourceNotFoundException.class, () -> productService.update(1L, updateDto));
    }



    @Test
    public void deveRetornarPaginaDeProductDto() {
        Pageable pageable = PageRequest.of(0, 10);

        // Usando a fixture para criar produtos e ajustando apenas os atributos necessários
        Product product1 = ProductFixture.productFixture();
        product1.setId(1L);
        product1.setName("Produto 1");
        product1.setProductPrice(BigDecimal.valueOf(100.0));

        Product product2 = ProductFixture.productFixture();
        product2.setId(2L);
        product2.setName("Produto 2");
        product2.setProductPrice(BigDecimal.valueOf(200.0));

        List<Product> products = Arrays.asList(product1, product2);
        Page<Product> productPage = new PageImpl<>(products, pageable, products.size());

        when(productRepository.findAll(pageable)).thenReturn(productPage);

        Page<ProductDto> result = productService.findAll(pageable);

        assertEquals(2, result.getContent().size());
        assertEquals("Produto 1", result.getContent().get(0).getName());
        assertEquals("Produto 2", result.getContent().get(1).getName());
        assertEquals(pageable, result.getPageable());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoEncontrado() {
        Long productId = 1L;

        // Simula que o produto não existe no banco
        when(productRepository.existsById(productId)).thenReturn(false);

        // Chama o serviço e verifica que a ResourceNotFoundException é lançada
        assertThrows(ResourceNotFoundException.class, () -> productService.delete(productId));
    }

    @Test
    void deveLancarExcecaoDeIntegridadeQuandoErroAoAtualizarProduto() {
        // Arrange
        Long productId = 1L;
        ProductUpdateDto productUpdateDto = new ProductUpdateDto();
        productUpdateDto.setSuppliers(Collections.emptyList());

        Product product = new Product();
        product.setId(productId);

        // Mockando o comportamento do repository
        Mockito.when(productRepository.findById(productId)).thenReturn(Optional.of(product)); // Produto existe
        Mockito.when(productRepository.getReferenceById(productId)).thenReturn(product);
        Mockito.when(productRepository.save(Mockito.any())).thenThrow(new DataIntegrityViolationException("Mocked DataIntegrityViolationException"));

        // Act & Assert
        DatabaseException exception = Assertions.assertThrows(DatabaseException.class, () -> {
            productService.update(productId, productUpdateDto);
        });

        Assertions.assertEquals("Não foi possível fazer a alteração neste produto.", exception.getMessage());
    }

    @Test
    void deveLancarExcecaoDeIntegridadeQuandoErroAoAtualizarEstoque() {
        // Arrange
        SaleInsertItemDto dto = new SaleInsertItemDto();
        dto.setProductId(1L);
        dto.setQuantitySold(BigDecimal.valueOf(10));

        Product product = new Product();
        product.setId(1L);
        product.setReservedStock(BigDecimal.ZERO);

        // Mockando o comportamento do repository
        Mockito.when(productRepository.findById(1L)).thenReturn(Optional.of(product)); // Produto existe
        Mockito.when(productRepository.getReferenceById(1L)).thenReturn(product);
        Mockito.when(productRepository.save(Mockito.any())).thenThrow(new DataIntegrityViolationException("Mocked DataIntegrityViolationException"));

        // Act & Assert
        DatabaseException exception = Assertions.assertThrows(DatabaseException.class, () -> {
            productService.updateStockBySale(dto);
        });

        Assertions.assertEquals("Não foi possível fazer a alteração neste produto.", exception.getMessage());
    }


    @Test
    void deveLancarExcecaoQuandoProdutoNaoExiste() {
        // Arrange
        SaleInsertItemDto dto = new SaleInsertItemDto();
        dto.setProductId(1L);

        when(productRepository.existsById(1L)).thenReturn(false);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> productService.updateStockBySale(dto));
    }

    @Test
    void deveAtualizarEstoqueComSucesso() {
        // Arrange
        Long productId = 1L;
        BigDecimal quantitySold = BigDecimal.valueOf(5);

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para verifyExistsId (mockando findById para garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para getReferenceById - retorna o produto existente
        when(productRepository.getReferenceById(productId)).thenReturn(product);

        // Mock para save - simula o sucesso na operação de salvar
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        // Chamando o método para atualizar o estoque
        productService.updateStockBySale(productId, quantitySold);

        // Assert
        // Verificando se o estoque reservado foi atualizado corretamente
        assertEquals(BigDecimal.valueOf(15), product.getReservedStock());
    }

    @Test
    void deveLancarDatabaseExceptionQuandoErroDeIntegridade() {
        // Arrange
        Long productId = 1L;
        BigDecimal quantitySold = BigDecimal.valueOf(5);

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para verifyExistsId (mockando findById para garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para getReferenceById - retorna o produto existente
        when(productRepository.getReferenceById(productId)).thenReturn(product);

        // Mock para save - lança uma DataIntegrityViolationException simulada
        when(productRepository.save(any(Product.class))).thenThrow(DataIntegrityViolationException.class);

        // Act & Assert
        // Verifica se a DatabaseException é lançada quando há erro de integridade
        assertThrows(DatabaseException.class, () -> productService.updateStockBySale(productId, quantitySold));
    }
    @Test
    void deveAtualizarEstoqueComSucessoAoAtualizarVenda() {
        // Arrange
        Long productId = 1L;
        BigDecimal updatedSold = BigDecimal.valueOf(5); // Quantidade a ser atualizada no estoque

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para findById (garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para save - simula o sucesso na operação de salvar
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        // Chamando o método para atualizar o estoque
        productService.updateStockByUpdateSale(productId, updatedSold);

        // Assert
        // Verificando se o estoque reservado foi atualizado corretamente
        assertEquals(BigDecimal.valueOf(15), product.getReservedStock());
    }

    @Test
    void deveLancarResourceNotFoundExceptionQuandoProdutoNaoExistir() {
        // Arrange
        Long productId = 1L;
        BigDecimal updatedSold = BigDecimal.valueOf(5); // Quantidade a ser atualizada no estoque

        // Mock para findById - simulando que o produto não existe
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        // Verifica se a ResourceNotFoundException é lançada quando o produto não for encontrado
        assertThrows(ResourceNotFoundException.class, () -> productService.updateStockByUpdateSale(productId, updatedSold));
    }

    @Test
    void deveLancarDatabase2ExceptionQuandoErroDeIntegridade() {
        // Arrange
        Long productId = 1L;
        BigDecimal updatedSold = BigDecimal.valueOf(5); // Quantidade a ser atualizada no estoque

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para findById (garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para save - lança uma DataIntegrityViolationException simulada
        when(productRepository.save(any(Product.class))).thenThrow(DataIntegrityViolationException.class);

        // Act & Assert
        // Verifica se a DatabaseException é lançada quando há erro de integridade
        assertThrows(DatabaseException.class, () -> productService.updateStockByUpdateSale(productId, updatedSold));
    }
    @Test
    void deveAtualizarEstoqueComSucessoAoRemoverItemDeVenda() {
        // Arrange
        Long productId = 1L;
        BigDecimal quantityUpdate = BigDecimal.valueOf(5); // Quantidade a ser subtraída do estoque

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para findById (garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para save - simula o sucesso na operação de salvar
        Product savedProduct = new Product();
        savedProduct.setId(productId);
        savedProduct.setReservedStock(BigDecimal.valueOf(5)); // Estoque reservado após a subtração

        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);

        // Act
        // Chamando o método para atualizar o estoque
        productService.updateDeletedItemToSaleItems(productId, quantityUpdate);

        // Assert
        // Verificando se o estoque reservado foi atualizado corretamente (subtraindo a quantidade)
        assertEquals(BigDecimal.valueOf(5), savedProduct.getReservedStock());
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoForEncontradoParaRemoverItem() {
        // Arrange
        Long productId = 1L;
        BigDecimal quantityUpdate = BigDecimal.valueOf(5); // Quantidade a ser subtraída do estoque

        // Mock para findById - simulando que o produto não existe
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        // Verifica se a ResourceNotFoundException é lançada quando o produto não for encontrado
        assertThrows(ResourceNotFoundException.class, () -> productService.updateDeletedItemToSaleItems(productId, quantityUpdate));
    }

    @Test
    void deveLancarExcecaoQuandoErroDeIntegridadeOcorreAoAtualizarEstoque() {
        // Arrange
        Long productId = 1L;
        BigDecimal quantityUpdate = BigDecimal.valueOf(5); // Quantidade a ser subtraída do estoque

        // Criação do produto mockado
        Product product = new Product();
        product.setId(productId);
        product.setReservedStock(BigDecimal.valueOf(10)); // Estoque reservado inicial

        // Mock para findById (garantir que o produto exista)
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Mock para save - lança uma DataIntegrityViolationException simulada
        when(productRepository.save(any(Product.class))).thenThrow(DataIntegrityViolationException.class);

        // Act & Assert
        // Verifica se a DatabaseException é lançada quando há erro de integridade
        assertThrows(DatabaseException.class, () -> productService.updateDeletedItemToSaleItems(productId, quantityUpdate));
    }

    @Test
    void deveExcluirProdutoComSucesso() {
        // Arrange
        Long productId = 1L;
        Product product = new Product(); // Criando um produto para o teste

        // Mock para retornar um Optional com o produto, simulando que o produto existe
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Act
        productService.delete(productId);

        // Assert
        // Verifica se o delete foi chamado corretamente
        verify(productRepository).deleteById(productId);
    }

    @Test
    void deveLancarExcecaoQuandoProdutoNaoForEncontradoParaExcluir() {
        // Arrange
        Long productId = 1L;

        // Mock para retornar Optional.empty(), simulando que o produto não foi encontrado
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        // Verifica se a ResourceNotFoundException é lançada quando o produto não for encontrado
        assertThrows(ResourceNotFoundException.class, () -> productService.delete(productId));
    }

    @Test
    void deveLancarExcecaoQuandoErroDeIntegridadeOcorreAoExcluirProduto() {
        // Arrange
        Long productId = 1L;
        Product product = new Product(); // Criando um produto para o teste

        // Mock para retornar o produto, simulando que ele existe
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Simula o erro de integridade, lançando uma DataIntegrityViolationException
        doThrow(DataIntegrityViolationException.class).when(productRepository).deleteById(productId);

        // Act & Assert
        // Verifica se a DatabaseException é lançada quando há erro de integridade
        assertThrows(DatabaseException.class, () -> productService.delete(productId));
    }

    @Test
    void deveLancarExcecaoQuandoErroInesperadoOcorreAoExcluirProduto() {
        // Arrange
        Long productId = 1L;
        Product product = new Product(); // Criando um produto para o teste

        // Mock para retornar o produto, simulando que ele existe
        when(productRepository.findById(productId)).thenReturn(Optional.of(product));

        // Simula o erro genérico, lançando uma RuntimeException
        doThrow(RuntimeException.class).when(productRepository).deleteById(productId);

        // Act & Assert
        // Verifica se a DatabaseException é lançada em caso de erro inesperado
        assertThrows(DatabaseException.class, () -> productService.delete(productId));
    }

    @Test
    void testUpdateItemDeliveryQuantity_Success() {
        // Arrange
        BigDecimal quantityDelivery = new BigDecimal("5");
        Product product = new Product();
        product.setStock(new BigDecimal("100"));
        product.setReservedStock(new BigDecimal("10"));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        productService.updateItemDeliveryQuantity(1L, quantityDelivery);

        // Assert
        assertEquals(new BigDecimal("95"), product.getStock()); // Estoque após a subtração
        assertEquals(new BigDecimal("5"), product.getReservedStock()); // Estoque reservado após a subtração
        verify(productRepository).save(product); // Verifica se o método save foi chamado
    }


}




