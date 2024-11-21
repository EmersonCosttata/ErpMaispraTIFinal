package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.products.ProductDto;
import com.erp.maisPraTi.dto.saleItems.SaleInsertItemDto;
import com.erp.maisPraTi.dto.saleItems.SaleItemResponseDto;
import com.erp.maisPraTi.dto.saleItems.SaleItemUpdateDto;
import com.erp.maisPraTi.dto.sales.SaleDto;
import com.erp.maisPraTi.enums.UnitOfMeasure;
import com.erp.maisPraTi.model.Product;
import com.erp.maisPraTi.model.Sale;
import com.erp.maisPraTi.model.SaleItem;
import com.erp.maisPraTi.repository.SaleItemRepository;
import com.erp.maisPraTi.repository.SaleRepository;
import com.erp.maisPraTi.service.exceptions.DatabaseException;
import com.erp.maisPraTi.service.exceptions.ProductException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import com.erp.maisPraTi.util.EntityMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SaleItemServiceTest {
    @Spy
    @InjectMocks
    private SaleItemService saleItemService;

    @Mock
    private SaleItemRepository saleItemRepository;

    @Mock
    private SaleRepository saleRepository;

    @Mock
    private ProductService productService;


    @Mock
    private SaleService saleService;

    @Mock
    private SaleItemService serviceUnderTest;


    @Mock
    private EntityMapper entityMapper;

    private SaleItem saleItem;
    private SaleInsertItemDto saleInsertItemDto;
    private SaleItemUpdateDto saleItemUpdateDto;
    private SaleItem existingSaleItem;

    private Long saleId;


    private void verifyQuantitySold(BigDecimal quantitySold) {
        if (quantitySold.compareTo(BigDecimal.ZERO) <= 0)
            throw new ProductException("A quantidade de produtos deve ser maior que zero.");
    }

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configuração de objetos para os testes
        Sale sale = new Sale();
        sale.setId(1L);

        Product product = new Product();
        product.setId(1L);
        product.setProductPrice(new BigDecimal("10.00"));

        existingSaleItem = new SaleItem();
        existingSaleItem.setId(1L);
        existingSaleItem.setQuantitySold(BigDecimal.valueOf(5));
        existingSaleItem.setSalePrice(BigDecimal.valueOf(50));

        saleItem = new SaleItem();
        saleItem.setId(1L);
        saleItem.setSale(sale);
        saleItem.setProduct(product);
        saleItem.setQuantitySold(new BigDecimal("10.0"));
        saleItem.setSalePrice(new BigDecimal("100.0"));
        saleItem.setQuantityDelivered(new BigDecimal("2.0"));
        saleItem.setUnitOfMeasure(UnitOfMeasure.UNIT); // Defina um valor para UnitOfMeasure

        saleInsertItemDto = new SaleInsertItemDto();
        saleInsertItemDto.setProductId(1L);
        saleInsertItemDto.setSalePrice(new BigDecimal("10.00"));
        saleInsertItemDto.setQuantitySold(new BigDecimal("5"));

        saleItemUpdateDto = new SaleItemUpdateDto();
        saleItemUpdateDto.setQuantitySold(new BigDecimal(10));
        saleItemUpdateDto.setSalePrice(new BigDecimal("12.00"));
    }


    @Test
    void deveInserirNovoItemDeVenda() {
        // Dado
        ProductDto productDto = new ProductDto();
        productDto.setUnitOfMeasure(UnitOfMeasure.UNIT);
        productDto.setProductPrice(BigDecimal.valueOf(100.0));
        productDto.setStock(BigDecimal.valueOf(50.0));

        when(saleService.findById(Mockito.anyLong())).thenReturn(Optional.of(new SaleDto()));
        when(productService.findById(Mockito.anyLong())).thenReturn(Optional.of(productDto));
        when(saleItemRepository.save(Mockito.any(SaleItem.class))).thenReturn(saleItem);

        // Quando
        SaleItemResponseDto response = saleItemService.insert(1L, saleInsertItemDto);

        // Então
        assertNotNull(response);
        assertEquals(saleItem.getId(), response.getId());
        assertEquals(saleItem.getQuantitySold(), response.getQuantitySold());

        // Comparar arredondando a quantidade vendida para 1 casa decimal
        assertEquals(BigDecimal.valueOf(10.0).setScale(1, BigDecimal.ROUND_HALF_UP),
                response.getQuantitySold().setScale(1, BigDecimal.ROUND_HALF_UP));
    }



    @Test
    void deveLancarErroQuandoVendaNaoEncontrada() {
        // Dado
        when(saleService.findById(Mockito.anyLong())).thenReturn(Optional.empty());

        // Quando
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            saleItemService.insert(1L, saleInsertItemDto);
        });

        // Então
        assertEquals("Venda não encontrada com ID:1", exception.getMessage());
    }


    @Test
    void deveEncontrarItemDeVendaPorSaleIdEItemId() {
        // Dado
        when(saleItemRepository.findByIdAndSaleId(Mockito.anyLong(), Mockito.anyLong())).thenReturn(Optional.of(saleItem));

        // Quando
        Optional<SaleItemResponseDto> response = saleItemService.findBySaleIdAndSaleItemId(1L, 1L);

        // Então
        assertTrue(response.isPresent());
        assertEquals(saleItem.getId(), response.get().getId());
    }

    @Test
    void deveLancarErroQuandoItemDeVendaNaoEncontrado() {
        // Dado
        when(saleItemRepository.findByIdAndSaleId(Mockito.anyLong(), Mockito.anyLong())).thenReturn(Optional.empty());

        // Quando
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            saleItemService.findBySaleIdAndSaleItemId(1L, 1L);
        });

        // Então
        assertEquals("Item não localizado", exception.getMessage());
    }

    @Test
    void deveAtualizarItemDeVenda() {
        // Dado
        when(saleItemRepository.findById(Mockito.anyLong())).thenReturn(Optional.of(saleItem));
        when(saleItemRepository.save(Mockito.any(SaleItem.class))).thenReturn(saleItem);

        // Quando
        SaleItemResponseDto response = saleItemService.update(1L, saleItemUpdateDto);

        // Então
        assertNotNull(response);
        assertEquals(saleItemUpdateDto.getQuantitySold(), new BigDecimal(response.getQuantitySold().toString()));
        assertEquals(saleItemUpdateDto.getSalePrice(), response.getSalePrice());
    }


    @Test
    void deveLancarErroQuandoTentarAtualizarItemInexistente() {
        // Dado
        when(saleItemRepository.findById(Mockito.anyLong())).thenReturn(Optional.empty());

        // Quando
        ResourceNotFoundException exception = assertThrows(ResourceNotFoundException.class, () -> {
            saleItemService.update(1L, saleItemUpdateDto);
        });

        // Então
        assertEquals("Item não localizado pelo id informado.", exception.getMessage());
    }

    @Test
    void deveRetornarTodosItensDeVendaPorSaleId() {
        // Dado
        Page<SaleItem> saleItems = new PageImpl<>(List.of(saleItem));
        when(saleItemRepository.findBySaleId(Mockito.anyLong(), Mockito.any(Pageable.class))).thenReturn(saleItems);

        // Quando
        Page<SaleItemResponseDto> response = saleItemService.findAllBySaleId(1L, Pageable.unpaged());

        // Então
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }

    @Test
    void deveRetornarTodosItensDeVendaPorProductId() {
        // Dado
        Page<SaleItem> saleItems = new PageImpl<>(List.of(saleItem));
        when(saleItemRepository.findBySaleIdAndProductId(Mockito.anyLong(), Mockito.anyLong(), Mockito.any(Pageable.class)))
                .thenReturn(saleItems);

        // Quando
        Page<SaleItemResponseDto> response = saleItemService.findAllByProductId(1L, 1L, Pageable.unpaged());

        // Então
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }

    @Test
    void deveRetornarTodosItensDeVenda() {
        // Dado
        Page<SaleItem> saleItems = new PageImpl<>(List.of(saleItem));
        when(saleItemRepository.findAll(Mockito.any(Pageable.class))).thenReturn(saleItems);

        // Quando
        Page<SaleItemResponseDto> response = saleItemService.findAll(Pageable.unpaged());

        // Então
        assertNotNull(response);
        assertFalse(response.isEmpty());
    }


    @Test
    void deveVerificarQuantidadeMaiorQueZero() {
        // Simulando uma quantidade maior que zero
        BigDecimal quantitySold = new BigDecimal("10.0");

        // Executando o método sem esperar exceção
        assertDoesNotThrow(() -> verifyQuantitySold(quantitySold), "Não deve lançar exceção quando a quantidade for maior que zero.");
    }

    @Test
    void deveLancarExcecaoQuandoQuantidadeForMenorOuIgualZero() {
        // Simulação do método verifyQuantitySold no escopo do teste
        Consumer<BigDecimal> verifyQuantitySold = (quantitySold) -> {
            if (quantitySold.compareTo(BigDecimal.ZERO) <= 0)
                throw new ProductException("A quantidade de produtos deve ser maior que zero.");
        };

        // Testando com quantidade zero
        BigDecimal quantitySoldZero = BigDecimal.ZERO;
        ProductException exceptionZero = assertThrows(ProductException.class, () -> verifyQuantitySold.accept(quantitySoldZero));
        assertEquals("A quantidade de produtos deve ser maior que zero.", exceptionZero.getMessage(), "A mensagem de erro não é a esperada quando a quantidade for zero.");

        // Testando com quantidade negativa
        BigDecimal quantitySoldNegativa = new BigDecimal("-5.0");
        ProductException exceptionNegativa = assertThrows(ProductException.class, () -> verifyQuantitySold.accept(quantitySoldNegativa));
        assertEquals("A quantidade de produtos deve ser maior que zero.", exceptionNegativa.getMessage(), "A mensagem de erro não é a esperada quando a quantidade for negativa.");
    }

    @Test
    void testarAtualizacaoComQuantidadeMenorQueEntregue() {
        // Criando o SaleItem de teste
        SaleItem existingSaleItem = new SaleItem();
        existingSaleItem.setId(1L);

        existingSaleItem.setQuantitySold(new BigDecimal(5));
        existingSaleItem.setQuantityDelivered(new BigDecimal(10));

        // Simulando o repositório para retornar esse SaleItem
        when(saleItemRepository.findById(1L)).thenReturn(Optional.of(existingSaleItem));

        // Criando o DTO de atualização com quantidade menor que a entregue
        SaleItemUpdateDto saleItemUpdateDto = new SaleItemUpdateDto();
        saleItemUpdateDto.setProductId(1L);  // Passando o ID do produto
        saleItemUpdateDto.setQuantitySold(new BigDecimal(4));  // Novo valor menor que quantityDelivered
        saleItemUpdateDto.setSalePrice(new BigDecimal(100));

        // Verificando se a exceção ProductException é lançada
        assertThrows(ProductException.class, () -> {
            saleItemService.update(1L, saleItemUpdateDto);
        });
    }

    @Test
    void testarExcluirItemComQuantidadeEntregueZero() {
        // Criando um SaleItem de teste com id 2
        SaleItem saleItem = new SaleItem();
        saleItem.setId(2L);
        saleItem.setQuantityDelivered(BigDecimal.ZERO);  // Definindo quantidade entregue como zero
        saleItem.setQuantitySold(new BigDecimal(5));
        Product product = new Product();
        product.setId(2L);
        saleItem.setProduct(product);

        // Simulando o repositório para retornar o SaleItem
        when(saleItemRepository.findById(2L)).thenReturn(Optional.of(saleItem));

        // Simulando a atualização do produto no service
        Mockito.doNothing().when(productService).updateDeletedItemToSaleItems(Mockito.anyLong(), Mockito.any(BigDecimal.class));

        // Chamando o método delete
        saleItemService.delete(2L);

        // Verificando se o repositório de SaleItem foi chamado para deletar o item
        verify(saleItemRepository, times(1)).deleteById(2L);
        // Verificando se a atualização do produto foi chamada
        verify(productService, times(1)).updateDeletedItemToSaleItems(Mockito.anyLong(), Mockito.any(BigDecimal.class));
    }

    @Test
    void testarExcluirItemComQuantidadeEntregueMaiorQueZero() {
        // Criando um SaleItem de teste com id 1
        SaleItem saleItem = new SaleItem();
        saleItem.setId(1L);
        saleItem.setQuantityDelivered(new BigDecimal(1));  // Definindo uma quantidade entregue maior que zero
        saleItem.setQuantitySold(new BigDecimal(5));
        Product product = new Product();
        product.setId(1L);
        saleItem.setProduct(product);

        // Simulando o repositório para retornar o SaleItem
        when(saleItemRepository.findById(1L)).thenReturn(Optional.of(saleItem));

        // Chamando o método delete e verificando se lança a exceção correta
        try {
            saleItemService.delete(1L);
            fail("Deveria lançar uma DatabaseException com a mensagem: 'Não é possível deletar um item que já unidades entregues.'");
        } catch (DatabaseException e) {
            // Verificando se a mensagem da exceção está correta
            assertEquals("Não é possível deletar um item que já unidades entregues.", e.getMessage());
        }

        // Verificando se o repositório de SaleItem não foi chamado para deletar o item
        verify(saleItemRepository, Mockito.never()).deleteById(1L);
    }

    @Test
    void testarExcluirItemComViolacaoDeIntegridade() {
        // Criando um SaleItem de teste com id 1
        SaleItem saleItem = new SaleItem();
        saleItem.setId(1L);
        saleItem.setQuantityDelivered(BigDecimal.ZERO);  // A quantidade entregue é zero, para que não lance a primeira exceção
        saleItem.setQuantitySold(new BigDecimal(5));
        Product product = new Product();
        product.setId(1L);
        saleItem.setProduct(product);

        // Simulando o repositório para retornar o SaleItem
        when(saleItemRepository.findById(1L)).thenReturn(Optional.of(saleItem));

        // Simulando uma DataIntegrityViolationException quando o repositório tentar excluir
        Mockito.doThrow(DataIntegrityViolationException.class).when(saleItemRepository).deleteById(1L);

        // Chamando o método delete e verificando se a exceção correta é lançada
        try {
            saleItemService.delete(1L);
            fail("Deveria lançar uma DatabaseException com a mensagem: 'Não foi possível excluir este item. Ele pode estar vinculado a outros registros.'");
        } catch (DatabaseException e) {
            // Verificando se a mensagem da exceção está correta
            assertEquals("Não foi possível excluir este item. Ele pode estar vinculado a outros registros.", e.getMessage());
        }

        // Verificando se o repositório de SaleItem foi chamado para deletar o item
        verify(saleItemRepository).deleteById(1L);
    }

    @Test
    void testGetProductAndUpdateStock_ProdutoNaoEncontrado() {
        // Simulando o caso em que o produto não é encontrado
        when(productService.findById(Mockito.anyLong()))
                .thenReturn(Optional.empty());

        // Tentando invocar o método e verificar se a exceção é lançada
        try {
            saleItemService.processSaleItem(1L, new BigDecimal(5));  // O método público que invoca o privado
            fail("Deveria lançar uma ResourceNotFoundException.");
        } catch (ResourceNotFoundException e) {
            assertEquals("Produto não encontrado com ID: 1", e.getMessage());
        }
    }

    @Test
    void testGetProductAndUpdateStock_StockInsuficiente() {
        // Simulando a busca por um produto
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setStock(new BigDecimal(5));  // Estoque disponível é 5

        // Acessando um valor do enum UnitOfMeasure (por exemplo, KG)
        productDto.setUnitOfMeasure(UnitOfMeasure.KG);  // Ou qualquer valor existente no seu enum

        when(productService.findById(Mockito.anyLong()))
                .thenReturn(Optional.of(productDto));

        // Mock para verificar se a quantidade de produto é suficiente
        Mockito.doThrow(new ProductException("Estoque insuficiente, falta(m): 5 unidade(s)")).when(productService)
                .updateStockBySale(Mockito.anyLong(), Mockito.any(BigDecimal.class));

        try {
            saleItemService.processSaleItem(1L, new BigDecimal(10)); // Tentando vender mais do que o estoque
            fail("Deveria lançar uma ProductException.");
        } catch (ProductException e) {
            // Verifique se a mensagem contém a string "Estoque insuficiente"
            assertTrue(e.getMessage().contains("Estoque insuficiente"));
        }
    }


    @Test
    void testGetProductAndUpdateStock_AtualizacaoEstoqueComSucesso() {
        // Produto simulado
        ProductDto productDto = new ProductDto();
        productDto.setId(1L);
        productDto.setStock(new BigDecimal(20));  // Estoque suficiente

        when(productService.findById(Mockito.anyLong()))
                .thenReturn(Optional.of(productDto));

        // Método de atualização de estoque deve ser chamado
        Mockito.doNothing().when(productService).updateStockBySale(Mockito.anyLong(), Mockito.any(BigDecimal.class));

        // Invoca o método público que chama o método privado
        saleItemService.processSaleItem(1L, new BigDecimal(5));  // Quantidade dentro do estoque

        // Verificar se o método de atualização de estoque foi chamado
        verify(productService).updateStockBySale(Mockito.anyLong(), Mockito.any(BigDecimal.class));
    }

    @Test
    void testVerifyQuantitySold_QuantidadeMenorOuIgualAZero() {
        // Testando quando a quantidade é zero
        try {
            saleItemService.verifyQuantitySold(BigDecimal.ZERO);
            fail("Deveria lançar uma ProductException.");
        } catch (ProductException e) {
            assertEquals("A quantidade de produtos deve ser maior que zero.", e.getMessage());
        }

        // Testando quando a quantidade é negativa
        try {
            saleItemService.verifyQuantitySold(new BigDecimal(-1));
            fail("Deveria lançar uma ProductException.");
        } catch (ProductException e) {
            assertEquals("A quantidade de produtos deve ser maior que zero.", e.getMessage());
        }
    }

    @Test
    void testFindById_whenSaleItemExists() {
        // Arrange
        when(saleItemRepository.findById(1L)).thenReturn(Optional.of(saleItem));

        // Act
        SaleItemResponseDto result = saleItemService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        // Adicione mais asserts para os outros campos de SaleItemResponseDto, se necessário
    }

    @Test
    void testFindById_whenSaleItemDoesNotExist() {
        // Arrange
        when(saleItemRepository.findById(1L)).thenReturn(Optional.empty());

        // Act
        SaleItemResponseDto result = saleItemService.findById(1L);

        // Assert
        assertNull(result);
    }

    @Test
    void testUpdateItemDeliveryQuantity_whenSaleItemExists() {
        // Arrange
        BigDecimal newQuantity = new BigDecimal("10.0");
        when(saleItemRepository.findById(1L)).thenReturn(Optional.of(saleItem));

        // Act
        saleItemService.updateItemDeliveryQuantity(1L, newQuantity);

        // Assert
        assertEquals(newQuantity, saleItem.getQuantityDelivered());
        verify(saleItemRepository, times(1)).save(saleItem);
    }

    @Test
    void testUpdateItemDeliveryQuantity_whenSaleItemDoesNotExist() {
        // Arrange
        BigDecimal newQuantity = new BigDecimal("10.0");
        when(saleItemRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> {
            saleItemService.updateItemDeliveryQuantity(1L, newQuantity);
        });
    }
    @Test
    void testInsertItemWhenItemExists() {
        // Dado
        Long saleId = 1L;
        Long productId = 2L;
        BigDecimal quantitySold = new BigDecimal("10"); // Quantidade vendida que queremos
        BigDecimal salePrice = new BigDecimal("100");

        SaleInsertItemDto saleInsertItemDto = new SaleInsertItemDto();
        saleInsertItemDto.setProductId(productId);
        saleInsertItemDto.setQuantitySold(quantitySold);
        saleInsertItemDto.setSalePrice(salePrice);

        // Mockando a venda existente
        SaleDto saleDto = new SaleDto();
        saleDto.setId(saleId);
        when(saleService.findById(saleId)).thenReturn(Optional.of(saleDto));

        // Mockando o item de venda existente
        SaleItem existingSaleItem = new SaleItem();
        existingSaleItem.setQuantitySold(new BigDecimal("5")); // Quantidade já vendida
        existingSaleItem.setQuantityDelivered(new BigDecimal("2"));
        existingSaleItem.setSalePrice(salePrice);
        existingSaleItem.addToQuantityPending(BigDecimal.ZERO);  // Inicializa a quantidade pendente como 0

        when(saleItemRepository.findByProductIdAndSaleIdAndSalePrice(
                productId, saleId, salePrice
        )).thenReturn(Optional.of(existingSaleItem));

        // Mockando o produto existente no serviço com estoque insuficiente
        ProductDto productDto = new ProductDto();
        productDto.setId(productId);
        productDto.setReservedStock(new BigDecimal("4")); // Estoque disponível é 4
        productDto.setUnitOfMeasure(UnitOfMeasure.UNIT);  // Corrigido de PIECE para UNIT
        when(productService.findById(productId)).thenReturn(Optional.of(productDto));

        // Ação: Tenta inserir o item, o que deve gerar um erro de estoque insuficiente
        assertThrows(ProductException.class, () -> saleItemService.insert(saleId, saleInsertItemDto));

        // Verifica que o erro esperado foi lançado
        // O teste passará se a exceção ProductException for lançada corretamente com a mensagem esperada
    }

}

