package br.com.ubots.flowpay.controller.response;

import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import lombok.*;

@Builder
@AllArgsConstructor @NoArgsConstructor
@Getter @Setter
public class CriarSolicitacaoResponse {

    private Long id;

    private Long referenciaConversa;

    private StatusSolicitacao statusSolicitacao;

    private String assunto;
}
