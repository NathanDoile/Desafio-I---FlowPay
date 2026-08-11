package br.com.ubots.flowpay.factory;

import br.com.ubots.flowpay.domain.Fila;

import java.util.ArrayList;

public class FilaFactory {

    public static Fila fila() {

        return Fila
                .builder()
                .id(1L)
                .isCheia(false)
                .versao(0L)
                .solicitacoes(new ArrayList<>())
                .build();
    }
}
