package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.deliveries.DeliveryRequest;
import com.erp.maisPraTi.dto.deliveries.DeliveryResponse;
import com.erp.maisPraTi.dto.sales.SaleDto;
import com.erp.maisPraTi.model.Delivery;
import com.erp.maisPraTi.repository.DeliveryRepository;
import com.erp.maisPraTi.service.exceptions.ProductException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DeliveryServiceTest {

    @InjectMocks
    private DeliveryService deliveryService;

    @Mock
    private DeliveryRepository repository;

    @Mock
    private SaleService saleService;

    @BeforeEach
    void configurar() {
        MockitoAnnotations.openMocks(this);
    }


    @Test
    void deveFalharAoInserirEntregaSemItensPendentes() {
        // Mock de SaleDto com totalPendingDelivery = 0
        SaleDto mockSaleDto = mock(SaleDto.class);
        mockSaleDto.setGetTotalPendingDelivery(BigDecimal.ZERO);  // Como a variável é pública, setamos diretamente

        // Mock de DeliveryRequest
        DeliveryRequest request = new DeliveryRequest();
        request.setSaleId(1L);

        // Comportamento simulado
        when(saleService.findById(1L)).thenReturn(Optional.of(mockSaleDto)); // Retorna mockSaleDto

        // Execução e verificação de exceção
        ProductException exception = assertThrows(ProductException.class, () -> deliveryService.insert(request));
        assertEquals("Não existem itens pendentes de entrega para esta venda.", exception.getMessage());

        // Verificação de interações
        verify(saleService, times(1)).findById(1L); // Verifica que findById foi chamado uma vez
        verify(repository, never()).save(any(Delivery.class)); // Verifica que save não foi chamado
    }


}
