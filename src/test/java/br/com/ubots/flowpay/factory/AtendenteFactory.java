package br.com.ubots.flowpay.factory;

import br.com.ubots.flowpay.domain.Atendente;

import java.util.ArrayList;

public class AtendenteFactory {

    public static Atendente atendente() {

        return Atendente
                .builder()
                .id(1L)
                .nomeDeUsuario("Atendente")
                .isCheio(false)
                .versao(0L)
                .solicitacoes(new ArrayList<>())
                .build();
    }
}
