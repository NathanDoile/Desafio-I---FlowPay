package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
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

        when(solicitacaoRepository.existsByIdAndStatusSolicitacao(id, EM_ATENDIMENTO)).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class, () -> tested.porIdEmAtendimento(id));

        verify(solicitacaoRepository).existsByIdAndStatusSolicitacao(id, EM_ATENDIMENTO);

        assertEquals(NOT_FOUND, exception.getStatusCode());
        assertEquals("Não existe atendimento em andamento com o ID informado.", exception.getReason());
    }

    @Test
    @DisplayName("Não deve dar erro se id da solicitação correto")
    void naoDeveDarErroSeIdValido(){

        Long id = 1L;

        when(solicitacaoRepository.existsByIdAndStatusSolicitacao(id, EM_ATENDIMENTO)).thenReturn(true);

        assertDoesNotThrow(() -> tested.porIdEmAtendimento(id));
    }
}
