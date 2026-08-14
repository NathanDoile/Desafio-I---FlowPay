package br.com.ubots.flowpay.service.relatorios;

import br.com.ubots.flowpay.domain.Solicitacao;
import br.com.ubots.flowpay.repository.SolicitacaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import static br.com.ubots.flowpay.helper.DateNow.now;
import static java.util.Objects.isNull;

@Service
@RequiredArgsConstructor
public class MesesMetricasService {

    private final SolicitacaoRepository solicitacaoRepository;

    public List<LocalDate> gerarMesesMetricas() {

        Solicitacao solicitacao = solicitacaoRepository.findById(1L).orElse(null);

        if(isNull(solicitacao)){
            return new ArrayList<>();
        }

        LocalDate dataInicial = solicitacao.getDataHoraInicialSolicitacao().toLocalDate();

        List<LocalDate> meses = new ArrayList<>();

        LocalDate hoje = now();

        do{
            meses.add(dataInicial);

            dataInicial = dataInicial.plusMonths(1);

        }while (dataInicial.isBefore(hoje) ||
                dataInicial.equals(hoje) ||
                (dataInicial.getMonth().equals(hoje.getMonth()) && dataInicial.getYear() == hoje.getYear()));

        return meses;
    }
}
