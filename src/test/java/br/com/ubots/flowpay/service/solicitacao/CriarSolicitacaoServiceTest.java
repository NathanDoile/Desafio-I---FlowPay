package br.com.ubots.flowpay.service.solicitacao;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.service.fila.EncaminharSolicitacaoParaFilaService;
import br.com.ubots.flowpay.service.validator.ValidaReferenciaConversaService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.SOLICITADO;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.criarSolicitacaoRequest;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CriarSolicitacaoServiceTest {

    @InjectMocks
    private CriarSolicitacaoService tested;

    @Mock
    private ValidaReferenciaConversaService validaReferenciaConversaService;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Mock
    private EncaminharSolicitacaoParaFilaService encaminharSolicitacaoParaFilaService;

    @Captor
    private ArgumentCaptor<Solicitacao> solicitacaoCaptor;

    @Test
    @DisplayName("Deve cadastrar a solicitação corretamente")
    void deveCadastrarSolicitacaoComDadosCorretos(){

        CriarSolicitacaoRequest request = criarSolicitacaoRequest();

        tested.criar(request);

        verify(validaReferenciaConversaService).jaExiste(request.getReferenciaConversa());
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());

        Solicitacao response = solicitacaoCaptor.getValue();

        verify(encaminharSolicitacaoParaFilaService).encaminharParaFila(response);

        assertEquals(request.getReferenciaConversa(), response.getReferenciaConversa());
        assertEquals(SOLICITADO, response.getStatusSolicitacao());
        assertEquals(request.getAssunto(), response.getAssunto());
    }

    @Test
    @DisplayName("Não deve cadastrar se referencia da conversa já registrada")
    void naoDeveCadastrarSeReferenciaConversaJaRegistrada(){

        CriarSolicitacaoRequest request = criarSolicitacaoRequest();

        doThrow(ResponseStatusException.class).when(validaReferenciaConversaService).jaExiste(request.getReferenciaConversa());

        assertThrows(ResponseStatusException.class, () -> tested.criar(request));

        verify(validaReferenciaConversaService).jaExiste(request.getReferenciaConversa());
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
        verify(encaminharSolicitacaoParaFilaService, never()).encaminharParaFila(any(Solicitacao.class));
    }
}
