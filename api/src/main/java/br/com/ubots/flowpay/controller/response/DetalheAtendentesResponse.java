package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.util.List;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DetalheAtendentesResponse {

    private String nome;

    private Long tempoMedioAtendimento;

    private Long quantidadeAtendimentosConcluidos;

    private List<DetalheSolicitacaoAtendenteResponse> solicitacoes;
}
