package br.com.ubots.flowpay.domain;

import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.EnumType.STRING;
import static jakarta.persistence.GenerationType.IDENTITY;

@Entity
@Getter @Setter
@Builder
@AllArgsConstructor @NoArgsConstructor
public class Solicitacao {

    @Id
    @GeneratedValue(strategy = IDENTITY)
    private Long id;

    @Id
    private Long referenciaConversa;

    @Enumerated(STRING)
    private StatusSolicitacao statusSolicitacao;

    private String assunto;

    @Version
    private Long versao;

    @ManyToOne
    @JoinColumn(name = "id_fila")
    private Fila fila;

    @ManyToOne
    @JoinColumn(name = "id_atendente")
    private Atendente atendente;
}
