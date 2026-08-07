package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.controller.request.CriarSolicitacaoRequest;
import br.com.ubots.flowpay.controller.response.CriarSolicitacaoResponse;
import br.com.ubots.flowpay.service.atendente.FinalizarAtendimentoService;
import br.com.ubots.flowpay.service.solicitacao.CriarSolicitacaoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.ACCEPTED;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/solicitacao")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final CriarSolicitacaoService criarSolicitacaoService;

    private final FinalizarAtendimentoService finalizarAtendimentoService;

    @PostMapping
    @ResponseStatus(ACCEPTED)
    public CriarSolicitacaoResponse criarSolicitacao(@Valid @RequestBody CriarSolicitacaoRequest request){
        return criarSolicitacaoService.criar(request);
    }

    @PutMapping("/{id}/finalizar")
    @ResponseStatus(OK)
    public void finalizarAtendimento(@PathVariable Long id){
        finalizarAtendimentoService.finalizar(id);
    }
}
