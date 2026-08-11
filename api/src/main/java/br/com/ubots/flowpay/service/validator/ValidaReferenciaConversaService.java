package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.RECUSADO_POR_FILA_ESPERA_CHEIA;
import static org.springframework.http.HttpStatus.CONFLICT;

@Service
@RequiredArgsConstructor
public class ValidaReferenciaConversaService {

    private final SolicitacaoRepository solicitacaoRepository;

    public void jaExiste(Long referenciaConversa) {

        if(solicitacaoRepository.existsByReferenciaConversaAndStatusSolicitacaoNot(referenciaConversa, RECUSADO_POR_FILA_ESPERA_CHEIA)){
            throw new ResponseStatusException(CONFLICT, "Já existe solicitação para essa conversa.");
        }

    }
}
