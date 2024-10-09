package com.erp.maisPraTi.repository;

import com.erp.maisPraTi.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Supplier findByCpfCnpj(String cpfCnpj);
}