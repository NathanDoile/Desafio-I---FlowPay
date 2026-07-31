package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.service.solicitacao.CriarSolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.ACCEPTED;

@RestController
@RequestMapping("/solicitacao")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final CriarSolicitacaoService criarSolicitacaoService;

    @PostMapping
    @ResponseStatus(ACCEPTED)
    public void criarSolicitacao(@Valid @RequestBody CriarSolicitacaoRequest request){
        criarSolicitacaoService.criar(request);
    }
}
