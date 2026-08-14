package br.com.ubots.flowpay.helper;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

public class DateTimeNow {

    private DateTimeNow(){}

    public static ZonedDateTime now(){
        return ZonedDateTime.now(ZoneId.of("America/Sao_Paulo"));
    }

    public static Long diferencaEmSegundosParaAgora(ZonedDateTime dataHora){
        return ChronoUnit.SECONDS.between(dataHora, now());
    }

    public static Long diferencaEmSegundosEntre(ZonedDateTime dataHora, ZonedDateTime dataHoraFinal){
        return ChronoUnit.SECONDS.between(dataHora, dataHoraFinal);
    }
}
