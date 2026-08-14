package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.time.ZonedDateTime;
import java.util.List;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class TelaDetalheResponse {

    private Long quantidadeAtendentes;

    private Long tempoMedioAtendimento;

    private Long quantidadeAtendimentosConcluidos;

    private Long tempoMedioEspera;

    private Long quantidadeAtendimentosEmAndamento;

    private Long quantidadeAtendimentosCancelados;

    private ZonedDateTime dataHoraUltimoCancelamento;

    private Long capacidadeFila;

    private List<DetalheFilaEsperaResponse> fila;

    private List<DetalheAtendentesResponse> atendentes;
}
