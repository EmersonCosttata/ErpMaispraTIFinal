package com.erp.maisPraTi.controller;

import com.erp.maisPraTi.dto.partyDto.clients.ClientDto;
import com.erp.maisPraTi.dto.partyDto.clients.ClientUpdateDto;
import com.erp.maisPraTi.service.ClientService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Optional;

@Tag(name = "Clientes", description = "Operações relacionadas aos Clientes.")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping(value = "api/clientes")
public class ClientController {

    @Autowired
    private ClientService clientService;

    @Operation(summary = "Cria um novo cliente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Cliente criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos")
    })
    @PostMapping
    public ResponseEntity<ClientDto> insert (@Valid @RequestBody ClientDto clientDto){
        ClientDto newClientDto = clientService.insert(clientDto);
        URI uri = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(newClientDto.getId())
                .toUri();
        return ResponseEntity.created(uri).body(newClientDto);
    }

    @Operation(summary = "Obtém um cliente por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Optional<ClientDto>> findById(@PathVariable Long id){
        Optional<ClientDto> clientDto = clientService.findById(id);
        return ResponseEntity.ok().body(clientDto);
    }

    @Operation(summary = "Obtém uma lista páginada de clientes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })
    @GetMapping
    public ResponseEntity<Page<ClientDto>> findAll(Pageable pageable){
        Page<ClientDto> clients = clientService.findAll(pageable);
        return ResponseEntity.ok().body(clients);
    }

    @Operation(summary = "Atualiza um cliente informando o ID e os dados por parâmetro")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cliente encontrado"),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ClientDto> update(@PathVariable Long id, @Valid @RequestBody ClientUpdateDto clientUpdateDto){
        ClientDto clientUpdatedDto = clientService.update(id, clientUpdateDto);
        return ResponseEntity.ok().body(clientUpdatedDto);
    }

    @Operation(summary = "Deleta um cliente informando o ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Cliente deletado"),
            @ApiResponse(responseCode = "404", description = "Cliente não encontrado"),
            @ApiResponse(responseCode = "409", description = "Para manter integridade do BD não permite a exclusão")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){
        clientService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
