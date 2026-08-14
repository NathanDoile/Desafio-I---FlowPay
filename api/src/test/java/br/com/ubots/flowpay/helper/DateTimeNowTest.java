package br.com.ubots.flowpay.helper;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.ZoneId;
import java.time.ZonedDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;

class DateTimeNowTest {

    @Test
    @DisplayName("Deve retornar a data corretamente")
    void deveRetornarDataCorretamente(){

        ZonedDateTime response = DateTimeNow.now();
        ZonedDateTime expected = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));

        assertEquals(expected.getYear(), response.getYear());
        assertEquals(expected.getMonth(), response.getMonth());
        assertEquals(expected.getDayOfMonth(), response.getDayOfMonth());
        assertEquals(expected.getHour(), response.getHour());
        assertEquals(expected.getMinute(), response.getMinute());
        assertEquals(expected.getSecond(), response.getSecond());
    }

    @Test
    @DisplayName("Deve retornar a diferença em segundos corretamente")
    void deveRetornarDiferencaSegundosCorretamente(){

        ZonedDateTime dataHoraInicialFila = ZonedDateTime.now(ZoneId.of("America/Sao_Paulo")).minusSeconds(30);
        Long response = DateTimeNow.diferencaEmSegundosParaAgora(dataHoraInicialFila);
        Long expected = 30L;

        assertEquals(expected, response);
    }
}
