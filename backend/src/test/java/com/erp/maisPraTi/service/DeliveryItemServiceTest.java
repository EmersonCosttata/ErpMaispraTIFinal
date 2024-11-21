package com.erp.maisPraTi.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import com.erp.maisPraTi.dto.deliveries.DeliveryItemsRequest;
import com.erp.maisPraTi.dto.deliveries.DeliveryItemsResponse;
import com.erp.maisPraTi.dto.saleItems.SaleItemResponseDto;
import com.erp.maisPraTi.model.DeliveryItem;
import com.erp.maisPraTi.model.SaleItem;
import com.erp.maisPraTi.repository.DeliveryItemRepository;
import com.erp.maisPraTi.service.exceptions.ProductException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;


import java.math.BigDecimal;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class DeliveryItemServiceTest {

    @Mock
    private DeliveryItemRepository deliveryItemRepository;

    @Mock
    private SaleItemService saleItemService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private DeliveryItemService deliveryItemService;

    private SaleItem saleItem;
    private DeliveryItemsRequest request;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Preparar um SaleItem mock
        saleItem = new SaleItem();
        saleItem.setId(1L);
        saleItem.setQuantitySold(new BigDecimal(10));
        saleItem.setQuantityDelivered(new BigDecimal(5));

        // Preparar um DeliveryItemsRequest mock
        request = new DeliveryItemsRequest();
        request.setSaleItemId(1L);
        request.setQuantityDelivery(new BigDecimal(3));  // Quantidade válida para entrega
    }





    @Test
    void testInsert_QuantityNotAvailable() {
        // Criação de um SaleItemResponseDto para ser retornado pelo mock
        SaleItemResponseDto saleItemResponseDto = new SaleItemResponseDto();
        saleItemResponseDto.setId(1L);
        saleItemResponseDto.setQuantitySold(new BigDecimal(5));  // Quantidade de venda
        saleItemResponseDto.setQuantityDelivered(new BigDecimal(3).longValue());  // Quantidade já entregue
        saleItemResponseDto.setQuantityPending(new BigDecimal(2).longValue());  // Quantidade pendente

        // Mock da resposta do SaleItemService
        when(saleItemService.findById(anyLong())).thenReturn(saleItemResponseDto);

        // Definir a quantidade de entrega no request para ser maior que a quantidade pendente
        request.setQuantityDelivery(new BigDecimal(6));  // Maior que a quantidade pendente

        // Verificação de exceção
        ProductException exception = assertThrows(ProductException.class, () -> {
            deliveryItemService.insert(1L, request);
        });

        // Verifica se a exceção tem a mensagem correta
        assertEquals("Quantidade informada não disponivel para entrega desse item.", exception.getMessage());
    }



    @Test
    void testFindById_Success() {
        // Mock para encontrar um DeliveryItem
        DeliveryItem deliveryItem = new DeliveryItem();
        deliveryItem.setId(1L);
        when(deliveryItemRepository.findById(1L)).thenReturn(Optional.of(deliveryItem));

        // Chamada do método
        Optional<DeliveryItemsResponse> response = deliveryItemService.findById(1L);

        // Verificações
        assertTrue(response.isPresent());
        assertEquals(1L, response.get().getId());
    }

    @Test
    void testFindAll_Success() {
        // Mock para DeliveryItem
        DeliveryItem deliveryItem = new DeliveryItem();
        deliveryItem.setId(1L);  // ID fictício

        // Mock do repositório retornando uma página com um DeliveryItem
        Page<DeliveryItem> pageMock = new PageImpl<>(Collections.singletonList(deliveryItem));  // Página com 1 item
        when(deliveryItemRepository.findAllByDeliveryId(anyLong(), any(Pageable.class))).thenReturn(pageMock);  // Mock corrigido

        // Executa o método
        Page<DeliveryItemsResponse> response = deliveryItemService.findAll(1L, PageRequest.of(0, 10));

        // Verifica se o resultado não está vazio
        assertNotNull(response);
        assertEquals(1, response.getTotalElements());
        assertEquals(1L, response.getContent().get(0).getId());  // Verifica o ID do item convertido
    }



}
