package br.com.ubots.flowpay.validator;

import br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.deTexto;
import static java.util.Objects.isNull;
import static org.springframework.http.HttpStatus.BAD_REQUEST;

@Component
public class ValidaAssuntoSolicitacaoValidator {


    public void assuntoValido(String assunto) {

        AssuntoSolicitacao assuntoSolicitacao = deTexto(assunto);

        if(isNull(assuntoSolicitacao)){
          throw new ResponseStatusException(BAD_REQUEST, "A solicitação deve ser de um dos três tipos: 'Problemas com cartao', " +
                  "'Contratacao de emprestimo' e 'Outros assuntos'.");
        }
    }
}
