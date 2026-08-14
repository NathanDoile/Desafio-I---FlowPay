package br.com.ubots.flowpay.factory;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.helper.DateTimeNow;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.EMPRESTIMO;

public class SolicitacaoFactory {

    public static CriarSolicitacaoRequest criarSolicitacaoRequest() {

        return CriarSolicitacaoRequest
                .builder()
                .referenciaConversa(20260730000001L)
                .assunto(EMPRESTIMO.getDescricao())
                .build();
    }

    public static Solicitacao solicitacao(StatusSolicitacao statusSolicitacao) {

        return Solicitacao
                .builder()
                .id(1L)
                .referenciaConversa(20260731000001L)
                .statusSolicitacao(statusSolicitacao)
                .assunto(EMPRESTIMO.getDescricao())
                .dataHoraInicialFila(DateTimeNow.now().minusSeconds(30))
                .versao(0L)
                .build();
    }
}
