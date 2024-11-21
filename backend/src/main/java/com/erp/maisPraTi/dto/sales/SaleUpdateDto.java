package com.erp.maisPraTi.dto.sales;

import com.erp.maisPraTi.enums.SaleStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SaleUpdateDto {

    private LocalDateTime saleDate;
    private LocalDate expectedDeliveryDate;
    @Enumerated(EnumType.STRING)
    private SaleStatus saleStatus;

}
