package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.service.validator.ValidaAtendimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.stereotype.Service;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.FINALIZADO;
import static br.com.ubots.flowpay.helper.DateTimeNow.now;

@Service
@RequiredArgsConstructor
public class FinalizarAtendimentoService {

    private final ValidaAtendimentoService validaAtendimentoService;

    private final SolicitacaoRepository solicitacaoRepository;

    private final AtendenteRepository atendenteRepository;

    private final EncaminharDaFilaParaAtendente encaminharDaFilaParaAtendente;

    @Retryable(
            includes = ObjectOptimisticLockingFailureException.class,
            maxRetries = 3,
            delay = 200,
            multiplier = 2.0
    )
    public void finalizar(Long id) {

        validaAtendimentoService.porIdEmAtendimento(id);

        Solicitacao solicitacao = solicitacaoRepository.findByIdAndStatusSolicitacao(id, EM_ATENDIMENTO);

        Atendente atendente = solicitacao.getAtendente();

        solicitacao.setStatusSolicitacao(FINALIZADO);
        solicitacao.setDataHoraFinalAtendimento(now());

        atendente.setCheio(false);

        solicitacaoRepository.save(solicitacao);
        atendenteRepository.save(atendente);

        encaminharDaFilaParaAtendente.encaminharParaAtendente(atendente.getEquipe());
    }
}
