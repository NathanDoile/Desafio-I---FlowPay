package br.com.ubots.flowpay.domain.enums;

public enum Categoria {
    CARTAO("CARTAO"),
    EMPRESTIMO("EMPRESTIMOS"),
    OUTROS_ASSUNTOS("OUTROS ASSUNTOS");

    private String descricao;

    Categoria(String descricao){
        this.descricao = descricao;
    }

    public String getDescricao(){
        return this.descricao;
    }
}
