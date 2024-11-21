package com.erp.maisPraTi.model;

import com.erp.maisPraTi.enums.UnitOfMeasure;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tb_products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String supplierCode;

    @NotNull(message = "Campo obrigatório.")
    private String name;

    @NotNull(message = "Campo obrigatório.")
    private String description;

    @Enumerated(EnumType.STRING)
    private UnitOfMeasure unitOfMeasure;

    private BigDecimal productPrice;
    private BigDecimal stock = BigDecimal.ZERO;
    private BigDecimal reservedStock = BigDecimal.ZERO;
    private BigDecimal incomingStock = BigDecimal.ZERO;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "tb_product_supplier",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "supplier_id")
    )
    private List<Supplier> suppliers = new ArrayList<>();

}
