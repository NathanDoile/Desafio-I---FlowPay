CREATE TABLE equipe(
	id BIGINT UNSIGNED AUTO_INCREMENT UNIQUE NOT NULL,
    categoria VARCHAR(15) NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE fila(
	id BIGINT UNSIGNED AUTO_INCREMENT UNIQUE NOT NULL,
    id_equipe BIGINT UNSIGNED NOT NULL,
    is_cheia BOOLEAN NOT NULL,
    versao BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(id_equipe) REFERENCES equipe(id)
);

CREATE TABLE atendente(
	id BIGINT UNSIGNED AUTO_INCREMENT UNIQUE NOT NULL,
    nome_de_usuario VARCHAR(100) NOT NULL,
    id_equipe BIGINT UNSIGNED NOT NULL,
    is_cheio BOOLEAN NOT NULL,
    versao BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(id_equipe) REFERENCES equipe(id)
);

CREATE TABLE solicitacao(
	id BIGINT UNSIGNED AUTO_INCREMENT UNIQUE NOT NULL,
    referencia_conversa BIGINT UNSIGNED NOT NULL,
    status_solicitacao VARCHAR(30) NOT NULL,
    assunto VARCHAR(25) NOT NULL,
    id_fila BIGINT UNSIGNED,
    id_atendente BIGINT UNSIGNED,
    versao BIGINT UNSIGNED NOT NULL,
    data_hora_inicial_solicitacao TIMESTAMP,
    data_hora_inicial_fila TIMESTAMP,
    data_hora_inicial_atendimento TIMESTAMP,
    data_hora_final_atendimento TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(id_fila) REFERENCES fila(id),
    FOREIGN KEY(id_atendente) REFERENCES atendente(id)
);