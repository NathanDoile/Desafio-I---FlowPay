package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.TelaHomeResponse;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.helper.DateTimeNow;
import br.com.ubots.flowpay.repository.EquipeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.EMPRESTIMO;
import static br.com.ubots.flowpay.domain.enums.Categoria.*;
import static br.com.ubots.flowpay.factory.EquipeFactory.equipe;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.solicitacao;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TelaHomeServiceTest {

    @InjectMocks
    private TelaHomeService tested;

    @Mock
    private EquipeRepository equipeRepository;

    @Test
    @DisplayName("Deve retornar os dados da tela home")
    void deveRetornarDadosDaTelaHome() {

        List<Equipe> equipes = new ArrayList<>();

        Equipe equipeI = equipe(CARTAO);
        equipeI.getFila().getSolicitacoes().add(solicitacao(StatusSolicitacao.EM_ATENDIMENTO));
        equipeI.getFila().getSolicitacoes().add(solicitacao(StatusSolicitacao.FINALIZADO));
        equipeI.getFila().getSolicitacoes().add(Solicitacao
                .builder()
                .id(1L)
                .referenciaConversa(20260731000001L)
                .statusSolicitacao(StatusSolicitacao.FINALIZADO)
                .assunto(EMPRESTIMO.getDescricao())
                .dataHoraInicialSolicitacao(DateTimeNow.now().minusDays(1))
                .dataHoraInicialFila(DateTimeNow.now().minusSeconds(30))
                .dataHoraInicialAtendimento(DateTimeNow.now())
                .versao(0L)
                .build());
        equipeI.getFila().getSolicitacoes().add(Solicitacao
                .builder()
                .id(1L)
                .referenciaConversa(20260731000001L)
                .statusSolicitacao(StatusSolicitacao.FINALIZADO)
                .assunto(EMPRESTIMO.getDescricao())
                .dataHoraInicialSolicitacao(DateTimeNow.now().minusMonths(1))
                .dataHoraInicialFila(DateTimeNow.now().minusSeconds(30))
                .dataHoraInicialAtendimento(DateTimeNow.now())
                .versao(0L)
                .build());
        equipeI.getFila().getSolicitacoes().add(Solicitacao
                .builder()
                .id(1L)
                .referenciaConversa(20260731000001L)
                .statusSolicitacao(StatusSolicitacao.FINALIZADO)
                .assunto(EMPRESTIMO.getDescricao())
                .dataHoraInicialSolicitacao(DateTimeNow.now().minusYears(1))
                .dataHoraInicialFila(DateTimeNow.now().minusSeconds(30))
                .dataHoraInicialAtendimento(DateTimeNow.now())
                .versao(0L)
                .build());
        Equipe equipeII = equipe(Categoria.EMPRESTIMO);
        Equipe equipeIII = equipe(OUTROS_ASSUNTOS);

        equipes.add(equipeI);
        equipes.add(equipeII);
        equipes.add(equipeIII);

        when(equipeRepository.findAll()).thenReturn(equipes);

        TelaHomeResponse response = tested.gerarHome();

        verify(equipeRepository).findAll();

        assertEquals(0L, response.getTotalTickets());
        assertEquals(0L, response.getQuantidadeAtendentes());
        assertEquals(3L, response.getQuantidadeEquipes());

        response.getEquipes().forEach(homeEquipeResponse -> {
            assertNotNull(homeEquipeResponse.getId());
            assertNotNull(homeEquipeResponse.getNome());

            assertEquals(0L, homeEquipeResponse.getQuantidadeTicketsEmFila());

            assertEquals(0L, homeEquipeResponse.getQuantidadeAtendentes());

            if(homeEquipeResponse.getNome().equals(Categoria.CARTAO.getDescricao())){
                assertTrue(homeEquipeResponse.getMediaTempoEsperaEmSegundos() >= 30);
            }
            else{
                assertEquals(0, homeEquipeResponse.getMediaTempoEsperaEmSegundos());
            }
        });
    }
}
