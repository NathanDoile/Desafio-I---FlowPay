package br.com.ubots.flowpay.service.solicitacao;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.RECUSADO_POR_FILA_ESPERA_CHEIA;

@Service
@RequiredArgsConstructor
public class SalvarSolicitacaoRecusadaService {

    private final SolicitacaoRepository solicitacaoRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void salvar(Solicitacao solicitacao) {
        solicitacao.setStatusSolicitacao(RECUSADO_POR_FILA_ESPERA_CHEIA);
        solicitacaoRepository.save(solicitacao);
    }
}
