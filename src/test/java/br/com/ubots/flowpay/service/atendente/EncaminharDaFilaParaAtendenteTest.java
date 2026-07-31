package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.factory.SolicitacaoFactory;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.validator.ValidaFilaDaEquipeValidator;
import br.com.ubots.flowpay.validator.ValidaStatusSolicitacaoValidator;
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
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.factory.AtendenteFactory.atendente;
import static br.com.ubots.flowpay.factory.EquipeFactory.equipe;
import static br.com.ubots.flowpay.factory.FilaFactory.fila;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EncaminharDaFilaParaAtendenteTest {

    @InjectMocks
    private EncaminharDaFilaParaAtendente tested;

    @Mock
    private ValidaFilaDaEquipeValidator validaFilaDaEquipeValidator;

    @Mock
    private ValidaStatusSolicitacaoValidator validaStatusSolicitacaoValidator;

    @Mock
    private EquipeRepository equipeRepository;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Mock
    private AtendenteRepository atendenteRepository;

    @Captor
    private ArgumentCaptor<Equipe> equipeCaptor;

    @Captor
    private ArgumentCaptor<Solicitacao> solicitacaoCaptor;

    @Captor
    private ArgumentCaptor<Atendente> atendenteCaptor;

    @Test
    @DisplayName("Deve encaminhar uma solicitação para um atendente")
    void deveEncaminharSolicitacaoParaAtendente(){

        Equipe equipe = equipe(CARTAO);

        Fila fila = fila();

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(EM_FILA);
        solicitacao.setFila(fila);

        fila.getSolicitacoes().add(solicitacao);

        Atendente atendente = atendente();

        equipe.setFila(fila);
        equipe.getAtendentes().add(atendente);

        tested.encaminharParaAtendente(equipe);

        verify(validaFilaDaEquipeValidator).possuiFila(equipe);
        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(equipeRepository).save(equipeCaptor.capture());
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());
        verify(atendenteRepository).save(atendenteCaptor.capture());

        Equipe equipeResponse = equipeCaptor.getValue();
        Solicitacao solicitacaoResponse = solicitacaoCaptor.getValue();
        Atendente atendenteResponse = atendenteCaptor.getValue();

        assertFalse(equipeResponse.getFila().getSolicitacoes().contains(solicitacao));
        assertFalse(equipeResponse.getFila().isCheia());
        assertEquals(EM_ATENDIMENTO, solicitacaoResponse.getStatusSolicitacao());
        assertEquals(atendente, solicitacaoResponse.getAtendente());
        assertNull(solicitacaoResponse.getFila());
        assertTrue(atendenteResponse.getSolicitacoes().contains(solicitacao));
        assertFalse(atendenteResponse.isCheio());
    }

    @Test
    @DisplayName("Não deve encaminhar solicitação se não houver nenhuma na fila da equipe")
    void naoDeveEncaminharSolicitacaoSeNaoHouverNenhumaNaFila(){

        Equipe equipe = equipe(CARTAO);

        doThrow(ResponseStatusException.class).when(validaFilaDaEquipeValidator).possuiFila(equipe);

        assertThrows(ResponseStatusException.class, () -> tested.encaminharParaAtendente(equipe));

        verify(validaFilaDaEquipeValidator).possuiFila(equipe);
        verify(validaStatusSolicitacaoValidator, never()).emFila(any(Solicitacao.class));
        verify(equipeRepository, never()).save(any(Equipe.class));
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
        verify(atendenteRepository, never()).save(any(Atendente.class));
    }

    @Test
    @DisplayName("Não deve encaminhar solicitação se status da solicitação não estiver EM_FILA")
    void naoDeveEncaminharSolicitacaoSeStatusNãoEmFila(){

        Equipe equipe = equipe(CARTAO);

        Fila fila = fila();

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(SOLICITADO);
        solicitacao.setFila(fila);

        fila.getSolicitacoes().add(solicitacao);

        equipe.setFila(fila);

        doThrow(ResponseStatusException.class).when(validaStatusSolicitacaoValidator).emFila(solicitacao);

        assertThrows(ResponseStatusException.class, () -> tested.encaminharParaAtendente(equipe));

        verify(validaFilaDaEquipeValidator).possuiFila(equipe);
        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(equipeRepository, never()).save(any(Equipe.class));
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
        verify(atendenteRepository, never()).save(any(Atendente.class));
    }

    @Test
    @DisplayName("Não deve encaminhar uma solicitação para um atendente se não tiver atendentes disponíveis")
    void naoDeveEncaminharSolicitacaoParaAtendenteSeNaoDisponiveis(){

        Equipe equipe = equipe(CARTAO);

        Fila fila = fila();

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(EM_FILA);
        solicitacao.setFila(fila);

        fila.getSolicitacoes().add(solicitacao);

        Atendente atendente = atendente();
        atendente.setCheio(true);

        equipe.setFila(fila);
        equipe.getAtendentes().add(atendente);

        tested.encaminharParaAtendente(equipe);

        verify(validaFilaDaEquipeValidator).possuiFila(equipe);
        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(equipeRepository, never()).save(any(Equipe.class));
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
        verify(atendenteRepository, never()).save(any(Atendente.class));
    }
}
