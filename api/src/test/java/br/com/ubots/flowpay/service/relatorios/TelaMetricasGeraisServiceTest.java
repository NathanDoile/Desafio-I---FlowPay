package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.TelaMetricasGeraisResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.Month;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.FINALIZADO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.RECUSADO_POR_FILA_ESPERA_CHEIA;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TelaMetricasGeraisServiceTest {

    @InjectMocks
    private TelaMetricasGeraisService tested;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Test
    @DisplayName("Deve retornar metricas com zeros quando não houver solicitacoes")
    void deveRetornarMetricasComZerosQuandoNaoHouverSolicitacoes() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(new ArrayList<>());

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(0L, result.getTempoMedioAtendimento());
        assertEquals(0L, result.getTempoMedioEspera());
        assertEquals(0L, result.getTotalAtendimentos());
        assertEquals(0L, result.getTotalTicketsRecusados());
        assertEquals(0L, result.getMediaTicketsRecusadosPorDia());
        assertNotNull(result.getEquipe());
        assertTrue(result.getEquipe().isEmpty());
    }

    @Test
    @DisplayName("Deve retornar metricas com zeros quando repository retornar null")
    void deveRetornarMetricasComZerosQuandoRepositoryRetornarNull() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(null);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(0L, result.getTempoMedioAtendimento());
        assertEquals(0L, result.getTempoMedioEspera());
        assertEquals(0L, result.getTotalAtendimentos());
        assertEquals(0L, result.getTotalTicketsRecusados());
        assertEquals(0L, result.getMediaTicketsRecusadosPorDia());
        assertNotNull(result.getEquipe());
        assertTrue(result.getEquipe().isEmpty());
    }

    @Test
    @DisplayName("Deve calcular metricas corretamente com solicitacoes finalizadas")
    void deveCalcularMetricasCorretamenteComSolicitacoesFinalizadas() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        ZonedDateTime dataInicial = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 0, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));
        ZonedDateTime dataFinal = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 5, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));

        Equipe equipe = Equipe.builder()
                .id(1L)
                .categoria(Categoria.CARTAO.getDescricao())
                .build();

        Fila fila = Fila.builder()
                .id(1L)
                .equipe(equipe)
                .build();

        Solicitacao solicitacao1 = Solicitacao.builder()
                .id(1L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataFinal)
                .dataHoraInicialFila(dataInicial)
                .fila(fila)
                .build();

        Solicitacao solicitacao2 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataFinal)
                .dataHoraInicialFila(dataInicial)
                .fila(fila)
                .build();

        Solicitacao solicitacao3 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(null)
                .dataHoraFinalAtendimento(null)
                .dataHoraInicialFila(dataInicial)
                .fila(fila)
                .build();

        Solicitacao solicitacao4 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(null)
                .dataHoraFinalAtendimento(dataFinal)
                .dataHoraInicialFila(dataInicial)
                .fila(fila)
                .build();

        Solicitacao solicitacao5 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(null)
                .dataHoraInicialFila(dataInicial)
                .fila(fila)
                .build();

        List<Solicitacao> solicitacoes = List.of(solicitacao1, solicitacao2);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(solicitacoes);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(2L, result.getTotalAtendimentos());
        assertEquals(0L, result.getTotalTicketsRecusados());
        assertEquals(300L, result.getTempoMedioAtendimento());
        assertNotNull(result.getEquipe());
        assertFalse(result.getEquipe().isEmpty());
    }

    @Test
    @DisplayName("Deve calcular metricas corretamente com solicitacoes recusadas")
    void deveCalcularMetricasCorretamenteComSolicitacoesRecusadas() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        ZonedDateTime dataInicial = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 0, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));

        Equipe equipe = Equipe.builder()
                .id(1L)
                .categoria(Categoria.CARTAO.getDescricao())
                .build();

        Fila fila = Fila.builder()
                .id(1L)
                .equipe(equipe)
                .build();

        Solicitacao solicitacaoRecusada = Solicitacao.builder()
                .id(1L)
                .statusSolicitacao(RECUSADO_POR_FILA_ESPERA_CHEIA)
                .dataHoraInicialSolicitacao(dataInicial)
                .fila(fila)
                .build();

        List<Solicitacao> solicitacoes = List.of(solicitacaoRecusada);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(solicitacoes);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(0L, result.getTotalAtendimentos());
        assertEquals(1L, result.getTotalTicketsRecusados());
        assertEquals(0L, result.getMediaTicketsRecusadosPorDia());
        assertNotNull(result.getEquipe());
        assertFalse(result.getEquipe().isEmpty());
    }

    @Test
    @DisplayName("Deve filtrar solicitacoes por equipe corretamente")
    void deveFiltrarSolicitacoesPorEquipeCorretamente() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        ZonedDateTime dataInicial = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 0, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));

        Equipe equipe1 = Equipe.builder()
                .id(1L)
                .categoria(Categoria.CARTAO.getDescricao())
                .build();

        Equipe equipe2 = Equipe.builder()
                .id(2L)
                .categoria(Categoria.CARTAO.getDescricao())
                .build();

        Fila fila1 = Fila.builder()
                .id(1L)
                .equipe(equipe1)
                .build();

        Fila fila2 = Fila.builder()
                .id(2L)
                .equipe(equipe2)
                .build();

        Solicitacao solicitacao1 = Solicitacao.builder()
                .id(1L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataInicial.plusMinutes(5))
                .dataHoraInicialFila(dataInicial)
                .fila(fila1)
                .build();

        Solicitacao solicitacao2 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataInicial.plusMinutes(10))
                .dataHoraInicialFila(dataInicial)
                .fila(fila2)
                .build();

        List<Solicitacao> solicitacoes = List.of(solicitacao1, solicitacao2);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(solicitacoes);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(2L, result.getTotalAtendimentos());
        assertEquals(2, result.getEquipe().size());
    }

    @Test
    @DisplayName("Deve filtrar solicitacoes por equipe corretamente com uma fila sem equipe")
    void deveFiltrarSolicitacoesPorEquipeCorretamenteComFilaSemEquipe() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        ZonedDateTime dataInicial = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 0, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));

        Equipe equipe1 = Equipe.builder()
                .id(1L)
                .categoria(Categoria.CARTAO.getDescricao())
                .build();

        Fila fila1 = Fila.builder()
                .id(1L)
                .equipe(equipe1)
                .build();

        Fila fila2 = Fila.builder()
                .id(2L)
                .build();

        Solicitacao solicitacao1 = Solicitacao.builder()
                .id(1L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataInicial.plusMinutes(5))
                .dataHoraInicialFila(dataInicial)
                .fila(fila1)
                .build();

        Solicitacao solicitacao2 = Solicitacao.builder()
                .id(2L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataInicial.plusMinutes(10))
                .dataHoraInicialFila(dataInicial)
                .fila(fila2)
                .build();

        List<Solicitacao> solicitacoes = List.of(solicitacao1, solicitacao2);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(solicitacoes);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(2L, result.getTotalAtendimentos());
        assertEquals(1, result.getEquipe().size());
    }

    @Test
    @DisplayName("Deve tratar solicitacoes sem fila corretamente")
    void deveTratarSolicitacoesSemFilaCorretamente() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        ZonedDateTime dataInicial = ZonedDateTime.of(
                java.time.LocalDateTime.of(2026, Month.AUGUST, 1, 10, 0, 0),
                java.time.ZoneId.of("America/Sao_Paulo"));

        Solicitacao solicitacaoSemFila = Solicitacao.builder()
                .id(1L)
                .statusSolicitacao(FINALIZADO)
                .dataHoraInicialSolicitacao(dataInicial)
                .dataHoraInicialAtendimento(dataInicial)
                .dataHoraFinalAtendimento(dataInicial.plusMinutes(5))
                .dataHoraInicialFila(dataInicial)
                .fila(null)
                .build();

        List<Solicitacao> solicitacoes = List.of(solicitacaoSemFila);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(solicitacoes);

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(1L, result.getTotalAtendimentos());
        assertTrue(result.getEquipe().isEmpty());
    }

    @Test
    @DisplayName("Deve calcular tempo medio zero quando lista vazia")
    void deveCalcularTempoMedioZeroQuandoListaVazia() {

        LocalDate data = LocalDate.of(2026, Month.AUGUST, 14);

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(any(), any()))
                .thenReturn(new ArrayList<>());

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(data);

        verify(solicitacaoRepository).findAllByDataHoraInicialSolicitacaoBetween(any(), any());

        assertNotNull(result);
        assertEquals(0L, result.getTempoMedioAtendimento());
        assertEquals(0L, result.getTempoMedioEspera());
    }

    @Test
    @DisplayName("Deve calcular media por dia zero quando dias for zero ou negativo")
    void deveCalcularMediaPorDiaZeroQuandoDiasForZero() {

        LocalDate dataOriginal = LocalDate.of(2026, Month.AUGUST, 14);
        LocalDate inicioInvertido = LocalDate.of(2026, Month.AUGUST, 31);
        LocalDate fimInvertido = LocalDate.of(2026, Month.AUGUST, 1);

        LocalDate dataSpy = spy(dataOriginal);

        doReturn(inicioInvertido).when(dataSpy).with(TemporalAdjusters.firstDayOfMonth());
        doReturn(fimInvertido).when(dataSpy).with(TemporalAdjusters.lastDayOfMonth());

        when(solicitacaoRepository.findAllByDataHoraInicialSolicitacaoBetween(
                any(ZonedDateTime.class), any(ZonedDateTime.class)))
                .thenReturn(new ArrayList<>());

        TelaMetricasGeraisResponse result = tested.gerarMetricasGerais(dataSpy);

        assertNotNull(result);
        assertEquals(0L, result.getMediaTicketsRecusadosPorDia());
    }
}
