package br.com.ubots.flowpay.factory;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.EMPRESTIMO;

public class SolicitacaoFactory {

    public static CriarSolicitacaoRequest criarSolicitacaoRequest() {

        return CriarSolicitacaoRequest
                .builder()
                .referenciaConversa(20260730000001L)
                .assunto(EMPRESTIMO.getDescricao())
                .build();
    }
}
