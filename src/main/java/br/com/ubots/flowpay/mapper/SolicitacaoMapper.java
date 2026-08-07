package br.com.ubots.flowpay.mapper;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.controller.response.CriarSolicitacaoResponse;
import br.com.ubots.flowpay.domain.Solicitacao;

public class SolicitacaoMapper {

    private SolicitacaoMapper(){}

    public static Solicitacao toEntity(CriarSolicitacaoRequest request) {

        return Solicitacao
                .builder()
                .assunto(request.getAssunto().toLowerCase())
                .referenciaConversa(request.getReferenciaConversa())
                .build();
    }

    public static CriarSolicitacaoResponse toResponse(Solicitacao solicitacaoRetorno) {

        return CriarSolicitacaoResponse
                .builder()
                .id(solicitacaoRetorno.getId())
                .referenciaConversa(solicitacaoRetorno.getReferenciaConversa())
                .statusSolicitacao(solicitacaoRetorno.getStatusSolicitacao())
                .assunto(solicitacaoRetorno.getAssunto())
                .build();
    }
}
