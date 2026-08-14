package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class TelaHomeResponse {

    private Long totalTickets;

    private Long quantidadeAtendentes;

    private Long quantidadeEquipes;

    private List<HomeEquipeResponse> equipes;
}
