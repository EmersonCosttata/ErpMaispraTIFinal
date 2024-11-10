INSERT INTO tb_users (full_name, email, birth_date, phone_number, cpf, address, number, district, zip_code, city, state, country, created_at, updated_at, status, password) VALUES ('Fernando', 'fernando_angeli@hotmail.com', '1990-05-15', '(51)98855-0000','000.000.000-01', 'Rua das Flores', '100', 'Centro', '12345000', 'São Paulo', 'SP', 'Brasil', '2024-11-06 10:30:00', '2024-11-06 10:30:00', 'ACTIVE', '$2a$10$ocxs8qS.b/D3VPzdwyYi1eC5YoLXC7E0LgZOEsTAA6I70Y0p0JcdW');
INSERT INTO tb_users (full_name, email, birth_date, phone_number, cpf, address, number, district, zip_code, city, state, country, created_at, updated_at, status, password) VALUES ('Emerson', 'euemerson1@gmail.com', '1990-05-15', '(51)98855-0000', '000.000.000-02','Rua das Flores', '100', 'Centro', '12345000', 'São Paulo', 'SP', 'Brasil','2024-11-06 10:30:00', '2024-11-06 10:30:00', 'ACTIVE', '$2a$10$ocxs8qS.b/D3VPzdwyYi1eC5YoLXC7E0LgZOEsTAA6I70Y0p0JcdW');
INSERT INTO tb_users (full_name, email, birth_date, phone_number, cpf, address, number, district, zip_code, city, state, country, created_at, updated_at, status, password) VALUES ('Marcelo', 'marcelo@hotmail.com', '1990-05-15', '(51)98855-0000', '000.000.000-03' ,'Rua das Flores', '100', 'Centro', '12345000', 'São Paulo', 'SP', 'Brasil', '2024-11-06 10:30:00', '2024-11-06 10:30:00', 'ACTIVE', '$2a$10$ocxs8qS.b/D3VPzdwyYi1eC5YoLXC7E0LgZOEsTAA6I70Y0p0JcdW');
INSERT INTO tb_users (full_name, email, birth_date, phone_number, cpf, address, number, district, zip_code, city, state, country, created_at, updated_at, status, password) VALUES ('Suspenso', 'suspenso@hotmail.com', '1990-05-15', '(51)98855-0000', '000.000.000-04' ,'Rua das Flores', '100', 'Centro', '12345000', 'São Paulo', 'SP', 'Brasil', '2024-11-06 10:30:00', '2024-11-06 10:30:00', 'SUSPENDED', '$2a$10$ocxs8qS.b/D3VPzdwyYi1eC5YoLXC7E0LgZOEsTAA6I70Y0p0JcdW');

INSERT INTO tb_roles (authority) VALUES ('ROLE_OPERATOR');
INSERT INTO tb_roles (authority) VALUES ('ROLE_ADMIN');
INSERT INTO tb_roles (authority) VALUES ('ROLE_MANAGER');

INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (1, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (2, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 1);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 2);
INSERT INTO tb_user_role (user_id, role_id) VALUES (3, 3);

INSERT INTO tb_clients (full_name, type_pf_or_pj, gender, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, birth_date, credit_limit, notes, status) VALUES ('Ana Carolina', 'PF', 'F', '314.559.980-15', '(11) 9886-3347', 'ana.carolina@gmail.com', 'Av. Paulista', '1234', 'Bela Vista', '01.013-001', 'São Paulo', 'SP', 'Brasil', '1990-07-12', 35000.00, 'Faz compras regulares.', 'ACTIVE');
INSERT INTO tb_clients (full_name, type_pf_or_pj, gender, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, birth_date, credit_limit, notes, status) VALUES ('Marcelo', 'PF', 'M', '685.341.320-20', '(51) 3543-4811', 'marcelo_mnicolai@gmail.com', 'Rua Casemiro Alves', 'S/N', 'Centro', '95.650-000', 'Cachoeirinha', 'RS', 'Brasil', '1982-03-29', 50000.00, 'Gremistão e bom pagador.', 'ACTIVE');
INSERT INTO tb_clients (full_name, type_pf_or_pj, gender, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, birth_date, credit_limit, notes, status) VALUES ('João Silva', 'PF', 'M', '493.874.229-70', '(21) 9223-4556', 'joao.silva@yahoo.com', 'Rua dos Andradas', '276', 'Centro', '20.010-000', 'Rio de Janeiro', 'RJ', 'Brasil', '1985-05-14', 15000.00, 'Cliente antigo, bom pagador.', 'ACTIVE');
INSERT INTO tb_clients (full_name, type_pf_or_pj, gender, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, birth_date, credit_limit, notes, status) VALUES ('Lucas Santos', 'PF', 'M', '485.623.748-34', '(31) 9732-8876', 'lucas.santos@hotmail.com', 'Rua Amazonas', '567', 'Savassi', '30.140-000', 'Belo Horizonte', 'MG', 'Brasil', '1995-08-09', 20000.00, 'Sem histórico de inadimplência.', 'ACTIVE');
INSERT INTO tb_clients (full_name, type_pf_or_pj, gender, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, birth_date, credit_limit, notes, status) VALUES ('Mariana Oliveira', 'PF', 'F', '521.998.666-01', '(41) 9845-6598', 'mariana.oliveira@outlook.com', 'Rua XV de Novembro', '908', 'Centro Cívico', '80.020-000', 'Curitiba', 'PR', 'Brasil', '1992-11-23', 45000.00, 'Ótima cliente, paga sempre em dia.', 'ACTIVE');

