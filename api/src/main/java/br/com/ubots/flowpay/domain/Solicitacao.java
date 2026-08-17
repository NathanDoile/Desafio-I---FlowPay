package br.com.ubots.flowpay.domain;

import br.com.ubots.flowpay.domain.enums.StatusSolicitacao;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.NaturalId;

import java.time.ZonedDateTime;

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

    @NaturalId
    @Column(unique = true, nullable = false)
    private Long referenciaConversa;

    @Enumerated(STRING)
    private StatusSolicitacao statusSolicitacao;

    private String assunto;

    @Version
    private Long versao;

    @Column(columnDefinition = "DATETIME")
    private ZonedDateTime dataHoraInicialSolicitacao;

    @Column(columnDefinition = "DATETIME")
    private ZonedDateTime dataHoraInicialFila;

    @Column(columnDefinition = "DATETIME")
    private ZonedDateTime dataHoraInicialAtendimento;

    @Column(columnDefinition = "DATETIME")
    private ZonedDateTime dataHoraFinalAtendimento;

    @ManyToOne
    @JoinColumn(name = "id_fila")
    private Fila fila;

    @ManyToOne
    @JoinColumn(name = "id_atendente")
    private Atendente atendente;
}
