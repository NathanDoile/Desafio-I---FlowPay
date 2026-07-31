package br.com.ubots.flowpay.factory;

import br.com.ubots.flowpay.domain.Equipe;
import br.com.ubots.flowpay.domain.enums.Categoria;

import static br.com.ubots.flowpay.factory.FilaFactory.fila;

public class EquipeFactory {

    public static Equipe equipe(Categoria categoria) {

        return Equipe
                .builder()
                .id(1L)
                .categoria(categoria.getDescricao())
                .fila(fila())
                .build();
    }
}
