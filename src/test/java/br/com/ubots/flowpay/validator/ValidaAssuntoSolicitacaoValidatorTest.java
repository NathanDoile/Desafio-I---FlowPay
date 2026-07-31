package br.com.ubots.flowpay.validator;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ExtendWith(MockitoExtension.class)
class ValidaAssuntoSolicitacaoValidatorTest {

    @InjectMocks
    private ValidaAssuntoSolicitacaoValidator tested;

    @Test
    @DisplayName("Deve dar erro se assunto inválido")
    void deveDarErroSeAssuntoInvalido(){

        String assunto = "INVÁLIDO";

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.assuntoValido(assunto));

        assertEquals(BAD_REQUEST, exception.getStatusCode());
        assertEquals("A solicitação deve ser de um dos três tipos: 'Problemas com cartao', " +
                "'Contratacao de emprestimo' e 'Outros assuntos'.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se assunto válido")
    void naoDeveDarErroSeAssuntoValido(){

        String assuntoI = "problemas com cartao";
        String assuntoII = "contratacao de emprestimo";
        String assuntoIII = "outros assuntos";

        assertDoesNotThrow(() -> tested.assuntoValido(assuntoI));
        assertDoesNotThrow(() -> tested.assuntoValido(assuntoII));
        assertDoesNotThrow(() -> tested.assuntoValido(assuntoIII));
    }
}
