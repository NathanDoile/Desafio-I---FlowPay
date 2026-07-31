package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Solicitacao;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.SOLICITADO;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.solicitacao;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ExtendWith(MockitoExtension.class)
class ValidaStatusSolicitacaoValidatorTest {

    @InjectMocks
    private ValidaStatusSolicitacaoValidator tested;

    @Test
    @DisplayName("Deve dar erro se solicitacao tiver status diferente de SOLICITADO")
    void deveDarErroSeSolicitacaoStatusDiferenteSolicitaco(){

        Solicitacao solicitacao = solicitacao(EM_FILA);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.emFila(solicitacao));

        assertEquals(BAD_REQUEST, exception.getStatusCode());
        assertEquals("Solicitação não está aguardando para entrar em uma fila, " +
                "verifique os andamentos dessa solicitação.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se solicitacao tiver status SOLICITADO")
    void naoDeveDarErroSeSolicitacaoStatusSolicitado(){

        Solicitacao solicitacao = solicitacao(SOLICITADO);

        assertDoesNotThrow(() -> tested.emFila(solicitacao));
    }
}
