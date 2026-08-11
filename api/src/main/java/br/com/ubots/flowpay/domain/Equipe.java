package br.com.ubots.flowpay.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor @NoArgsConstructor
public class Equipe {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String categoria;

    @OneToOne(mappedBy = "equipe")
    private Fila fila;

    @OneToMany(mappedBy = "equipe")
    private List<Atendente> atendentes;
}
