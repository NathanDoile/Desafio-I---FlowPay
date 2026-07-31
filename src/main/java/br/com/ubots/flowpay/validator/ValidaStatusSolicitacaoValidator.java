package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Solicitacao;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.SOLICITADO;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Component
public class ValidaStatusSolicitacaoValidator {


    public void emFila(Solicitacao solicitacao) {

        if (!solicitacao.getStatusSolicitacao().equals(EM_FILA)) {
            throw new ResponseStatusException(BAD_REQUEST, "A solicitação não está na fila para distribuição.");
        }
    }

    public void emSolicitacao(Solicitacao solicitacao) {

        if(!solicitacao.getStatusSolicitacao().equals(SOLICITADO)){
            throw new ResponseStatusException(BAD_REQUEST, "Solicitação não está aguardando para entrar em uma fila, " +
                    "verifique os andamentos dessa solicitação.");

        }
    }
}
