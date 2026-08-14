package br.com.ubots.flowpay.controller;

import br.com.ubots.flowpay.controller.response.TelaDetalheResponse;
import br.com.ubots.flowpay.controller.response.TelaHomeResponse;
import br.com.ubots.flowpay.controller.response.TelaMetricasGeraisResponse;
import br.com.ubots.flowpay.service.relatorios.MesesMetricasService;
import br.com.ubots.flowpay.service.relatorios.TelaDetalheService;
import br.com.ubots.flowpay.service.relatorios.TelaHomeService;
import br.com.ubots.flowpay.service.relatorios.TelaMetricasGeraisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping("/relatorios")
@RequiredArgsConstructor
public class BffController {

    private final TelaHomeService telaHomeService;

    private final TelaDetalheService telaDetalheService;

    private final MesesMetricasService mesesMetricasService;

    private final TelaMetricasGeraisService telaMetricasGeraisService;

    @GetMapping("/home")
    @ResponseStatus(OK)
    public TelaHomeResponse home() {
        return telaHomeService.gerarHome();
    }

    @GetMapping("/detalhe/{categoriaEquipe}")
    @ResponseStatus(OK)
    public TelaDetalheResponse detalhe(@PathVariable String categoriaEquipe) {
        return telaDetalheService.gerarDetalhe(categoriaEquipe);
    }

    @GetMapping("/meses-metricas")
    public List<LocalDate> mesesMetricas() {
        return mesesMetricasService.gerarMesesMetricas();
    }

    @GetMapping("metricas-gerais")
    public TelaMetricasGeraisResponse metricasGerais(@RequestParam LocalDate data) {
        return telaMetricasGeraisService.gerarMetricasGerais(data);
    }
}
