package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.FINALIZADO;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ValidaAtendimentoService {

    private final SolicitacaoRepository solicitacaoRepository;

    public void porIdEmAtendimento(Long id) {

        if(!solicitacaoRepository.existsById(id)){
            throw new ResponseStatusException(NOT_FOUND, "Não existe atendimento em andamento com o ID informado.");
        }
    }

    public void porStatusEmAtendimentoOuFinalizado(Solicitacao solicitacao) {

        if(!solicitacao.getStatusSolicitacao().equals(EM_ATENDIMENTO) && !solicitacao.getStatusSolicitacao().equals(FINALIZADO)){
            throw new ResponseStatusException(NOT_FOUND, "Não existe atendimento em andamento com o ID informado.");
        }
    }
}
