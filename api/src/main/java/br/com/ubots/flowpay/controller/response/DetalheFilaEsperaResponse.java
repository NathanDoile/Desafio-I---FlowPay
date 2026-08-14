package br.com.ubots.flowpay.controller.response;

import lombok.*;

import java.time.LocalTime;

@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DetalheFilaEsperaResponse {

    private String assunto;

    private Long protocolo;

    private LocalTime horaEntrouNaFila;
}
