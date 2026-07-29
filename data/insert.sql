USE bd_desafio_flowpay;

INSERT INTO equipe(categoria) 
VALUES ('CARTAO'), ('EMPRESTIMOS'), ('OUTROS ASSUNTOS');

INSERT INTO fila(id_equipe, versao)
VALUES (1, 1), (2, 1), (3, 1);

INSERT INTO atendente(nome_de_usuario, id_equipe, versao)
VALUES ('Atendente I', 1, 1), ('Atendente I', 2, 1), ('Atendente I', 3, 1),
('Atendente II', 1, 1), ('Atendente II', 2, 1), ('Atendente II', 3, 1),
('Atendente III', 1, 1), ('Atendente III', 2, 1), ('Atendente III', 3, 1);