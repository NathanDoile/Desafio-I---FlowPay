package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Equipe;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Component
public class ValidaFilaDaEquipeValidator {

    public void possuiFila(Equipe equipe) {

        if(equipe.getFila().getSolicitacoes().isEmpty()){
            throw new ResponseStatusException(BAD_REQUEST, "Não há solicitações na fila para serem distribuídas.");
        }
    }
}
