package br.com.ubots.flowpay.domain.enums;

public enum AssuntoSolicitacao {
    CARTAO("problemas com cartao"),
    EMPRESTIMO("contratacao de emprestimo"),
    OUTROS_ASSUNTOS("outros assuntos");

    private String descricao;

    AssuntoSolicitacao(String descricao){
        this.descricao = descricao;
    }

    public String getDescricao(){
        return this.descricao;
    }

    public static AssuntoSolicitacao deTexto(String texto) {

        if(texto.equalsIgnoreCase("problemas com cartao")){
            return CARTAO;
        }
        else if(texto.equalsIgnoreCase("contratacao de emprestimo")){
            return EMPRESTIMO;
        }
        else if(texto.equalsIgnoreCase("outros assuntos")){
            return OUTROS_ASSUNTOS;
        }
        else{
            return null;
        }

    }
}