INSERT INTO tb_suppliers (full_name, type_pf_or_pj, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, credit_limit, notes, status) VALUES ('Marcelo', 'PF', '685.341.320-20', '(51) 3543-4811', 'marcelo_mnicolai@gmail.com', 'Rua Casemiro Alves', 'S/N', 'Centro', '95.650-000', 'Cachoeirinha', 'RS', 'Brasil', 50000.00, 'Gremistão e bom pagador.', 'ACTIVE');
INSERT INTO tb_suppliers (full_name, type_pf_or_pj, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, credit_limit, notes, status) VALUES ('Ana Carolina', 'PF', '314.559.980-15', '(11) 9886-3347', 'ana.carolina@gmail.com', 'Av. Paulista', '1234', 'Bela Vista', '01.013-001', 'São Paulo', 'SP', 'Brasil', 35000.00, 'Faz compras regulares.', 'ACTIVE');
INSERT INTO tb_suppliers (full_name, type_pf_or_pj, cpf_cnpj, phone_number, email, address, number, district, zip_code, city, state, country, credit_limit, notes, status) VALUES ('João Silva', 'PF', '493.874.229-70', '(21) 9223-4556', 'joao.silva@yahoo.com', 'Rua dos Andradas', '276', 'Centro', '20.010-000', 'Rio de Janeiro', 'RJ', 'Brasil', 15000.00, 'Cliente antigo, bom pagador.', 'ACTIVE');
INSERT INTO tb_suppliers (full_name, type_pf_or_pj, cpf_cnpj, state_registration, phone_number, email, address, number, district, zip_code, city, state, country, credit_limit, notes, status) VALUES ('Lucas Santos ME', 'PJ', '94.404.860/0001-34', '254-778', '(31) 9732-8876', 'lucas.santos@hotmail.com', 'Rua Amazonas', '567', 'Savassi', '30.140-000', 'Belo Horizonte', 'MG', 'Brasil', 20000.00, 'Sem histórico de inadimplência.', 'ACTIVE');
INSERT INTO tb_suppliers (full_name, type_pf_or_pj, cpf_cnpj, state_registration, phone_number, email, address, number, district, zip_code, city, state, country, credit_limit, notes, status) VALUES ('Transportes Oliveira', 'PJ', '33.391.374/0001-34', '300-452', '(41) 9845-6598', 'mariana.oliveira@outlook.com', 'Rua XV de Novembro', '908', 'Centro Cívico', '80.020-000', 'Curitiba', 'PR', 'Brasil', 45000.00, 'Ótima cliente, paga sempre em dia.', 'ACTIVE');

INSERT INTO tb_products (supplier_code, name, description, unit_of_measure, product_price, stock, reserved_stock, incoming_stock) VALUES ('SUPP001', 'Produto A', 'Descrição do Produto A', 'UNIT', 50.00, 100, 10, 5);
INSERT INTO tb_products (supplier_code, name, description, unit_of_measure, product_price, stock, reserved_stock, incoming_stock) VALUES ('SUPP002', 'Produto B', 'Descrição do Produto B', 'UNIT', 30.00, 200, 20, 10);
INSERT INTO tb_products (supplier_code, name, description, unit_of_measure, product_price, stock, reserved_stock, incoming_stock) VALUES ('SUPP003', 'Produto C', 'Descrição do Produto C', 'BAR', 25.00, 150, 15, 0);
INSERT INTO tb_products (supplier_code, name, description, unit_of_measure, product_price, stock, reserved_stock, incoming_stock) VALUES ('SUPP004', 'Produto D', 'Descrição do Produto D', 'KG', 75.00, 80, 5, 2);
INSERT INTO tb_products (supplier_code, name, description, unit_of_measure, product_price, stock, reserved_stock, incoming_stock) VALUES ('SUPP005', 'Produto E', 'Descrição do Produto E', 'UNIT', 100.00, 50, 5, 1);

INSERT INTO tb_sales (sale_number, sale_date, expected_delivery_date, client_id, sale_status) VALUES (1, '2024-11-05 14:30:00', '2024-12-05', 1, 'PENDING');

INSERT INTO tb_sale_items (product_id, quantity_sold, sale_price, unit_of_measure, quantity_delivered, sale_id) VALUES (1, 2, 20.0, 'UNIT', 1, 1);  -- Produto com ID 1, 2 vendidos, 1 entregue, na venda com ID 1
INSERT INTO tb_sale_items (product_id, quantity_sold, sale_price, unit_of_measure, quantity_delivered, sale_id) VALUES (2, 3, 30.0, 'UNIT', 2, 1);  -- Produto com ID 2, 3 vendidos, 2 entregues, na venda com ID 1
INSERT INTO tb_sale_items (product_id, quantity_sold, sale_price, unit_of_measure, quantity_delivered, sale_id) VALUES (3, 1, 40.0, 'UNIT', 1, 1);  -- Produto com ID 3, 1 vendido, 1 entregue, na venda com ID 1
INSERT INTO tb_sale_items (product_id, quantity_sold, sale_price, unit_of_measure, quantity_delivered, sale_id) VALUES (1, 5, 50.0, 'UNIT', 0, 1);  -- Produto com ID 1, 5 vendidos, 0 entregues, na venda com ID 2
INSERT INTO tb_sale_items (product_id, quantity_sold, sale_price, unit_of_measure, quantity_delivered, sale_id) VALUES (4, 2, 8.50, 'UNIT', 1, 1);  -- Produto com ID 4, 2 vendidos, 1 entregue, na venda com ID 2

--INSERT INTO tb_deliveries (sale_id, date_delivery) VALUES(1, now());
--INSERT INTO tb_deliveries (sale_id, date_delivery) VALUES(1, now());
--
--INSERT INTO tb_delivery_items (delivery_id, sale_item_id, quantity_delivered) VALUES(1, 1, 1);