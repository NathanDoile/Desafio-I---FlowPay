package br.com.ubots.flowpay.controller.response;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class HomeEquipeResponse {

    private Long id;

    private String nome;

    private Long quantidadeTicketsEmFila;

    private Long quantidadeAtendentes;

    private Long mediaTempoEsperaEmSegundos;
}
