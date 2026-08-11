package br.com.ubots.flowpay.mapper;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static br.com.ubots.flowpay.factory.SolicitacaoFactory.criarSolicitacaoRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;

class SolicitacaoMapperTest {

    @Test
    @DisplayName("Deve fazer a conversão corretamente")
    void deveFazerConversaoCorretamente(){

        CriarSolicitacaoRequest request = criarSolicitacaoRequest();

        Solicitacao response = SolicitacaoMapper.toEntity(request);

        assertEquals(request.getAssunto(), response.getAssunto());
        assertEquals(request.getReferenciaConversa(), response.getReferenciaConversa());
    }
}
