package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.service.atendente.FinalizarAtendimentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/atendente")
@RequiredArgsConstructor
public class AtendenteController {

    private final FinalizarAtendimentoService finalizarAtendimentoService;

    @PutMapping("/finalizar-atendimento/{id}")
    @ResponseStatus(OK)
    public void finalizarAtendimento(@PathVariable Long id){
        finalizarAtendimentoService.finalizar(id);
    }
}
