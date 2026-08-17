package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.HomeEquipeResponse;
import br.com.ubots.flowpay.controller.response.TelaHomeResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.helper.DateTimeNow;
import br.com.ubots.flowpay.repository.EquipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.helper.DateTimeNow.diferencaEmSegundosEntre;
import static br.com.ubots.flowpay.helper.DateTimeNow.diferencaEmSegundosParaAgora;

@Service
@RequiredArgsConstructor
public class TelaHomeService {

    private final EquipeRepository equipeRepository;

    private final ZoneId zoneId = ZoneId.of("America/Sao_Paulo");

    public TelaHomeResponse gerarHome() {

        List<Equipe> equipes = equipeRepository.findAll();

        List<HomeEquipeResponse> equipesResponse = equipes
                .stream()
                .map(equipe -> HomeEquipeResponse
                        .builder()
                        .id(equipe.getId())
                        .nome(equipe.getCategoria())
                        .quantidadeTicketsEmFila(equipe.getFila().getSolicitacoes()
                                .stream()
                                .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(EM_FILA))
                                .count())
                        .quantidadeAtendentes((long) equipe.getAtendentes().size())
                        .mediaTempoEsperaEmSegundos(mediaTempoEspera(equipe))
                        .build())
                .toList();

        Long quantidadeTicketsEmFila = equipesResponse
                .stream()
                .mapToLong(HomeEquipeResponse::getQuantidadeTicketsEmFila)
                .sum();

        Long quantidadeAtendentes = equipesResponse
                .stream()
                .mapToLong(HomeEquipeResponse::getQuantidadeAtendentes)
                .sum();

        return TelaHomeResponse
                .builder()
                .totalTickets(quantidadeTicketsEmFila)
                .quantidadeAtendentes(quantidadeAtendentes)
                .quantidadeEquipes((long) equipes.size())
                .equipes(equipesResponse)
                .build();
    }

    private Long mediaTempoEspera(Equipe equipe){

        ZonedDateTime hoje = DateTimeNow.now();

        List<Solicitacao> solicitacoesEmFila = equipe.getFila().getSolicitacoes()
                .stream()
                .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(FINALIZADO) || solicitacao.getStatusSolicitacao().equals(EM_ATENDIMENTO))
                .filter(solicitacao -> solicitacao.getDataHoraInicialSolicitacao().withZoneSameInstant(zoneId).getDayOfMonth() == hoje.getDayOfMonth()
                    && solicitacao.getDataHoraInicialSolicitacao().withZoneSameInstant(zoneId).getMonth().equals(hoje.getMonth())
                    && solicitacao.getDataHoraInicialSolicitacao().withZoneSameInstant(zoneId).getYear() == hoje.getYear()
                )
                .toList();

        if (solicitacoesEmFila.isEmpty()) {
            return 0L;
        }

        Long somaTemposEmFila = solicitacoesEmFila
                .stream()
                .map(solicitacao -> diferencaEmSegundosEntre(solicitacao.getDataHoraInicialFila().withZoneSameInstant(zoneId), solicitacao.getDataHoraInicialAtendimento().withZoneSameInstant(zoneId)))
                .reduce(0L, Long::sum);

        return somaTemposEmFila / solicitacoesEmFila.size();
    }
}
