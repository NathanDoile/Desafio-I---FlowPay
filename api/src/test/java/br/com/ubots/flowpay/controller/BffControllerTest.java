package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.controller.response.TelaDetalheResponse;
import br.com.ubots.flowpay.controller.response.TelaHomeResponse;
import br.com.ubots.flowpay.controller.response.TelaMetricasGeraisResponse;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.resttestclient.TestRestTemplate;
import org.springframework.boot.resttestclient.autoconfigure.AutoConfigureTestRestTemplate;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;
import org.springframework.web.util.UriComponentsBuilder;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.*;
import static org.junit.jupiter.api.Assertions.*;

@Sql(scripts = "/insert.sql", executionPhase = Sql.ExecutionPhase.BEFORE_TEST_METHOD)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Testcontainers
@AutoConfigureTestRestTemplate
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
class BffControllerTest {

    @Container
    @ServiceConnection
    static MySQLContainer<?> mySQLContainer = new MySQLContainer<>("mysql:8.0.32");

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    @Test
    @DisplayName("Deve retornar relatório de home")
    void deveRetornarRelatorioHome(){

        ZonedDateTime horaInicial = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        for(int i = 1; i <= 12; i++){

            CriarSolicitacaoRequest requestI = CriarSolicitacaoRequest
                    .builder()
                    .assunto(EMPRESTIMO.getDescricao())
                    .referenciaConversa((long) i)
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    requestI,
                    Void.class
            );

            CriarSolicitacaoRequest requestII = CriarSolicitacaoRequest
                    .builder()
                    .assunto(CARTAO.getDescricao())
                    .referenciaConversa((long) (i+12))
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    requestII,
                    Void.class
            );

