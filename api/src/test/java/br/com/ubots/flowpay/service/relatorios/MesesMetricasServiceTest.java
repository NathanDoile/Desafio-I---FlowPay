package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.helper.DateNow;
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
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MesesMetricasServiceTest {

    @InjectMocks
    private MesesMetricasService tested;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Test
    @DisplayName("Deve retornar lista vazia quando não encontrar solicitacao")
    void deveRetornarListaVaziaQuandoNaoEncontrarSolicitacao() {

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.empty());

        List<LocalDate> result = tested.gerarMesesMetricas();

        verify(solicitacaoRepository).findById(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Deve retornar lista vazia quando solicitacao for null")
    void deveRetornarListaVaziaQuandoSolicitacaoForNull() {

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.ofNullable(null));

        List<LocalDate> result = tested.gerarMesesMetricas();

        verify(solicitacaoRepository).findById(1L);

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    @DisplayName("Deve gerar lista de meses quando encontrar solicitacao")
    void deveGerarListaMesesQuandoEncontrarSolicitacao() {

        LocalDate dataInicial = LocalDate.of(2026, Month.JANUARY, 20);
        LocalDate hoje = LocalDate.of(2026, Month.MARCH, 20);

        Solicitacao solicitacao = Solicitacao.builder()
                .id(1L)
                .dataHoraInicialSolicitacao(ZonedDateTime.of(dataInicial.atStartOfDay(), java.time.ZoneId.systemDefault()))
                .build();

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.of(solicitacao));

        try (MockedStatic<DateNow> mockedDateNow = mockStatic(DateNow.class)) {
            mockedDateNow.when(DateNow::now).thenReturn(hoje);

            List<LocalDate> result = tested.gerarMesesMetricas();

            verify(solicitacaoRepository).findById(1L);

            assertNotNull(result);
            assertFalse(result.isEmpty());
            assertEquals(3, result.size());
            assertEquals(dataInicial, result.get(0));
            assertEquals(dataInicial.plusMonths(1), result.get(1));
            assertEquals(dataInicial.plusMonths(2), result.get(2));
        }
    }

    @Test
    @DisplayName("Deve gerar lista com unico mes quando data inicial for igual a hoje")
    void deveGerarListaUnicoMesQuandoDataInicialIgualHoje() {

        LocalDate dataInicial = LocalDate.of(2026, Month.MARCH, 20);
        LocalDate hoje = LocalDate.of(2026, Month.MARCH, 20);

        Solicitacao solicitacao = Solicitacao.builder()
                .id(1L)
                .dataHoraInicialSolicitacao(ZonedDateTime.of(dataInicial.atStartOfDay(), java.time.ZoneId.systemDefault()))
                .build();

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.of(solicitacao));

        try (MockedStatic<DateNow> mockedDateNow = mockStatic(DateNow.class)) {
            mockedDateNow.when(DateNow::now).thenReturn(hoje);

            List<LocalDate> result = tested.gerarMesesMetricas();

            verify(solicitacaoRepository).findById(1L);

            assertNotNull(result);
            assertEquals(1, result.size());
            assertEquals(dataInicial, result.get(0));
        }
    }

    @Test
    @DisplayName("Deve gerar lista com meses do mesmo ano")
    void deveGerarListaMesesMesmoAno() {

        LocalDate dataInicial = LocalDate.of(2026, Month.JANUARY, 20);
        LocalDate hoje = LocalDate.of(2026, Month.JUNE, 15);

        Solicitacao solicitacao = Solicitacao.builder()
                .id(1L)
                .dataHoraInicialSolicitacao(ZonedDateTime.of(dataInicial.atStartOfDay(), java.time.ZoneId.systemDefault()))
                .build();

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.of(solicitacao));

        try (MockedStatic<DateNow> mockedDateNow = mockStatic(DateNow.class)) {
            mockedDateNow.when(DateNow::now).thenReturn(hoje);

            List<LocalDate> result = tested.gerarMesesMetricas();

            verify(solicitacaoRepository).findById(1L);

            assertNotNull(result);
            assertEquals(6, result.size());
        }
    }

    @Test
    @DisplayName("Deve gerar lista com meses de anos diferentes")
    void deveGerarListaMesesAnosDiferentes() {

        LocalDate dataInicial = LocalDate.of(2025, Month.NOVEMBER, 1);
        LocalDate hoje = LocalDate.of(2026, Month.FEBRUARY, 15);

        Solicitacao solicitacao = Solicitacao.builder()
                .id(1L)
                .dataHoraInicialSolicitacao(ZonedDateTime.of(dataInicial.atStartOfDay(), java.time.ZoneId.systemDefault()))
                .build();

        when(solicitacaoRepository.findById(1L)).thenReturn(java.util.Optional.of(solicitacao));

        try (MockedStatic<DateNow> mockedDateNow = mockStatic(DateNow.class)) {
            mockedDateNow.when(DateNow::now).thenReturn(hoje);

            List<LocalDate> result = tested.gerarMesesMetricas();

            verify(solicitacaoRepository).findById(1L);

            assertNotNull(result);
            assertEquals(4, result.size());
        }
    }
}
