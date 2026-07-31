package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.factory.FilaFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@ExtendWith(MockitoExtension.class)
class ValidaOcupacaoFilaValidatorTest {

    @InjectMocks
    private ValidaOcupacaoFilaValidator tested;

    @Test
    @DisplayName("Deve dar erro se fila estiver cheia")
    void deveDarErroSeFilaCheia(){

        Fila fila = FilaFactory.fila();
        fila.setCheia(true);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.filaCheia(fila));

        assertEquals(SERVICE_UNAVAILABLE, exception.getStatusCode());
        assertEquals("Fila se solicitações cheia, tente novamente mais tarde.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se fila não estiver cheia")
    void naoDeveDarErroSeFilaNaoCheia(){

        Fila fila = FilaFactory.fila();

        assertDoesNotThrow(() -> tested.filaCheia(fila));
    }
}