            CriarSolicitacaoRequest requestIII = CriarSolicitacaoRequest
                    .builder()
                    .assunto(OUTROS_ASSUNTOS.getDescricao())
                    .referenciaConversa((long) (i+24))
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    requestIII,
                    Void.class
            );
        }

        ResponseEntity<TelaHomeResponse> responseEntity = restTemplate.exchange(
                "/relatorios/home",
                HttpMethod.GET,
                null,
                TelaHomeResponse.class
        );

        ZonedDateTime horaFinal = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        Long tempoMedio = ChronoUnit.SECONDS.between(horaInicial, horaFinal);

        TelaHomeResponse response = responseEntity.getBody();

        assertNotNull(responseEntity.getBody());
        assertEquals(9L, response.getTotalTickets());
        assertEquals(9L, response.getQuantidadeAtendentes());
        assertEquals(3L, response.getQuantidadeEquipes());

        response.getEquipes().forEach(homeEquipeResponse -> {
            assertNotNull(homeEquipeResponse.getId());
            assertNotNull(homeEquipeResponse.getNome());
            assertEquals(3L, homeEquipeResponse.getQuantidadeTicketsEmFila());
            assertEquals(3L, homeEquipeResponse.getQuantidadeAtendentes());
            assertTrue(homeEquipeResponse.getMediaTempoEsperaEmSegundos() <= tempoMedio);
        });
    }

    @Test
    @DisplayName("Deve retornar relatório de home mesmo sem fila")
    void deveRetornarRelatorioHomeMesmoSemFila(){

        ZonedDateTime horaInicial = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        for(int i = 1; i <= 12; i++){

            CriarSolicitacaoRequest requestI = CriarSolicitacaoRequest
                    .builder()
                    .assunto(EMPRESTIMO.getDescricao())
                    .referenciaConversa((long) i)
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    requestI,
                    Void.class
            );

            CriarSolicitacaoRequest requestII = CriarSolicitacaoRequest
                    .builder()
                    .assunto(CARTAO.getDescricao())
                    .referenciaConversa((long) (i+12))
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    requestII,
                    Void.class
            );
        }

        ResponseEntity<TelaHomeResponse> responseEntity = restTemplate.exchange(
                "/relatorios/home",
                HttpMethod.GET,
                null,
                TelaHomeResponse.class
        );

        ZonedDateTime horaFinal = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        Long tempoMedio = ChronoUnit.SECONDS.between(horaInicial, horaFinal);

        TelaHomeResponse response = responseEntity.getBody();

        assertNotNull(responseEntity.getBody());
        assertEquals(6L, response.getTotalTickets());
        assertEquals(9L, response.getQuantidadeAtendentes());
        assertEquals(3L, response.getQuantidadeEquipes());

        response.getEquipes().forEach(homeEquipeResponse -> {
            assertNotNull(homeEquipeResponse.getId());
            assertNotNull(homeEquipeResponse.getNome());

            if(homeEquipeResponse.getNome().equals(Categoria.OUTROS_ASSUNTOS.getDescricao())){
                assertEquals(0L, homeEquipeResponse.getQuantidadeTicketsEmFila());
            }
            else{
                assertEquals(3L, homeEquipeResponse.getQuantidadeTicketsEmFila());
            }

            assertEquals(3L, homeEquipeResponse.getQuantidadeAtendentes());
            assertTrue(homeEquipeResponse.getMediaTempoEsperaEmSegundos() <= tempoMedio);
        });
    }

    @Test
    @DisplayName("Deve retornar relatório de detalhe")
    void deveRetornarRelatorioDetalhe(){

        ZonedDateTime horaInicial = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        // Cria 13 solicitações: 1 será finalizada, 9 em andamento, 3 na fila, excedendo capacidade para testar cancelamento
        for(int i = 1; i <= 13; i++){
            CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                    .builder()
                    .assunto(CARTAO.getDescricao())
                    .referenciaConversa((long) i)
                    .build();

            try {
                restTemplate.postForEntity(
                        "/solicitacao",
                        request,
                        Void.class
                );
            } catch (Exception e) {
                // Esperado: solicitação recusada quando fila atinge capacidade máxima
                // Isso permite testar o cenário de atendimentos cancelados
            }
        }

        restTemplate.exchange(
                "/solicitacao/" + 1 + "/finalizar",
                HttpMethod.PUT,
                null,
                Void.class
        );

        String categoriaEquipe = "CARTAO";

        ResponseEntity<TelaDetalheResponse> responseEntity = restTemplate.exchange(
                "/relatorios/detalhe/" + categoriaEquipe,
                HttpMethod.GET,
                null,
                TelaDetalheResponse.class
        );

        ZonedDateTime horaFinal = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        Long tempoMedio = ChronoUnit.SECONDS.between(horaInicial, horaFinal);

        TelaDetalheResponse response = responseEntity.getBody();

        assertEquals(3L, response.getQuantidadeAtendentes());
        assertTrue(response.getTempoMedioAtendimento() >= 0);
        assertEquals(1L, response.getQuantidadeAtendimentosConcluidos());
        assertTrue(response.getTempoMedioEspera() <= tempoMedio);
        assertEquals(9L, response.getQuantidadeAtendimentosEmAndamento());
        assertEquals(1L, response.getQuantidadeAtendimentosCancelados());
        assertNotNull(response.getDataHoraUltimoCancelamento());
        assertEquals(3L, response.getCapacidadeFila());

        response.getFila().forEach(detalheFilaEsperaResponse -> {
            assertNotNull(detalheFilaEsperaResponse.getAssunto());
            assertNotNull(detalheFilaEsperaResponse.getProtocolo());
            assertNotNull(detalheFilaEsperaResponse.getDataHoraEntrouNaFila());
        });

        response.getAtendentes().forEach(detalheAtendentesResponse -> {
            assertNotNull(detalheAtendentesResponse.getNome());
            assertTrue(detalheAtendentesResponse.getQuantidadeAtendimentosConcluidos() == 0 ||
                    detalheAtendentesResponse.getQuantidadeAtendimentosConcluidos() == 1);
            assertTrue(detalheAtendentesResponse.getTempoMedioAtendimento() >= 0);

            detalheAtendentesResponse.getSolicitacoes().forEach(solicitacaoAtendenteResponse -> {
                assertNotNull(solicitacaoAtendenteResponse.getAssunto());
                assertNotNull(solicitacaoAtendenteResponse.getProtocolo());
                assertNotNull(solicitacaoAtendenteResponse.getDataHoraEntrouEmAtendimento());
            });
        });
    }

    @Test
    @DisplayName("Deve retornar lista de meses para métricas")
    void deveRetornarListaMesesMetricas(){

        CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                .builder()
                .assunto(CARTAO.getDescricao())
                .referenciaConversa(1L)
                .build();

        restTemplate.postForEntity(
                "/solicitacao",
                request,
                Void.class
        );

        ResponseEntity<List<LocalDate>> responseEntity = restTemplate.exchange(
                "/relatorios/meses-metricas",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<LocalDate>>() {}
        );

        List<LocalDate> response = responseEntity.getBody();

        assertNotNull(response);
        assertFalse(response.isEmpty());
    }

    @Test
    @DisplayName("Deve retornar metricas gerais para um mes especifico")
    void deveRetornarMetricasGeraisParaMesEspecifico() {

        for(int i = 1; i <= 13; i++){

            CriarSolicitacaoRequest request = CriarSolicitacaoRequest
                    .builder()
                    .assunto(CARTAO.getDescricao())
                    .referenciaConversa((long) i)
                    .build();

            restTemplate.postForEntity(
                    "/solicitacao",
                    request,
                    Void.class
            );
        }

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        String url = UriComponentsBuilder.fromPath("/relatorios/metricas-gerais")
                .queryParam("data", data)
                .toUriString();

        ResponseEntity<TelaMetricasGeraisResponse> responseEntity = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                TelaMetricasGeraisResponse.class
        );

        TelaMetricasGeraisResponse response = responseEntity.getBody();

        assertNotNull(response);
        assertEquals(0L, response.getTotalAtendimentos());
        assertEquals(1L, response.getTotalTicketsRecusados());
        assertEquals(0L, response.getMediaTicketsRecusadosPorDia());
        assertEquals(0L, response.getTempoMedioAtendimento());
        assertTrue(response.getTempoMedioEspera() >= 0);
        assertNotNull(response.getEquipe());
        assertFalse(response.getEquipe().isEmpty());
    }
}
