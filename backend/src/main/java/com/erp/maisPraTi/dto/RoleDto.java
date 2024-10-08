package com.erp.maisPraTi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RoleDto {

    private long id;
    @NotBlank(message = "O campo nome é obrigatório.")
    private String authority;

}
