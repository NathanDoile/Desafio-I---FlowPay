package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.DetalheAtendentesResponse;
import br.com.ubots.flowpay.controller.response.DetalheFilaEsperaResponse;
import br.com.ubots.flowpay.controller.response.DetalheSolicitacaoAtendenteResponse;
import br.com.ubots.flowpay.controller.response.TelaDetalheResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.helper.DateTimeNow;
import br.com.ubots.flowpay.repository.EquipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.helper.DateTimeNow.diferencaEmSegundosEntre;

@Service
@RequiredArgsConstructor
public class TelaDetalheService {

    private final EquipeRepository equipeRepository;

    private final ZoneId zoneId = ZoneId.of("America/Sao_Paulo");

    public TelaDetalheResponse gerarDetalhe(String categoriaEquipe) {

        Equipe equipe = equipeRepository.findByCategoria(categoriaEquipe);
        LocalDate hoje = DateTimeNow.now().toLocalDate();

        List<Solicitacao> solicitacoesFinalizadas = filtrarPorDataHoje(
                equipe.getFila().getSolicitacoes(), FINALIZADO, hoje, Solicitacao::getDataHoraFinalAtendimento);

        List<Solicitacao> solicitacoesFinalizadasEEmAtendimento = filtrarPorDataHoje(
                equipe.getFila().getSolicitacoes(), List.of(FINALIZADO, EM_ATENDIMENTO), hoje, Solicitacao::getDataHoraInicialAtendimento);

        List<Solicitacao> solicitacoesRecusadas = filtrarPorDataHoje(
                equipe.getFila().getSolicitacoes(), RECUSADO_POR_FILA_ESPERA_CHEIA, hoje, Solicitacao::getDataHoraInicialSolicitacao);

        List<Solicitacao> solicitacoesEmFila = equipe.getFila().getSolicitacoes()
                .stream()
                .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(EM_FILA))
                .toList();

        Long tempoMedioAtendimento = calcularMediaTempo(solicitacoesFinalizadas,
                Solicitacao::getDataHoraInicialAtendimento, Solicitacao::getDataHoraFinalAtendimento);

        Long tempoMedioEspera = calcularMediaTempo(solicitacoesFinalizadasEEmAtendimento,
                Solicitacao::getDataHoraInicialFila, Solicitacao::getDataHoraInicialAtendimento);

        Long quantidadeAtendimentosEmAndamento = solicitacoesFinalizadasEEmAtendimento
                .stream()
                .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(EM_ATENDIMENTO))
                .count();

        Long quantidadeAtendimentosCancelados = (long) solicitacoesRecusadas.size();

        ZonedDateTime dataHoraUltimoCancelamento = solicitacoesRecusadas
                .stream()
                .max(Comparator.comparing(solicitacao -> solicitacao.getDataHoraInicialSolicitacao().withZoneSameInstant(zoneId)))
                .map(solicitacao -> solicitacao.getDataHoraInicialSolicitacao().withZoneSameInstant(zoneId))
                .orElse(null);

        List<DetalheFilaEsperaResponse> fila = solicitacoesEmFila
                .stream()
                .map(solicitacao -> DetalheFilaEsperaResponse
                        .builder()
                        .assunto(solicitacao.getAssunto())
                        .protocolo(solicitacao.getReferenciaConversa())
                        .dataHoraEntrouNaFila(solicitacao.getDataHoraInicialFila().withZoneSameInstant(zoneId))
                        .build())
                .toList();

        List<DetalheAtendentesResponse> atendentes = equipe.getAtendentes()
                .stream()
                .map(atendente -> {

                    List<Solicitacao> solicitacoesFinalizadasAtendente = filtrarPorDataHoje(
                            atendente.getSolicitacoes(), FINALIZADO, hoje, Solicitacao::getDataHoraFinalAtendimento);

                    Long tempoMedio = calcularMediaTempo(solicitacoesFinalizadasAtendente,
                            Solicitacao::getDataHoraInicialAtendimento, Solicitacao::getDataHoraFinalAtendimento);

                    DetalheAtendentesResponse detalheAtendentesResponse = DetalheAtendentesResponse
                            .builder()
                            .nome(atendente.getNomeDeUsuario())
                            .tempoMedioAtendimento(tempoMedio)
                            .quantidadeAtendimentosConcluidos((long) solicitacoesFinalizadasAtendente.size())
                            .build();

                    List<DetalheSolicitacaoAtendenteResponse> detalheSolicitacaoAtendenteResponseList = atendente.getSolicitacoes()
                            .stream()
                            .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(EM_ATENDIMENTO))
                            .map(solicitacao -> DetalheSolicitacaoAtendenteResponse
                                    .builder()
                                    .assunto(solicitacao.getAssunto())
                                    .protocolo(solicitacao.getReferenciaConversa())
                                    .dataHoraEntrouEmAtendimento(solicitacao.getDataHoraInicialAtendimento())
                                    .build())
                            .toList();

                    detalheAtendentesResponse.setSolicitacoes(detalheSolicitacaoAtendenteResponseList);

                    return detalheAtendentesResponse;
                })
                .toList();

        return TelaDetalheResponse
                .builder()
                .quantidadeAtendentes((long) equipe.getAtendentes().size())
                .tempoMedioAtendimento(tempoMedioAtendimento)
                .quantidadeAtendimentosConcluidos((long) solicitacoesFinalizadas.size())
                .tempoMedioEspera(tempoMedioEspera)
                .quantidadeAtendimentosEmAndamento(quantidadeAtendimentosEmAndamento)
                .quantidadeAtendimentosCancelados(quantidadeAtendimentosCancelados)
                .dataHoraUltimoCancelamento(dataHoraUltimoCancelamento)
                .capacidadeFila(3L)
                .fila(fila)
                .atendentes(atendentes)
                .build();
    }

    private List<Solicitacao> filtrarPorDataHoje(List<Solicitacao> solicitacoes, StatusSolicitacao status,
                                                  LocalDate hoje, java.util.function.Function<Solicitacao, ZonedDateTime> dataExtractor) {
        return filtrarPorDataHoje(solicitacoes, List.of(status), hoje, dataExtractor);
    }

    private List<Solicitacao> filtrarPorDataHoje(List<Solicitacao> solicitacoes, List<StatusSolicitacao> statusList,
                                                  LocalDate hoje, java.util.function.Function<Solicitacao, ZonedDateTime> dataExtractor) {
        return solicitacoes.stream()
                .filter(solicitacao -> statusList.contains(solicitacao.getStatusSolicitacao()))
                .filter(solicitacao -> {
                    return Optional.ofNullable(dataExtractor.apply(solicitacao))
                           .map(d -> d.withZoneSameInstant(zoneId))
                           .map(ZonedDateTime::toLocalDate)
                           .map(hoje::equals)
                           .orElse(false);
                })
                .toList();
    }

    private Long calcularMediaTempo(List<Solicitacao> solicitacoes,
                                     java.util.function.Function<Solicitacao, ZonedDateTime> dataInicio,
                                     java.util.function.Function<Solicitacao, ZonedDateTime> dataFim) {
        if (solicitacoes.isEmpty()) {
            return 0L;
        }
        return solicitacoes.stream()
                .mapToLong(solicitacao -> diferencaEmSegundosEntre(dataInicio.apply(solicitacao).withZoneSameInstant(zoneId), dataFim.apply(solicitacao).withZoneSameInstant(java.time.ZoneId.of("America/Sao_Paulo"))))
                .sum() / solicitacoes.size();
    }
}
