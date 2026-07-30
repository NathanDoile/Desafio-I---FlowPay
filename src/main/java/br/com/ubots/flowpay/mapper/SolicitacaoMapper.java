package br.com.ubots.flowpay.mapper;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;

public class SolicitacaoMapper {

    public static Solicitacao toEntity(CriarSolicitacaoRequest request) {

        return Solicitacao
                .builder()
                .assunto(request.getAssunto().toLowerCase())
                .referenciaConversa(request.getReferenciaConversa())
                .build();
    }
}
