package br.com.ubots.flowpay.service.atendente;

import br.com.ubots.flowpay.domain.Atendente;
import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import br.com.ubots.flowpay.repository.AtendenteRepository;
import br.com.ubots.flowpay.repository.EquipeRepository;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
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

    private final ValidaStatusSolicitacaoValidator validaStatusSolicitacaoValidator;

    private final EquipeRepository equipeRepository;

    private final SolicitacaoRepository solicitacaoRepository;

    private final AtendenteRepository atendenteRepository;

    @Transactional
    public void encaminharParaAtendente(Equipe equipe){

        Solicitacao solicitacao = equipe.getFila().getSolicitacoes().getFirst();

        validaStatusSolicitacaoValidator.emAtendimento(solicitacao);

        List<Atendente> atendentes = equipe.getAtendentes();

        Atendente atendenteLivre = atendentes
                .stream()
                .filter(atendente -> atendente.getSolicitacoes().size() < 3)
                .findFirst().orElse(null);

        if(!isNull(atendenteLivre)){

            equipe.getFila().getSolicitacoes().remove(solicitacao);

            solicitacao.setStatusSolicitacao(EM_ATENDIMENTO);
            solicitacao.setAtendente(atendenteLivre);

            atendenteLivre.getSolicitacoes().add(solicitacao);

            equipeRepository.save(equipe);
            solicitacaoRepository.save(solicitacao);
            atendenteRepository.save(atendenteLivre);
        }
    }
}
