package br.com.ubots.flowpay.service.fila;

import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao;
import br.com.ubots.flowpay.domain.enums.Categoria;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.FilaRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.service.atendente.EncaminharDaFilaParaAtendente;
import br.com.ubots.flowpay.validator.ValidaOcupacaoFilaValidator;
import br.com.ubots.flowpay.validator.ValidaStatusSolicitacaoValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.AssuntoSolicitacao.deTexto;
import static br.com.ubots.flowpay.domain.enums.Categoria.OUTROS_ASSUNTOS;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.RECUSADO_POR_FILA_ESPERA_CHEIA;

@Service
@RequiredArgsConstructor
public class EncaminharSolicitacaoParaFilaService {

    private final ValidaStatusSolicitacaoValidator validaStatusSolicitacaoValidator;

    private final ValidaOcupacaoFilaValidator validaOcupacaoFilaValidator;

    private final EquipeRepository equipeRepository;

    private final FilaRepository filaRepository;

    private final SolicitacaoRepository solicitacaoRepository;

    private final EncaminharDaFilaParaAtendente encaminharDaFilaParaAtendente;

    @Retryable(
            includes = ObjectOptimisticLockingFailureException.class,
            maxRetries = 3,
            delay = 200,
            multiplier = 2.0
    )
    public void encaminharParaFila(Solicitacao solicitacao){

        validaStatusSolicitacaoValidator.emSolicitacao(solicitacao);

        AssuntoSolicitacao assuntoSolicitacao = deTexto(solicitacao.getAssunto());

        Categoria time = Categoria.valueOf(assuntoSolicitacao.toString());

        Equipe equipe = equipeRepository.findByCategoria(time.getDescricao());

        Fila fila = equipe.getFila();

        try{

            validaOcupacaoFilaValidator.filaCheia(fila);

        }catch (ResponseStatusException exception){

            solicitacao.setStatusSolicitacao(RECUSADO_POR_FILA_ESPERA_CHEIA);

            solicitacaoRepository.save(solicitacao);

            throw exception;
        }

        solicitacao.setStatusSolicitacao(EM_FILA);
        solicitacao.setFila(fila);
        fila.getSolicitacoes().add(solicitacao);

        if(fila.getSolicitacoes()
                .stream()
                .filter(solicitacao1 -> solicitacao1.getStatusSolicitacao().equals(EM_FILA))
                .toList()
                .size() == 3){

            fila.setCheia(true);
        }

        solicitacaoRepository.save(solicitacao);
        filaRepository.save(fila);

        encaminharDaFilaParaAtendente.encaminharParaAtendente(equipe);
    }
}
