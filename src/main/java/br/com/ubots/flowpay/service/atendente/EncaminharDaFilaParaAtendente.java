package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.validator.ValidaStatusSolicitacaoValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.resilience.annotation.Retryable;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_FILA;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class EncaminharDaFilaParaAtendente {

    private final EquipeRepository equipeRepository;

    private final SolicitacaoRepository solicitacaoRepository;

    private final AtendenteRepository atendenteRepository;

    @Retryable(
            includes = ObjectOptimisticLockingFailureException.class,
            maxRetries = 3,
            delay = 200,
            multiplier = 2.0
    )
    @Transactional
    public void encaminharParaAtendente(Equipe equipe){

        List<Solicitacao> solicitacoes = equipe.getFila().getSolicitacoes()
                .stream()
                .filter(solicitacao1 -> solicitacao1.getStatusSolicitacao().equals(EM_FILA))
                .toList();

        if(!solicitacoes.isEmpty()){

            Solicitacao solicitacao = solicitacoes.getFirst();

            List<Atendente> atendentes = equipe.getAtendentes();

            Atendente atendenteLivre = atendentes
                    .stream()
                    .filter(atendente -> !atendente.isCheio())
                    .findFirst().orElse(null);

            if(!isNull(atendenteLivre)){

                equipe.getFila().getSolicitacoes().remove(solicitacao);
                equipe.getFila().setCheia(false);

                solicitacao.setStatusSolicitacao(EM_ATENDIMENTO);
                solicitacao.setAtendente(atendenteLivre);

                atendenteLivre.getSolicitacoes().add(solicitacao);
                atendenteLivre.setCheio(atendenteLivre.getSolicitacoes()
                        .stream()
                        .filter(solicitacao1 -> solicitacao1.getStatusSolicitacao().equals(EM_ATENDIMENTO))
                        .toList()
                        .size() == 3);

                equipeRepository.save(equipe);
                solicitacaoRepository.save(solicitacao);
                atendenteRepository.save(atendenteLivre);
            }
        }
    }
}
