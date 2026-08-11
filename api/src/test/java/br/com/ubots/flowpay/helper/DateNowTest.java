package br.com.ubots.flowpay.helper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DateNowTest {

    @Test
    @DisplayName("Deve retornar a data corretamente")
    void deveRetornarDataCorretamente(){

        LocalDate response = DateNow.now();
        LocalDate expected = LocalDate.now(ZoneId.of("America/Sao_Paulo"));

        assertEquals(expected, response);
    }
}
