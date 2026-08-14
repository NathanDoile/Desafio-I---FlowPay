package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.MetricasGeraisEquipeResponse;
import br.com.ubots.flowpay.controller.response.TelaMetricasGeraisResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Function;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.helper.DateTimeNow.diferencaEmSegundosEntre;
import static java.time.temporal.TemporalAdjusters.firstDayOfMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Service
@RequiredArgsConstructor
public class TelaMetricasGeraisService {

    private final SolicitacaoRepository solicitacaoRepository;

    public TelaMetricasGeraisResponse gerarMetricasGerais(LocalDate data) {
        LocalDate primeiroDoMes = data.with(firstDayOfMonth());
        LocalDate ultimoDoMes = data.with(lastDayOfMonth());

        ZonedDateTime primeiroDoMesZoned = primeiroDoMes.atStartOfDay(java.time.ZoneId.of("America/Sao_Paulo"));
        ZonedDateTime ultimoDoMesZoned = ultimoDoMes.atTime(23, 59, 59).atZone(java.time.ZoneId.of("America/Sao_Paulo"));

        List<Solicitacao> solicitacoesDoMes = solicitacaoRepository
                .findAllByDataHoraInicialSolicitacaoBetween(primeiroDoMesZoned, ultimoDoMesZoned);

        if (solicitacoesDoMes == null) {
            solicitacoesDoMes = new ArrayList<>();
        }

        List<Solicitacao> finalizadas = filtrarPorStatus(solicitacoesDoMes, FINALIZADO);
        List<Solicitacao> naoRecusadasNaoEmFila = filtrarPorStatusExcluindo(solicitacoesDoMes, RECUSADO_POR_FILA_ESPERA_CHEIA, EM_FILA);
        List<Solicitacao> recusadas = filtrarPorStatus(solicitacoesDoMes, RECUSADO_POR_FILA_ESPERA_CHEIA);

        Long tempoMedioAtendimento = calcularMediaTempo(finalizadas,
                Solicitacao::getDataHoraInicialAtendimento, Solicitacao::getDataHoraFinalAtendimento);

        Long tempoMedioEspera = calcularMediaTempo(naoRecusadasNaoEmFila,
                Solicitacao::getDataHoraInicialFila, Solicitacao::getDataHoraInicialAtendimento);

        long diasNoMes = java.time.temporal.ChronoUnit.DAYS.between(primeiroDoMes, ultimoDoMes) + 1;
        Long mediaTicketsRecusadosPorDia = calcularMediaPorDia(recusadas.size(), diasNoMes);

        List<Equipe> equipes = extrairEquipes(solicitacoesDoMes);
        List<MetricasGeraisEquipeResponse> equipesResponse = gerarMetricasPorEquipe(solicitacoesDoMes, equipes, diasNoMes);

        return TelaMetricasGeraisResponse.builder()
                .tempoMedioAtendimento(tempoMedioAtendimento != null ? tempoMedioAtendimento : 0L)
                .tempoMedioEspera(tempoMedioEspera != null ? tempoMedioEspera : 0L)
                .totalAtendimentos((long) finalizadas.size())
                .totalTicketsRecusados((long) recusadas.size())
                .mediaTicketsRecusadosPorDia(mediaTicketsRecusadosPorDia != null ? mediaTicketsRecusadosPorDia : 0L)
                .equipe(equipesResponse)
                .build();
    }

    private List<Solicitacao> filtrarPorStatus(List<Solicitacao> solicitacoes, StatusSolicitacao status) {
        return solicitacoes.stream()
                .filter(s -> s.getStatusSolicitacao().equals(status))
                .toList();
    }

    private List<Solicitacao> filtrarPorStatusExcluindo(List<Solicitacao> solicitacoes, StatusSolicitacao... statusExcluidos) {
        List<StatusSolicitacao> excluidos = List.of(statusExcluidos);
        return solicitacoes.stream()
                .filter(s -> !excluidos.contains(s.getStatusSolicitacao()))
                .toList();
    }

    private Long calcularMediaTempo(List<Solicitacao> solicitacoes,
                                     Function<Solicitacao, ZonedDateTime> dataInicio,
                                     Function<Solicitacao, ZonedDateTime> dataFim) {
        if (solicitacoes.isEmpty()) {
            return 0L;
        }
        return solicitacoes.stream()
                .filter(s -> dataInicio.apply(s) != null && dataFim.apply(s) != null)
                .mapToLong(s -> diferencaEmSegundosEntre(dataInicio.apply(s), dataFim.apply(s)))
                .sum() / solicitacoes.size();
    }

    private long calcularDiasNoMes(LocalDate primeiroDoMes, LocalDate ultimoDoMes) {
        return java.time.temporal.ChronoUnit.DAYS.between(primeiroDoMes, ultimoDoMes) + 1;
    }

    private Long calcularMediaPorDia(long quantidade, long dias) {
        return dias > 0 ? quantidade / dias : 0L;
    }

    private List<Equipe> extrairEquipes(List<Solicitacao> solicitacoes) {
        return solicitacoes.stream()
                .filter(s -> s.getFila() != null && s.getFila().getEquipe() != null)
                .map(s -> s.getFila().getEquipe())
                .distinct()
                .toList();
    }

    private List<MetricasGeraisEquipeResponse> gerarMetricasPorEquipe(
            List<Solicitacao> solicitacoesDoMes, List<Equipe> equipes, long diasNoMes) {

        List<MetricasGeraisEquipeResponse> response = new ArrayList<>();

        for (Equipe equipe : equipes) {
            List<Solicitacao> solicitacoesEquipe = filtrarPorEquipe(solicitacoesDoMes, equipe);
            List<Solicitacao> finalizadasEquipe = filtrarPorStatus(solicitacoesEquipe, FINALIZADO);
            List<Solicitacao> naoRecusadasNaoEmFilaEquipe = filtrarPorStatusExcluindo(solicitacoesEquipe, RECUSADO_POR_FILA_ESPERA_CHEIA, EM_FILA);
            List<Solicitacao> recusadasEquipe = filtrarPorStatus(solicitacoesEquipe, RECUSADO_POR_FILA_ESPERA_CHEIA);

            Long tempoMedioAtendimentoEquipe = calcularMediaTempo(finalizadasEquipe,
                    Solicitacao::getDataHoraInicialAtendimento, Solicitacao::getDataHoraFinalAtendimento);

            Long tempoMedioEsperaEquipe = calcularMediaTempo(naoRecusadasNaoEmFilaEquipe,
                    Solicitacao::getDataHoraInicialFila, Solicitacao::getDataHoraInicialAtendimento);

            Long mediaTicketsRecusadosPorDiaEquipe = calcularMediaPorDia(recusadasEquipe.size(), diasNoMes);

            response.add(MetricasGeraisEquipeResponse.builder()
                    .tempoMedioAtendimento(tempoMedioAtendimentoEquipe)
                    .tempoMedioEspera(tempoMedioEsperaEquipe)
                    .totalAtendimentos((long) finalizadasEquipe.size())
                    .totalTicketsRecusados((long) recusadasEquipe.size())
                    .mediaTicketsRecusadosPorDia(mediaTicketsRecusadosPorDiaEquipe)
                    .build());
        }

        return response;
    }

    private List<Solicitacao> filtrarPorEquipe(List<Solicitacao> solicitacoes, Equipe equipe) {
        return solicitacoes.stream()
                .filter(s -> s.getFila() != null && s.getFila().getEquipe() != null && s.getFila().getEquipe().equals(equipe))
                .toList();
    }
}
