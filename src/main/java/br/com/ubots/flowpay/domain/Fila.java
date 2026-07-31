package br.com.ubots.flowpay.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor @NoArgsConstructor
public class Fila {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private boolean isCheia;

    @Version
    private Long versao;

    @OneToOne
    @JoinColumn(name = "id_equipe")
    private Equipe equipe;

    @OneToMany(mappedBy = "fila")
    private List<Solicitacao> solicitacoes;
}
