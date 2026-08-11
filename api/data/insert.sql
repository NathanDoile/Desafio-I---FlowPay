INSERT INTO equipe(categoria)
VALUES ('CARTAO'), ('EMPRESTIMOS'), ('OUTROS ASSUNTOS');

INSERT INTO fila(id_equipe, is_cheia, versao)
VALUES (1, false, 1), (2, false, 1), (3, false, 1);

INSERT INTO atendente(nome_de_usuario, id_equipe, is_cheio, versao)
VALUES ('Atendente I', 1, false, 1), ('Atendente I', 2, false, 1), ('Atendente I', 3, false, 1),
('Atendente II', 1, false, 1), ('Atendente II', 2, false, 1), ('Atendente II', 3, false, 1),
('Atendente III', 1, false, 1), ('Atendente III', 2, false, 1), ('Atendente III', 3, false, 1);