DELETE FROM solicitacao;

DELETE FROM atendente;

DELETE FROM fila;

DELETE FROM equipe;

INSERT INTO equipe(id, categoria)
VALUES (1, 'CARTAO'), (2, 'EMPRESTIMOS'), (3, 'OUTROS ASSUNTOS');

INSERT INTO fila(id, id_equipe, is_cheia, versao)
VALUES (1, 1, false, 1), (2, 2, false, 1), (3, 3, false, 1);

INSERT INTO atendente(id, nome_de_usuario, id_equipe, is_cheio, versao)
VALUES (1, 'Atendente I', 1, false, 1), (2, 'Atendente I', 2, false, 1), (3, 'Atendente I', 3, false, 1),
(4, 'Atendente II', 1, false, 1), (5, 'Atendente II', 2, false, 1), (6, 'Atendente II', 3, false, 1),
(7, 'Atendente III', 1, false, 1), (8, 'Atendente III', 2, false, 1), (9, 'Atendente III', 3, false, 1);