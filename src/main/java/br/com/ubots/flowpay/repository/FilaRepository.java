package br.com.ubots.flowpay.repository;

import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.Fila;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FilaRepository extends JpaRepository<Fila, Long> {

    Fila findByEquipe(Equipe equipe);
}
