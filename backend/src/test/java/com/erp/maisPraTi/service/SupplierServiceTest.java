package com.erp.maisPraTi.service;

import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierSimpleDto;
import com.erp.maisPraTi.dto.partyDto.suppliers.SupplierUpdateDto;
import com.erp.maisPraTi.enums.TypePfOrPj;
import com.erp.maisPraTi.model.Supplier;
import com.erp.maisPraTi.repository.SupplierRepository;
import com.erp.maisPraTi.service.exceptions.DatabaseException;
import com.erp.maisPraTi.service.exceptions.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SupplierServiceTest {

    @Mock
    private SupplierRepository supplierRepository;

    @InjectMocks
    private SupplierService supplierService;

    // Teste para verificar se o ID existe ou não
    @Test
    void deveLancarIdNaoLocalizadoQuandoIdNaoExiste() {
        Long idNaoExistente = 1L;
        when(supplierRepository.existsById(idNaoExistente)).thenReturn(false);

        assertThrows(ResourceNotFoundException.class, () -> {
            supplierService.verifyExistsId(idNaoExistente);
        });
    }

    @Test
    void naoDeveLancarExcecaoQuandoIdExiste() {
        Long idExistente = 1L;
        when(supplierRepository.existsById(idExistente)).thenReturn(true);

        supplierService.verifyExistsId(idExistente);
    }

    // Teste para verificar se os documentos existem para um fornecedor
    @Test
    void deveLancarCpfJaCadastradoQuandoCpfJaExisteParaFornecedor() {
        String cpf = "000.111.222.333-44";
        String stateRegistration = "isento";
        TypePfOrPj typePfOrPj = TypePfOrPj.PF;

        when(supplierRepository.existsByCpfCnpj(cpf)).thenReturn(true);

        DatabaseException exception = assertThrows(DatabaseException.class, () -> {
            supplierService.verifyExistsDocuments(cpf, stateRegistration, typePfOrPj);
        });
        assertEquals("CPF já cadastrado no sistema.", exception.getMessage());
    }

    @Test
    void deveLancarCnpjJaCadastradoQuandoCnpjJaExisteParaFornecedor() {
        String cnpj = "12555888/0001-99";
        String stateRegistration = "909/8328356";
        TypePfOrPj typePfOrPj = TypePfOrPj.PJ;

        when(supplierRepository.existsByCpfCnpj(cnpj)).thenReturn(true);

        DatabaseException exception = assertThrows(DatabaseException.class, () -> {
            supplierService.verifyExistsDocuments(cnpj, stateRegistration, typePfOrPj);
        });
        assertEquals("CNPJ já cadastrado no sistema.", exception.getMessage());
    }

    @Test
    void deveLancarIncricaoEstadualJaCadastradoQuandoInscricaoEstadualJaExisteParaFornecedor() {
        String cnpj = "55.222.555/0001-55";
        String stateRegistration = "909/8328356";
        TypePfOrPj typePfOrPj = TypePfOrPj.PJ;

        when(supplierRepository.existsByCpfCnpj(cnpj)).thenReturn(false);
        when(supplierRepository.existsByStateRegistration(stateRegistration)).thenReturn(true);

        DatabaseException exception = assertThrows(DatabaseException.class, () -> {
            supplierService.verifyExistsDocuments(cnpj, stateRegistration, typePfOrPj);
        });
        assertEquals("Inscrição estadual já cadastrada no sistema.", exception.getMessage());
    }

    // Teste para inserção de um novo fornecedor
    @Test
    void deveInserirFornecedorComSucesso() {
        SupplierDto dto = new SupplierDto();
        dto.setCpfCnpj("000.111.222-33");
        dto.setTypePfOrPj(TypePfOrPj.PF);
        dto.setStateRegistration("ISENTO");

        Supplier supplier = new Supplier();
        when(supplierRepository.existsByCpfCnpj(dto.getCpfCnpj())).thenReturn(false);
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        SupplierDto result = supplierService.insert(dto);

        assertNotNull(result);
        verify(supplierRepository, times(1)).save(any(Supplier.class));
    }

    // Teste para encontrar fornecedor por ID
    @Test
    void deveRetornarFornecedorQuandoIdExistente() {
        Long id = 1L;
        Supplier supplier = new Supplier();
        when(supplierRepository.findById(id)).thenReturn(Optional.of(supplier));

        Optional<SupplierDto> result = supplierService.findById(id);

        assertTrue(result.isPresent());
        verify(supplierRepository, times(1)).findById(id);
    }

    @Test
    void deveLancarExcecaoQuandoIdNaoExistenteAoBuscarFornecedor() {
        Long id = 1L;
        when(supplierRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> supplierService.findById(id));
    }

    // Teste para encontrar fornecedor simples por ID
    @Test
    void deveRetornarFornecedorSimplesQuandoIdExistente() {
        Long id = 1L;
        Supplier supplier = new Supplier();
        when(supplierRepository.findById(id)).thenReturn(Optional.of(supplier));

        Optional<SupplierSimpleDto> result = supplierService.findSimpleSupplierById(id);

        assertTrue(result.isPresent());
        verify(supplierRepository, times(1)).findById(id);
    }

    // Teste para obter todos os fornecedores com paginação
    @Test
    void deveRetornarPaginaDeFornecedores() {
        Pageable pageable = PageRequest.of(0, 10);
        Supplier supplier = new Supplier();
        Page<Supplier> page = new PageImpl<>(Collections.singletonList(supplier));
        when(supplierRepository.findAll(pageable)).thenReturn(page);

        Page<SupplierDto> result = supplierService.findAll(pageable);

        assertFalse(result.isEmpty());
        assertEquals(1, result.getTotalElements());
    }

    // Teste para atualizar fornecedor
    @Test
    void deveAtualizarFornecedorComSucesso() {
        Long id = 1L;

        // Crie e configure o objeto SupplierUpdateDto
        SupplierUpdateDto updateDto = new SupplierUpdateDto();
        updateDto.setCpfCnpj("000.111.222.333-44");
        updateDto.setStateRegistration("909/8328356");
        updateDto.setTypePfOrPj(TypePfOrPj.PJ);

        // Configure o objeto Supplier que será retornado pelo mock
        Supplier supplier = new Supplier();
        supplier.setCpfCnpj("000.111.222.333-44"); // Define um CPF/CNPJ inicial para comparação

        // Mocks do repositório
        when(supplierRepository.existsById(id)).thenReturn(true);
        when(supplierRepository.getReferenceById(id)).thenReturn(supplier);
        when(supplierRepository.save(any(Supplier.class))).thenReturn(supplier);

        // Chamada do método update no serviço
        SupplierDto result = supplierService.update(id, updateDto);

        // Asserções
        assertNotNull(result);
        verify(supplierRepository, times(1)).save(supplier);
    }


    @Test
    void deveLancarExcecaoQuandoErroDeIntegridadeAoAtualizarFornecedor() {
        Long id = 1L;
        SupplierUpdateDto updateDto = new SupplierUpdateDto();
        updateDto.setCpfCnpj("000.111.222-33");

        when(supplierRepository.existsById(id)).thenReturn(true);
        when(supplierRepository.getReferenceById(id)).thenThrow(DataIntegrityViolationException.class);

        assertThrows(DatabaseException.class, () -> supplierService.update(id, updateDto));
    }

    // Teste para excluir fornecedor
    @Test
    void deveExcluirFornecedorComSucesso() {
        Long id = 1L;
        when(supplierRepository.existsById(id)).thenReturn(true);

        supplierService.delete(id);

        verify(supplierRepository, times(1)).deleteById(id);
    }

    @Test
    void deveLancarExcecaoQuandoErroDeIntegridadeAoExcluirFornecedor() {
        Long id = 1L;
        when(supplierRepository.existsById(id)).thenReturn(true);
        doThrow(DataIntegrityViolationException.class).when(supplierRepository).deleteById(id);

        assertThrows(DatabaseException.class, () -> supplierService.delete(id));
    }

    // Teste para normalizar inscrição estadual
    @Test
    void deveNormalizarInscricaoEstadualParaMinusculo() {
        String stateRegistration = "TESTE";
        String normalized = supplierService.stateRegistrationNormalize(stateRegistration);

        assertEquals("teste", normalized);
    }

    @Test
    void deveRetornarNuloQuandoInscricaoEstadualForNula() {
        String normalized = supplierService.stateRegistrationNormalize(null);

        assertNull(normalized);
    }


    @Test
    void naoDeveLancarExcecaoQuandoDocumentosNaoExistem() {
        String cpfCnpj = "123.456.789-00";
        String stateRegistration = "ISENTO";
        TypePfOrPj typePfOrPj = TypePfOrPj.PF;

        when(supplierRepository.existsByCpfCnpj(cpfCnpj)).thenReturn(false);

        assertDoesNotThrow(() -> supplierService.verifyExistsDocuments(cpfCnpj, stateRegistration, typePfOrPj));

        verify(supplierRepository, times(1)).existsByCpfCnpj(cpfCnpj);
        verify(supplierRepository, never()).existsByStateRegistration(stateRegistration); // Verificação de que não foi chamado
    }


}




