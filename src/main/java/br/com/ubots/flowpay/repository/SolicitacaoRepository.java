package br.com.ubots.flowpay.repository;

import br.com.ubots.flowpay.domain.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    boolean existsByReferenciaConversa(Long referenciaConversa);
}
