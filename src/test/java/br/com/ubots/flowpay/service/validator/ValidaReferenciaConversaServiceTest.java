package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.CONFLICT;

@ExtendWith(MockitoExtension.class)
class ValidaReferenciaConversaServiceTest {

    @InjectMocks
    private ValidaReferenciaConversaService tested;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Test
    @DisplayName("Deve dar erro se referencia da conversa já existir no banco")
    void deveDarErroSeReferenciaConversaJaExistir(){

        Long referenciaConversa = 202607300000001L;

        when(solicitacaoRepository.existsByReferenciaConversa(referenciaConversa)).thenReturn(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.jaExiste(referenciaConversa));

        assertEquals(CONFLICT, exception.getStatusCode());
        assertEquals("Já existe solicitação para essa conversa.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se referencia da conversa não exitir no banco")
    void naoDeveDarErroSeReferenciaConversaNaoExistir(){

        Long referenciaConversa = 202607300000001L;

        when(solicitacaoRepository.existsByReferenciaConversa(referenciaConversa)).thenReturn(false);

        assertDoesNotThrow(() -> tested.jaExiste(referenciaConversa));
    }
}
