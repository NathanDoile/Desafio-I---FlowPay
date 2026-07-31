package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.CONFLICT;

@Service
@RequiredArgsConstructor
public class ValidaReferenciaConversaService {

    private final SolicitacaoRepository solicitacaoRepository;

    public void jaExiste(Long referenciaConversa) {

        if(solicitacaoRepository.existsByReferenciaConversa(referenciaConversa)){
            throw new ResponseStatusException(CONFLICT, "Já existe solicitação para essa conversa.");
        }

    }
}
