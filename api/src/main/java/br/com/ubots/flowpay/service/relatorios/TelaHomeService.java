package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.HomeEquipeResponse;
import br.com.ubots.flowpay.controller.response.TelaHomeResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.EquipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static br.com.ubots.flowpay.helper.DateTimeNow.diferencaEmSegundosParaAgora;

@Service
@RequiredArgsConstructor
public class TelaHomeService {

    private final EquipeRepository equipeRepository;

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

        List<Solicitacao> solicitacoesEmFila = equipe.getFila().getSolicitacoes()
                .stream()
                .filter(solicitacao -> solicitacao.getStatusSolicitacao().equals(EM_FILA))
                .toList();

        if (solicitacoesEmFila.isEmpty()) {
            return 0L;
        }

        Long somaTemposEmFila = solicitacoesEmFila
                .stream()
                .map(solicitacao -> diferencaEmSegundosParaAgora(solicitacao.getDataHoraInicialFila()))
                .reduce(0L, Long::sum);

        return somaTemposEmFila / solicitacoesEmFila.size();
    }
}
