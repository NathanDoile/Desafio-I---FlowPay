package br.com.ubots.flowpay.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Getter
public class CriarSolicitacaoRequest {

    @NotBlank
    private String assunto;

    @NotNull
    @Positive
    private Long referenciaConversa;
}
