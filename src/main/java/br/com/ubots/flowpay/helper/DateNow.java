package br.com.ubots.flowpay.helper;

import java.time.LocalDate;
import java.time.ZoneId;

public class DateNow {

    private DateNow(){}

    public static LocalDate now(){
        return LocalDate.now(ZoneId.of("America/Sao_Paulo"));
    }
}
