package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.solicitacao;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@ExtendWith(MockitoExtension.class)
class ValidaAtendimentoServiceTest {

    @InjectMocks
    private ValidaAtendimentoService tested;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Test
    @DisplayName("Deve dar erro se id da solicitação errado")
    void deveDarErroSeIdInvalido(){

        Long id = 1L;

        when(solicitacaoRepository.existsById(id)).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.porIdEmAtendimento(id));

        verify(solicitacaoRepository).existsById(id);

        assertEquals(NOT_FOUND, exception.getStatusCode());
        assertEquals("Não existe atendimento em andamento com o ID informado.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se id da solicitação correto")
    void naoDeveDarErroSeIdValido(){

        Long id = 1L;

        when(solicitacaoRepository.existsById(id)).thenReturn(true);

        assertDoesNotThrow(() -> tested.porIdEmAtendimento(id));
    }

    @Test
    @DisplayName("Deve dar erro se status não for EM_ATENDIMENTO ou FINALIZADO")
    void deveDarErroSeStatusInvalido(){

        Solicitacao solicitacao = solicitacao(StatusSolicitacao.EM_FILA);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.porStatusEmAtendimentoOuFinalizado(solicitacao));

        assertEquals(NOT_FOUND, exception.getStatusCode());
        assertEquals("Não existe atendimento em andamento com o ID informado.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se status for EM_ATENDIMENTO")
    void naoDeveDarErroSeStatusEmAtendimento(){

        Solicitacao solicitacao = solicitacao(EM_ATENDIMENTO);

        assertDoesNotThrow(() -> tested.porStatusEmAtendimentoOuFinalizado(solicitacao));
    }

    @Test
    @DisplayName("Não deve dar erro se status for FINALIZADO")
    void naoDeveDarErroSeStatusFinalizado(){

        Solicitacao solicitacao = solicitacao(FINALIZADO);

        assertDoesNotThrow(() -> tested.porStatusEmAtendimentoOuFinalizado(solicitacao));
    }
}
