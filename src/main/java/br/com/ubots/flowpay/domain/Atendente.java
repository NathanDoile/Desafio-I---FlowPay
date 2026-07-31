package br.com.ubots.flowpay.domain;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor @NoArgsConstructor
public class Atendente {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    private String nomeDeUsuario;

    private boolean isCheio;

    @Version
    private Long versao;

    @ManyToOne
    @JoinColumn(name = "id_equipe")
    private Equipe equipe;

    @OneToMany(mappedBy = "atendente")
    private List<Solicitacao> solicitacoes;
}
