package br.com.ubots.flowpay.repository;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.ZonedDateTime;
import java.util.List;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    boolean existsByReferenciaConversaAndStatusSolicitacaoNot(Long referenciaConversa, StatusSolicitacao statusSolicitacao);

    boolean existsByIdAndStatusSolicitacao(Long id, StatusSolicitacao statusSolicitacao);

    Solicitacao findByIdAndStatusSolicitacao(Long id, StatusSolicitacao statusSolicitacao);

    List<Solicitacao> findAllByDataHoraInicialSolicitacaoBetween(ZonedDateTime primeiroDoMes, ZonedDateTime ultimoDoMes);
}
