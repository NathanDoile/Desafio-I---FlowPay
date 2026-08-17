package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class TelaMetricasGeraisResponse {

    private Long tempoMedioAtendimento;

    private Long tempoMedioEspera;

    private Long totalAtendimentos;

    private Long totalTicketsRecusados;

    private Long mediaTicketsRecusadosPorDia;

    private Double taxaRecusa;

    private List<MetricasGeraisEquipeResponse> equipe;
}
