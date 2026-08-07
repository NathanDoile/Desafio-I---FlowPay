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

    @NotNull(message = "não deve ser nulo")
    @Positive(message = "deve ser maior que 0")
    private Long referenciaConversa;

    @NotBlank(message = "não deve estar em branco")
    private String assunto;
}
