package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.Fila;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

@Component
public class ValidaOcupacaoFilaValidator {

    public void filaCheia(Fila fila) {

        if(fila.isCheia()){
            throw new ResponseStatusException(SERVICE_UNAVAILABLE, "Fila se solicitações cheia, tente novamente mais tarde.");
        }
    }
}
