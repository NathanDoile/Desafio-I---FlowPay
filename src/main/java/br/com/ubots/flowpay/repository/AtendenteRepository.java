package br.com.ubots.flowpay.repository;

import br.com.ubots.flowpay.domain.Atendente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AtendenteRepository extends JpaRepository<Atendente, Long> {
}
