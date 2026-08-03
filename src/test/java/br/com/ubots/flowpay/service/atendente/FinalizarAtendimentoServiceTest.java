package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.service.validator.ValidaAtendimentoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.Categoria.CARTAO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.FINALIZADO;
import static br.com.ubots.flowpay.factory.AtendenteFactory.atendente;
import static br.com.ubots.flowpay.factory.EquipeFactory.equipe;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.solicitacao;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FinalizarAtendimentoServiceTest {

    @InjectMocks
    private FinalizarAtendimentoService tested;

    @Mock
    private ValidaAtendimentoService validaAtendimentoService;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Mock
    private AtendenteRepository atendenteRepository;

    @Mock
    private EncaminharDaFilaParaAtendente encaminharDaFilaParaAtendente;

    @Captor
    private ArgumentCaptor<Solicitacao> solicitacaoCaptor;

    @Captor
    private ArgumentCaptor<Atendente> atendenteCaptor;

    @Test
    @DisplayName("Deve finalizar o atendimento corretamente")
    void deveFinalizarAtendimentoCorretamente(){

        Long id = 1L;

        Solicitacao solicitacao = solicitacao(EM_ATENDIMENTO);
        Atendente atendente = atendente();
        Equipe equipe = equipe(CARTAO);

        solicitacao.setAtendente(atendente);
        atendente.setEquipe(equipe);

        when(solicitacaoRepository.findByIdAndStatusSolicitacao(id, EM_ATENDIMENTO)).thenReturn(solicitacao);

        tested.finalizar(id);

        verify(validaAtendimentoService).porIdEmAtendimento(id);
        verify(solicitacaoRepository).findByIdAndStatusSolicitacao(id, EM_ATENDIMENTO);
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());
        verify(atendenteRepository).save(atendenteCaptor.capture());
        verify(encaminharDaFilaParaAtendente).encaminharParaAtendente(equipe);

        Solicitacao solicitacaoResponse = solicitacaoCaptor.getValue();

        Atendente atendenteResponse = atendenteCaptor.getValue();

        assertEquals(FINALIZADO, solicitacaoResponse.getStatusSolicitacao());
        assertNull(solicitacaoResponse.getAtendente());
        assertFalse(atendenteResponse.isCheio());
    }

    @Test
    @DisplayName("Não deve finalizar o atendimento se atendimento inválido")
    void naoDeveFinalizarAtendimentoSeIdInvalido(){

        Long id = 1L;

        doThrow(ResponseStatusException.class).when(validaAtendimentoService).porIdEmAtendimento(id);

        assertThrows(ResponseStatusException.class, () -> tested.finalizar(id));

        verify(validaAtendimentoService).porIdEmAtendimento(id);
        verify(solicitacaoRepository, never()).findByIdAndStatusSolicitacao(any(Long.class), any(StatusSolicitacao.class));
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
        verify(atendenteRepository, never()).save(any(Atendente.class));
        verify(encaminharDaFilaParaAtendente, never()).encaminharParaAtendente(any(Equipe.class));
    }
}
