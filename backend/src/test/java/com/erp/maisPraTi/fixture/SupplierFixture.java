package com.erp.maisPraTi.fixture;

import com.erp.maisPraTi.enums.SupplierStatus;
import com.erp.maisPraTi.enums.TypePfOrPj;
import com.erp.maisPraTi.model.Supplier;

import java.math.BigDecimal;

public class SupplierFixture {

    public static Supplier supplierFixture(){
        Supplier supplier = new Supplier();
        supplier.setFullName("Tech");
        supplier.setAddress("Rua das Tech");
        supplier.setNumber("123");
        supplier.setDistrict("Santana");
        supplier.setCity("Porto Alegre");
        supplier.setState("RS");
        supplier.setCountry("Brasil");
        supplier.setZipCode("95.660-000");
        supplier.setEmail("tech@gmail.com");
        supplier.setPhoneNumber("51912345678");
        supplier.setCpfCnpj("11.222.333/0001-99");
        supplier.setStateRegistration("012/3456789");
        supplier.setTypePfPj(TypePfOrPj.PJ);
        supplier.setCreditLimit(new BigDecimal(9000.00));
        supplier.setStatus(SupplierStatus.ACTIVE);
        return supplier;
    }
}
