package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.time.ZonedDateTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DetalheSolicitacaoAtendenteResponse {

    private String assunto;

    private Long protocolo;

    private ZonedDateTime dataHoraEntrouEmAtendimento;
}
