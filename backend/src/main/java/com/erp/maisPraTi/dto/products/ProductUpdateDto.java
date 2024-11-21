package com.erp.maisPraTi.dto.products;

import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.enums.UnitOfMeasure;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductUpdateDto {

    @NotBlank(message = "Informe o código do produto.")
    private String supplierCode;

    @NotBlank(message = "Informe o nome do produto.")
    private String name;

    @NotBlank(message = "Informe a descrição do produto.")
    private String description;

    @NotNull(message = "Informe o tipo de unidade do produto.")
    @Enumerated(EnumType.STRING)
    private UnitOfMeasure unitOfMeasure;

    @NotNull(message = "Informe o valor do produto.")
    private BigDecimal productPrice;

    private BigDecimal stock = BigDecimal.ZERO;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal reservedStock = BigDecimal.ZERO;

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private BigDecimal incomingStock = BigDecimal.ZERO;

    private List<SupplierSimpleDto> suppliers = new ArrayList<>();
}
