package com.erp.maisPraTi.model;

import com.erp.maisPraTi.enums.UnitOfMeasure;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Data
@Table(name = "tb_sale_items")
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private BigDecimal quantitySold;

    @Column(nullable = false)
    private BigDecimal salePrice;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private UnitOfMeasure unitOfMeasure;

    private BigDecimal quantityDelivered;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sale_id")
    private Sale sale;

    public BigDecimal getQuantityPending(){
        return this.quantitySold.subtract(this.quantityDelivered);
    }

    public void addToQuantityPending(BigDecimal addPending) {
        this.quantitySold = this.quantitySold.add(addPending);
    }

}
