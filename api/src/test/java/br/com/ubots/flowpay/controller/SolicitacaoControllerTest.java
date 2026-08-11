package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.controller.response.CriarSolicitacaoResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.util.Map;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.EMPRESTIMO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.criarSolicitacaoRequest;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;
import static org.springframework.http.HttpMethod.PUT;
import static org.springframework.http.HttpStatus.*;

@Sql(scripts = "/insert.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
@AutoConfigureTestRestTemplate
class SolicitacaoControllerTest {

    @Container
    @ServiceConnection
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.32");

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    @DisplayName("Deve criar uma solicitação com sucesso")
    void deveCriarSolicitacaoComSucesso(){

        CriarSolicitacaoRequest request = criarSolicitacaoRequest();

        ResponseEntity<CriarSolicitacaoResponse> responseEntity = restTemplate.postForEntity(
                "/solicitacao",
                request,
                CriarSolicitacaoResponse.class
        );

        CriarSolicitacaoResponse response = responseEntity.getBody();

        assertEquals(ACCEPTED, responseEntity.getStatusCode());
        assertNotNull(response.getId());
        assertEquals(request.getReferenciaConversa(), response.getReferenciaConversa());
        assertEquals(EM_ATENDIMENTO, response.getStatusSolicitacao());
        assertEquals(request.getAssunto(), response.getAssunto());
    }

    @Test
    @DisplayName("Deve dar erro se request imcompleto")
    void deveDarErroSeRequestImcompleto(){

        CriarSolicitacaoRequest requestReferenciaNull = CriarSolicitacaoRequest
                .builder()
                .assunto(EMPRESTIMO.getDescricao())
                .build();

        CriarSolicitacaoRequest requestAssuntoNull = CriarSolicitacaoRequest
                .builder()
                .referenciaConversa(20260807000001L)
                .build();

        CriarSolicitacaoRequest requestAssuntoNaoPositivo = CriarSolicitacaoRequest
                .builder()
                .referenciaConversa(-20260807000001L)
                .assunto(EMPRESTIMO.getDescricao())
                .build();

        ResponseEntity<Map> responseI = restTemplate.postForEntity(
                "/solicitacao",
                requestReferenciaNull,
                Map.class
        );

        ResponseEntity<Map> responseII = restTemplate.postForEntity(
                "/solicitacao",
                requestAssuntoNull,
                Map.class
        );

        ResponseEntity<Map> responseIII = restTemplate.postForEntity(
                "/solicitacao",
                requestAssuntoNaoPositivo,
                Map.class
        );

        assertEquals(BAD_REQUEST, responseI.getStatusCode());
        assertEquals("Campo referenciaConversa não deve ser nulo", responseI.getBody().get("message"));

        assertEquals(BAD_REQUEST, responseII.getStatusCode());
        assertEquals("Campo assunto não deve estar em branco", responseII.getBody().get("message"));

        assertEquals(BAD_REQUEST, responseIII.getStatusCode());
        assertEquals("Campo referenciaConversa deve ser maior que 0", responseIII.getBody().get("message"));
    }

    @Test
    @DisplayName("Deve dar erro se cadastrar duas solicitacoes para a mesma referencia")
    void deveDarErroSeCadastrarMesmaReferencia(){

        CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                .builder()
                .assunto(EMPRESTIMO.getDescricao())
                .referenciaConversa(20260807000001L)
                .build();

        restTemplate.postForEntity(
                "/solicitacao",
                request,
                Map.class
        );

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/solicitacao",
                request,
                Map.class
        );

        assertEquals(CONFLICT, response.getStatusCode());
        assertEquals("Já existe solicitação para essa conversa.", response.getBody().get("message"));
    }

    @Test
    @DisplayName("Deve dar erro se a fila estiver cheia")
    void deveDarErroSeFilaCheia(){

        for(int i = 0; i < 13; i++){

            CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                    .builder()
                    .assunto(EMPRESTIMO.getDescricao())
                    .referenciaConversa((long) i)
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    request,
                    Void.class
            );
        }

        CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                .builder()
                .assunto(EMPRESTIMO.getDescricao())
                .referenciaConversa(20260807000001L)
                .build();

        ResponseEntity<Map> response = restTemplate.postForEntity(
                "/solicitacao",
                request,
                Map.class
        );

        assertEquals(SERVICE_UNAVAILABLE, response.getStatusCode());
        assertEquals("Fila de solicitações cheia, tente novamente mais tarde.", response.getBody().get("message"));
    }

    @Test
    @DisplayName("Deve finalizar o atendimento corretamente")
    void deveFinalizarAtendimentoCorretamente(){

        ResponseEntity<CriarSolicitacaoResponse> responseSolicitacao = restTemplate.postForEntity(
                "/solicitacao",
                criarSolicitacaoRequest(),
                CriarSolicitacaoResponse.class
        );

        ResponseEntity<Void> response = restTemplate.exchange(
                "/solicitacao/" + responseSolicitacao.getBody().getId() + "/finalizar",
                PUT,
                null,
                Void.class
        );

        assertEquals(OK, response.getStatusCode());
        assertNull(response.getBody());
    }

    @Test
    @DisplayName("Deve dar erro se id não existe")
    void deveDarErroSeIdNaoExiste(){

        ResponseEntity<Map> response = restTemplate.exchange(
                "/solicitacao/" + 1 + "/finalizar",
                PUT,
                null,
                Map.class
        );

        assertEquals(NOT_FOUND, response.getStatusCode());
        assertEquals("Não existe atendimento em andamento com o ID informado.", response.getBody().get("message"));
    }
}
