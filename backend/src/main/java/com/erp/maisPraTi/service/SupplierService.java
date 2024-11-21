package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierUpdateDto;
import com.erp.maisPraTi.enums.TypePfOrPj;
import com.erp.maisPraTi.model.Supplier;
import com.erp.maisPraTi.repository.SupplierRepository;
import com.erp.maisPraTi.service.exceptions.DatabaseException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.erp.maisPraTi.util.EntityMapper.convertToDto;
import static com.erp.maisPraTi.util.EntityMapper.convertToEntity;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Transactional
    public SupplierDto insert(SupplierDto dto) {
        verifyExistsDocuments(dto.getCpfCnpj(), dto.getStateRegistration(), dto.getTypePfOrPj());
        Supplier supplier = new Supplier();
        dto.setStateRegistration(stateRegistrationNormalize(dto.getStateRegistration()));
        supplier = convertToEntity(dto, Supplier.class);
        supplier.setCreatedAt(LocalDateTime.now());
        supplier.setUpdatedAt(LocalDateTime.now());
        supplier = supplierRepository.save(supplier);
        return convertToDto(supplier, SupplierDto.class);
    }

    @Transactional(readOnly = true)
    public Optional<SupplierDto> findById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não localizado: " + id));
        return Optional.of(convertToDto(supplier, SupplierDto.class));
    }

    @Transactional(readOnly = true)
    public Optional<SupplierSimpleDto> findSimpleSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Id não localizado: " + id));
        return Optional.of(convertToDto(supplier, SupplierSimpleDto.class));
    }

    public Page<SupplierDto> findAll(Pageable pageable){
        Page<Supplier> suppliers = supplierRepository.findAll(pageable);
        return suppliers.map(s -> convertToDto(s, SupplierDto.class));
    }

    @Transactional
    public SupplierDto update(Long id, SupplierUpdateDto supplierUpdateDto) {
        verifyExistsId(id);
        try {
            Supplier supplier = supplierRepository.getReferenceById(id);
            if(!supplier.getCpfCnpj().equals(supplierUpdateDto.getCpfCnpj()))
                verifyExistsDocuments(supplierUpdateDto.getCpfCnpj(), supplierUpdateDto.getStateRegistration(), supplierUpdateDto.getTypePfOrPj());
            supplierUpdateDto.setStateRegistration(stateRegistrationNormalize(supplierUpdateDto.getStateRegistration()));
            convertToEntity(supplierUpdateDto, supplier);
            supplier.setUpdatedAt(LocalDateTime.now());
            supplier = supplierRepository.save(supplier);
            return convertToDto(supplier, SupplierDto.class);
        } catch (DataIntegrityViolationException e) {
            throw new DatabaseException("Não foi possível fazer a alteração neste fornecedor.");
        }
    }

    @Transactional
    public void delete(Long id){
        verifyExistsId(id);
        try{
            supplierRepository.deleteById(id);
        } catch (DataIntegrityViolationException e){
            throw new DatabaseException("Não foi possível excluir este fornecedor. Ele pode estar vinculado a outros registros.");
        } catch (Exception e) {
            throw new DatabaseException("Erro inesperado ao tentar excluir o fornecedor.");
        }
    }

    public void verifyExistsId(Long id){
        if(!supplierRepository.existsById(id)){
            throw new ResourceNotFoundException("Id não localizado: " + id);
        }
    }

    public void verifyExistsDocuments(String cpfCnpj, String stateRegistration, TypePfOrPj typePfOrPj) {
        if(supplierRepository.existsByCpfCnpj(cpfCnpj))
            throw new DatabaseException(typePfOrPj.equals(TypePfOrPj.PJ) ? "CNPJ já cadastrado no sistema." : "CPF já cadastrado no sistema.");
        if(typePfOrPj.equals(TypePfOrPj.PJ) && supplierRepository.existsByStateRegistration(stateRegistration) && !stateRegistration.equalsIgnoreCase("isento"))
            throw new DatabaseException("Inscrição estadual já cadastrada no sistema.");
    }

    public String stateRegistrationNormalize(String stateRegistration){
        return stateRegistration != null ? stateRegistration.toLowerCase() : null;
    }

}
