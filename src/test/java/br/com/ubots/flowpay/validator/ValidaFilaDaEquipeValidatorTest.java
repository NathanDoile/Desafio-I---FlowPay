package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.factory.EquipeFactory;
import br.com.ubots.flowpay.factory.FilaFactory;
import br.com.ubots.flowpay.factory.SolicitacaoFactory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.Categoria.CARTAO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ExtendWith(MockitoExtension.class)
class ValidaFilaDaEquipeValidatorTest {

    @InjectMocks
    private ValidaFilaDaEquipeValidator tested;

    @Test
    @DisplayName("Deve dar erro se equipe não conter solicitações na fila")
    void deveDarErroSeEquipeNaoConterSolicitacoes(){

        Equipe equipe = EquipeFactory.equipe(CARTAO);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.possuiFila(equipe));

        assertEquals(BAD_REQUEST, exception.getStatusCode());
        assertEquals("Não há solicitações na fila para serem distribuídas.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se equipe conter solicitações na fila")
    void naoDeveDarErroSeEquipeConterSolicitacoes(){

        Equipe equipe = EquipeFactory.equipe(CARTAO);

        Fila fila = FilaFactory.fila();

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(EM_FILA);
        fila.getSolicitacoes().add(solicitacao);

        equipe.setFila(fila);

        assertDoesNotThrow(() -> tested.possuiFila(equipe));
    }
}
