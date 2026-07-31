package br.com.ubots.flowpay.service.fila;

import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.factory.EquipeFactory;
import br.com.ubots.flowpay.factory.FilaFactory;
import br.com.ubots.flowpay.factory.SolicitacaoFactory;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.FilaRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.validator.ValidaOcupacaoFilaValidator;
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

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.deTexto;
import static br.com.ubots.flowpay.domain.enums.Categoria.OUTROS_ASSUNTOS;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EncaminharSolicitacaoParaFilaServiceTest {

    @InjectMocks
    private EncaminharSolicitacaoParaFilaService tested;

    @Mock
    private ValidaStatusSolicitacaoValidator validaStatusSolicitacaoValidator;

    @Mock
    private ValidaOcupacaoFilaValidator validaOcupacaoFilaValidator;

    @Mock
    private EquipeRepository equipeRepository;

    @Mock
    private FilaRepository filaRepository;

    @Mock
    private SolicitacaoRepository solicitacaoRepository;

    @Captor
    private ArgumentCaptor<Solicitacao> solicitacaoCaptor;

    @Captor
    private ArgumentCaptor<Fila> filaCaptor;

    @Test
    @DisplayName("Deve ser encaminhado a solicitacao para a fila")
    void deveEncaminharSolicitacaoParaFila(){

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(SOLICITADO);

        AssuntoSolicitacao assuntoSolicitacao = deTexto(solicitacao.getAssunto());
        Categoria time = Categoria.valueOf(assuntoSolicitacao.toString());

        Equipe equipe = EquipeFactory.equipe(time);

        when(equipeRepository.findByCategoria(time.getDescricao())).thenReturn(equipe);

        tested.encaminharParaFila(solicitacao);

        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(validaOcupacaoFilaValidator).filaCheia(equipe.getFila());
        verify(equipeRepository).findByCategoria(time.getDescricao());
        verify(filaRepository).save(filaCaptor.capture());
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());

        Fila filaResponse = filaCaptor.getValue();
        Solicitacao solicitacaoResponse = solicitacaoCaptor.getValue();

        assertEquals(EM_FILA, solicitacaoResponse.getStatusSolicitacao());
        assertEquals(equipe.getFila().getId(), solicitacaoResponse.getFila().getId());
        assertEquals(solicitacao, filaResponse.getSolicitacoes().get(0));
        assertFalse(filaResponse.isCheia());
    }

    @Test
    @DisplayName("Deve ser encaminhado a solicitacao para a fila e ficar cheia")
    void deveEncaminharSolicitacaoParaFilaEFicarCheia(){

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(SOLICITADO);

        solicitacao.setAssunto("Inválido");

        Categoria time = OUTROS_ASSUNTOS;

        Equipe equipe = EquipeFactory.equipe(time);

        Fila fila = FilaFactory.fila();
        fila.getSolicitacoes().add(Solicitacao.builder().build());
        fila.getSolicitacoes().add(Solicitacao.builder().build());

        equipe.setFila(fila);

        when(equipeRepository.findByCategoria(time.getDescricao())).thenReturn(equipe);

        tested.encaminharParaFila(solicitacao);

        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(validaOcupacaoFilaValidator).filaCheia(equipe.getFila());
        verify(equipeRepository).findByCategoria(time.getDescricao());
        verify(filaRepository).save(filaCaptor.capture());
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());

        Fila filaResponse = filaCaptor.getValue();
        Solicitacao solicitacaoResponse = solicitacaoCaptor.getValue();

        assertEquals(EM_FILA, solicitacaoResponse.getStatusSolicitacao());
        assertEquals(equipe.getFila().getId(), solicitacaoResponse.getFila().getId());
        assertEquals(solicitacao, filaResponse.getSolicitacoes().get(2));
        assertTrue(filaResponse.isCheia());
    }

    @Test
    @DisplayName("Não deve encaminhar para a fila se status da solicitacao for diferente de SOLICITADO")
    void naoDeveEncaminharParaFilaSeStatusDiferenteSolicitado(){

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(SOLICITADO);

        doThrow(ResponseStatusException.class).when(validaStatusSolicitacaoValidator).emFila(solicitacao);

        assertThrows(ResponseStatusException.class, () -> tested.encaminharParaFila(solicitacao));

        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(validaOcupacaoFilaValidator, never()).filaCheia(any(Fila.class));
        verify(equipeRepository, never()).findByCategoria(any(String.class));
        verify(filaRepository, never()).save(any(Fila.class));
        verify(solicitacaoRepository, never()).save(any(Solicitacao.class));
    }

    @Test
    @DisplayName("Não deve encaminhar para a fila se fila estiver cheia")
    void naoDeveEncaminharParaFilaSeFilaCheia(){

        Solicitacao solicitacao = SolicitacaoFactory.solicitacao(SOLICITADO);

        AssuntoSolicitacao assuntoSolicitacao = deTexto(solicitacao.getAssunto());
        Categoria time = Categoria.valueOf(assuntoSolicitacao.toString());

        Equipe equipe = EquipeFactory.equipe(time);

        Fila fila = FilaFactory.fila();
        fila.setCheia(true);

        equipe.setFila(fila);

        when(equipeRepository.findByCategoria(time.getDescricao())).thenReturn(equipe);
        doThrow(ResponseStatusException.class).when(validaOcupacaoFilaValidator).filaCheia(equipe.getFila());

        assertThrows(ResponseStatusException.class, () -> tested.encaminharParaFila(solicitacao));

        verify(validaStatusSolicitacaoValidator).emFila(solicitacao);
        verify(equipeRepository).findByCategoria(time.getDescricao());
        verify(validaOcupacaoFilaValidator).filaCheia(equipe.getFila());
        verify(solicitacaoRepository).save(solicitacaoCaptor.capture());
        verify(filaRepository, never()).save(any(Fila.class));

        Solicitacao response = solicitacaoCaptor.getValue();

        assertEquals(RECUSADO_POR_FILA_ESPERA_CHEIA, response.getStatusSolicitacao());
        assertNull(response.getFila());
    }
}
