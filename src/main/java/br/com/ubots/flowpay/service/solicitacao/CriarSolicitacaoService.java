package br.com.ubots.flowpay.service.solicitacao;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.service.fila.EncaminharSolicitacaoParaFilaService;
import br.com.ubots.flowpay.service.validator.ValidaReferenciaConversaService;
import br.com.ubots.flowpay.validator.ValidaAssuntoSolicitacaoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.stereotype.Service;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.SOLICITADO;
import static br.com.ubots.flowpay.mapper.SolicitacaoMapper.toEntity;

@Service
@RequiredArgsConstructor
public class CriarSolicitacaoService {

    private final ValidaReferenciaConversaService validaReferenciaConversaService;

    private final ValidaAssuntoSolicitacaoValidator validaAssuntoSolicitacaoValidator;

    private final SolicitacaoRepository solicitacaoRepository;

    private final EncaminharSolicitacaoParaFilaService encaminharSolicitacaoParaFilaService;

    @Retryable(
            includes = ObjectOptimisticLockingFailureException.class,
            maxRetries = 3,
            delay = 200,
            multiplier = 2.0
    )
    public void criar(CriarSolicitacaoRequest request) {

        validaReferenciaConversaService.jaExiste(request.getReferenciaConversa());
        validaAssuntoSolicitacaoValidator.assuntoValido(request.getAssunto());

        Solicitacao solicitacao = toEntity(request);
        solicitacao.setStatusSolicitacao(SOLICITADO);

        solicitacaoRepository.save(solicitacao);

        encaminharSolicitacaoParaFilaService.encaminharParaFila(solicitacao);
    }
}
