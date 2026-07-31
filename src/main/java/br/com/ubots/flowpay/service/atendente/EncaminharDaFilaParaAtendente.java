package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import br.com.ubots.flowpay.validator.ValidaFilaDaEquipeValidator;
import br.com.ubots.flowpay.validator.ValidaStatusSolicitacaoValidator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class EncaminharDaFilaParaAtendente {

    private final ValidaFilaDaEquipeValidator validaFilaDaEquipeValidator;

    private final ValidaStatusSolicitacaoValidator validaStatusSolicitacaoValidator;

    private final EquipeRepository equipeRepository;

    private final SolicitacaoRepository solicitacaoRepository;

    private final AtendenteRepository atendenteRepository;

    @Transactional
    public void encaminharParaAtendente(Equipe equipe){

        validaFilaDaEquipeValidator.possuiFila(equipe);

        Solicitacao solicitacao = equipe.getFila().getSolicitacoes().getFirst();

        validaStatusSolicitacaoValidator.emFila(solicitacao);

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
            solicitacao.setFila(null);

            atendenteLivre.getSolicitacoes().add(solicitacao);
            atendenteLivre.setCheio(atendenteLivre.getSolicitacoes().size() == 3);

            equipeRepository.save(equipe);
            solicitacaoRepository.save(solicitacao);
            atendenteRepository.save(atendenteLivre);
        }
    }
}
