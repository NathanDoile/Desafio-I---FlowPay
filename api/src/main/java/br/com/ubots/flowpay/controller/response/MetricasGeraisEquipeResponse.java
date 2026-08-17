package br.com.ubots.flowpay.controller.response;

import lombok.*;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class MetricasGeraisEquipeResponse {

    private String nome;

    private Long tempoMedioAtendimento;

    private Long tempoMedioEspera;

    private Long totalAtendimentos;

    private Long totalTicketsRecusados;

    private Long mediaTicketsRecusadosPorDia;
}
