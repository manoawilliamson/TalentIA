-- Seed Data for TalentIA
-- 10 Skills
INSERT INTO skills (name, category, created_at, updated_at) VALUES 
('TypeScript', 'Frontend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Node.js', 'Backend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Docker', 'DevOps', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Figma', 'UI/UX', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Flutter', 'Mobile', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Python', 'Data Science', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('AWS', 'Cloud', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('GraphQL', 'API', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Redis', 'Backend', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Kubernetes', 'DevOps', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 5 Collaborators in Antananarivo, Madagascar
INSERT INTO person (name, firstname, birthday, address, email, telephone) VALUES 
('Andrianina', 'Sitraka', '1995-05-12', 'Antananarivo, Madagascar', 'sitraka.andrian@email.mg', '0340123456'),
('Rakoto', 'Tahina', '1992-08-24', 'Antananarivo, Madagascar', 'tahina.rakoto@email.mg', '0340654321'),
('Rasoamanana', 'Nirina', '1998-11-03', 'Antananarivo, Madagascar', 'nirina.rasoa@email.mg', '0320789123'),
('Randrianarisoa', 'Ando', '1994-02-15', 'Antananarivo, Madagascar', 'ando.randria@email.mg', '0331234567'),
('Mbola', 'Finoana', '1997-06-30', 'Antananarivo, Madagascar', 'finoana.mbola@email.mg', '0341122334');
