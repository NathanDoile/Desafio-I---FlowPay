package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.controller.response.DetalheAtendentesResponse;
import br.com.ubots.flowpay.controller.response.DetalheFilaEsperaResponse;
import br.com.ubots.flowpay.controller.response.TelaDetalheResponse;
import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.helper.DateTimeNow;
import br.com.ubots.flowpay.repository.EquipeRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.ZonedDateTime;
import java.util.List;

import static br.com.ubots.flowpay.domain.enums.Categoria.CARTAO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.*;
import static br.com.ubots.flowpay.factory.AtendenteFactory.atendente;
import static br.com.ubots.flowpay.factory.EquipeFactory.equipe;
import static br.com.ubots.flowpay.factory.SolicitacaoFactory.solicitacao;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TelaDetalheServiceTest {

    @InjectMocks
    private TelaDetalheService tested;

    @Mock
    private EquipeRepository equipeRepository;

    @Test
    @DisplayName("Deve retornar os dados da tela detalhe")
    void deveRetornarDadosDaTelaDetalhe() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        Solicitacao solicitacaoEmFila = solicitacao(EM_FILA);
        solicitacaoEmFila.setDataHoraInicialFila(DateTimeNow.now().minusSeconds(30));
        equipe.getFila().getSolicitacoes().add(solicitacaoEmFila);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        verify(equipeRepository).findByCategoria(CARTAO.getDescricao());

        assertEquals(1L, response.getQuantidadeAtendentes());
        assertEquals(0L, response.getQuantidadeAtendimentosConcluidos());
        assertEquals(0L, response.getTempoMedioAtendimento());
        assertEquals(0L, response.getTempoMedioEspera());
        assertEquals(0L, response.getQuantidadeAtendimentosEmAndamento());
        assertEquals(0L, response.getQuantidadeAtendimentosCancelados());
        assertNull(response.getDataHoraUltimoCancelamento());
        assertEquals(3L, response.getCapacidadeFila());
        assertNotNull(response.getFila());
        assertNotNull(response.getAtendentes());
    }

    @Test
    @DisplayName("Deve calcular tempo medio de atendimento corretamente")
    void deveCalcularTempoMedioAtendimentoCorretamente() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        ZonedDateTime agora = DateTimeNow.now();

        Solicitacao solicitacaoFinalizada1 = solicitacao(FINALIZADO);
        solicitacaoFinalizada1.setDataHoraInicialAtendimento(agora.minusSeconds(100));
        solicitacaoFinalizada1.setDataHoraFinalAtendimento(agora.minusSeconds(50));

        Solicitacao solicitacaoFinalizada2 = solicitacao(FINALIZADO);
        solicitacaoFinalizada2.setDataHoraInicialAtendimento(agora.minusSeconds(80));
        solicitacaoFinalizada2.setDataHoraFinalAtendimento(agora.minusSeconds(40));

        Solicitacao solicitacaoFinalizada3 = solicitacao(FINALIZADO);
        solicitacaoFinalizada3.setDataHoraInicialAtendimento(agora.minusSeconds(80));
        solicitacaoFinalizada3.setDataHoraFinalAtendimento(null);

        Solicitacao solicitacaoFinalizada4 = solicitacao(FINALIZADO);
        solicitacaoFinalizada4.setDataHoraInicialAtendimento(agora.minusSeconds(80));
        solicitacaoFinalizada4.setDataHoraFinalAtendimento(agora.minusDays(1));

        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada1);
        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada2);
        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada3);
        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada4);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertEquals(2L, response.getQuantidadeAtendimentosConcluidos());
        assertEquals(45L, response.getTempoMedioAtendimento());
    }

    @Test
    @DisplayName("Deve calcular tempo medio de espera corretamente")
    void deveCalcularTempoMedioEsperaCorretamente() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        ZonedDateTime agora = DateTimeNow.now();

        Solicitacao solicitacaoFinalizada1 = solicitacao(FINALIZADO);
        solicitacaoFinalizada1.setDataHoraInicialSolicitacao(agora.minusSeconds(150));
        solicitacaoFinalizada1.setDataHoraInicialFila(agora.minusSeconds(120));
        solicitacaoFinalizada1.setDataHoraInicialAtendimento(agora.minusSeconds(90));
        solicitacaoFinalizada1.setDataHoraFinalAtendimento(agora.minusSeconds(60));

        Solicitacao solicitacaoFinalizada2 = solicitacao(FINALIZADO);
        solicitacaoFinalizada2.setDataHoraInicialSolicitacao(agora.minusSeconds(150));
        solicitacaoFinalizada2.setDataHoraInicialFila(agora.minusSeconds(100));
        solicitacaoFinalizada2.setDataHoraInicialAtendimento(agora.minusSeconds(70));
        solicitacaoFinalizada2.setDataHoraFinalAtendimento(agora.minusSeconds(60));

        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada1);
        equipe.getFila().getSolicitacoes().add(solicitacaoFinalizada2);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertEquals(30L, response.getTempoMedioEspera());
    }

    @Test
    @DisplayName("Deve contar atendimentos em andamento")
    void deveContarAtendimentosEmAndamento() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        ZonedDateTime agora = DateTimeNow.now();

        Solicitacao solicitacaoEmAtendimento1 = solicitacao(EM_ATENDIMENTO);
        solicitacaoEmAtendimento1.setDataHoraInicialFila(agora.minusSeconds(60));
        solicitacaoEmAtendimento1.setDataHoraInicialAtendimento(agora.minusSeconds(30));

        Solicitacao solicitacaoEmAtendimento2 = solicitacao(EM_ATENDIMENTO);
        solicitacaoEmAtendimento2.setDataHoraInicialFila(agora.minusSeconds(50));
        solicitacaoEmAtendimento2.setDataHoraInicialAtendimento(agora.minusSeconds(20));

        equipe.getFila().getSolicitacoes().add(solicitacaoEmAtendimento1);
        equipe.getFila().getSolicitacoes().add(solicitacaoEmAtendimento2);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertEquals(2L, response.getQuantidadeAtendimentosEmAndamento());
    }

    @Test
    @DisplayName("Deve contar atendimentos cancelados")
    void deveContarAtendimentosCancelados() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        ZonedDateTime agora = DateTimeNow.now();

        Solicitacao solicitacaoRecusada1 = solicitacao(RECUSADO_POR_FILA_ESPERA_CHEIA);
        solicitacaoRecusada1.setDataHoraInicialSolicitacao(agora.minusSeconds(100));

        Solicitacao solicitacaoRecusada2 = solicitacao(RECUSADO_POR_FILA_ESPERA_CHEIA);
        solicitacaoRecusada2.setDataHoraInicialSolicitacao(agora.minusSeconds(50));

        equipe.getFila().getSolicitacoes().add(solicitacaoRecusada1);
        equipe.getFila().getSolicitacoes().add(solicitacaoRecusada2);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertEquals(2L, response.getQuantidadeAtendimentosCancelados());
        assertNotNull(response.getDataHoraUltimoCancelamento());
    }

    @Test
    @DisplayName("Deve retornar fila de espera corretamente")
    void deveRetornarFilaEsperaCorretamente() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        Solicitacao solicitacaoEmFila1 = solicitacao(EM_FILA);
        solicitacaoEmFila1.setDataHoraInicialFila(DateTimeNow.now().minusSeconds(60));
        solicitacaoEmFila1.setAssunto("Assunto 1");
        solicitacaoEmFila1.setReferenciaConversa(123L);

        Solicitacao solicitacaoEmFila2 = solicitacao(EM_FILA);
        solicitacaoEmFila2.setDataHoraInicialFila(DateTimeNow.now().minusSeconds(30));
        solicitacaoEmFila2.setAssunto("Assunto 2");
        solicitacaoEmFila2.setReferenciaConversa(456L);

        equipe.getFila().getSolicitacoes().add(solicitacaoEmFila1);
        equipe.getFila().getSolicitacoes().add(solicitacaoEmFila2);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        List<DetalheFilaEsperaResponse> fila = response.getFila();
        assertEquals(2, fila.size());
        assertTrue(fila.stream().anyMatch(f -> f.getAssunto().equals("Assunto 1")));
        assertTrue(fila.stream().anyMatch(f -> f.getAssunto().equals("Assunto 2")));
    }

    @Test
    @DisplayName("Deve retornar dados dos atendentes corretamente")
    void deveRetornarDadosAtendentesCorretamente() {

        Equipe equipe = equipe(CARTAO);

        ZonedDateTime agora = DateTimeNow.now();

        Atendente atendente1 = atendente();
        atendente1.setNomeDeUsuario("Atendente 1");

        Solicitacao solicitacaoFinalizada1 = solicitacao(FINALIZADO);
        solicitacaoFinalizada1.setDataHoraInicialAtendimento(agora.minusSeconds(100));
        solicitacaoFinalizada1.setDataHoraFinalAtendimento(agora.minusSeconds(50));
        solicitacaoFinalizada1.setAtendente(atendente1);

        atendente1.getSolicitacoes().add(solicitacaoFinalizada1);

        Atendente atendente2 = atendente();
        atendente2.setNomeDeUsuario("Atendente 2");

        equipe.getAtendentes().add(atendente1);
        equipe.getAtendentes().add(atendente2);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        List<DetalheAtendentesResponse> atendentes = response.getAtendentes();
        assertEquals(2, atendentes.size());
        assertTrue(atendentes.stream().anyMatch(a -> a.getNome().equals("Atendente 1")));
        assertTrue(atendentes.stream().anyMatch(a -> a.getNome().equals("Atendente 2")));

        DetalheAtendentesResponse atendente1Response = atendentes.stream()
                .filter(a -> a.getNome().equals("Atendente 1"))
                .findFirst()
                .orElse(null);

        assertNotNull(atendente1Response);
        assertEquals(1L, atendente1Response.getQuantidadeAtendimentosConcluidos());
        assertEquals(50L, atendente1Response.getTempoMedioAtendimento());
    }

    @Test
    @DisplayName("Deve retornar zero quando não houver solicitacoes finalizadas")
    void deveRetornarZeroQuandoNaoHouverSolicitacoesFinalizadas() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertEquals(0L, response.getQuantidadeAtendimentosConcluidos());
        assertEquals(0L, response.getTempoMedioAtendimento());
        assertEquals(0L, response.getTempoMedioEspera());
    }

    @Test
    @DisplayName("Deve retornar null para dataHoraUltimoCancelamento quando não houver cancelamentos")
    void deveRetornarNullParaDataHoraUltimoCancelamentoQuandoNaoHouverCancelamentos() {

        Equipe equipe = equipe(CARTAO);
        Atendente atendente = atendente();
        equipe.getAtendentes().add(atendente);

        when(equipeRepository.findByCategoria(CARTAO.getDescricao())).thenReturn(equipe);

        TelaDetalheResponse response = tested.gerarDetalhe(CARTAO.getDescricao());

        assertNull(response.getDataHoraUltimoCancelamento());
    }
}
