package com.erp.maisPraTi.dto.partyDto.suppliers;

import com.erp.maisPraTi.dto.partyDto.PartyDto;
import com.erp.maisPraTi.model.Product;
import com.erp.maisPraTi.service.validations.DocumentsValid;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@DocumentsValid
@AllArgsConstructor
@NoArgsConstructor
public class SupplierDto extends PartyDto {

    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private Long id;

    private List<Product> products = new ArrayList<>();

}
