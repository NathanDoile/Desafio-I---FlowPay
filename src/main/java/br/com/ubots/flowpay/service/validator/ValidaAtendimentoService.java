package br.com.ubots.flowpay.service.validator;

import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static br.com.ubots.flowpay.domain.enums.StatusSolicitacao.EM_ATENDIMENTO;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class ValidaAtendimentoService {

    private final SolicitacaoRepository solicitacaoRepository;

    public void porIdEmAtendimento(Long id) {

        if(!solicitacaoRepository.existsByIdAndStatusSolicitacao(id, EM_ATENDIMENTO)){
            throw new ResponseStatusException(NOT_FOUND, "Não existe atendimento em andamento com o ID informado.");
        }
    }
}
