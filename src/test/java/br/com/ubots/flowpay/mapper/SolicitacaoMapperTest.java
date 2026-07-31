package br.com.ubots.flowpay.mapper;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.factory.SolicitacaoFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static br.com.ubots.flowpay.factory.SolicitacaoFactory.criarSolicitacaoRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class SolicitacaoMapperTest {

    @Test
    @DisplayName("Deve fazer a conversão corretamente")
    void deveFazerConversaoCorretamente(){

        CriarSolicitacaoRequest request = criarSolicitacaoRequest();

        Solicitacao response = SolicitacaoMapper.toEntity(request);

        assertEquals(request.getAssunto(), response.getAssunto());
        assertEquals(request.getReferenciaConversa(), response.getReferenciaConversa());
    }
}
