-- =============================================================================
-- TalentIA Sample Data Insertion Script
-- =============================================================================
-- Run this after creating tables: psql -U postgres -d talentia -f 03_insert_sample_data.sql

-- =============================================================================
-- Insert Sample Users
-- =============================================================================
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@talentia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Manager User', 'manager@talentia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager'),
('Collaborator User', 'collaborator@talentia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'collaborator');

-- =============================================================================
-- Insert Sample Skills
-- =============================================================================
INSERT INTO skills (name, category) VALUES 
('Java', 'Développement'),
('C#', 'Développement'),
('PHP', 'Développement'),
('C/C++', 'Développement'),
('R', 'Développement'),
('Ruby on Rails', 'Développement'),
('Python', 'Développement'),
('JavaScript', 'Développement'),
('React', 'Développement'),
('Node.js', 'Développement'),
('SQL', 'Base de données'),
('PostgreSQL', 'Base de données'),
('MongoDB', 'Base de données'),
('Git', 'Outils'),
('Docker', 'Outils'),
('AWS', 'Cloud'),
('Azure', 'Cloud'),
('Smooth Talking', 'Communication'),
('Project Management', 'Management'),
('Agile/Scrum', 'Méthodologie'),
('UI/UX Design', 'Design'),
('Testing', 'Qualité'),
('DevOps', 'Infrastructure');

-- =============================================================================
-- Insert Sample Persons
-- =============================================================================
INSERT INTO person (name, firstname, birthday, address, email, telephone) VALUES 
('Smith', 'John', '1990-05-15', '123 Main St, City', 'john.smith@company.com', '555-0101'),
('Johnson', 'Sarah', '1988-08-22', '456 Oak Ave, Town', 'sarah.johnson@company.com', '555-0102'),
('Williams', 'Mike', '1992-03-10', '789 Pine Rd, Village', 'mike.williams@company.com', '555-0103'),
('Brown', 'Emily', '1991-11-30', '321 Elm St, City', 'emily.brown@company.com', '555-0104'),
('Davis', 'David', '1989-07-18', '654 Maple Dr, Town', 'david.davis@company.com', '555-0105'),
('Miller', 'Lisa', '1993-01-25', '987 Cedar Ln, Village', 'lisa.miller@company.com', '555-0106'),
('Wilson', 'James', '1990-09-14', '147 Birch Blvd, City', 'james.wilson@company.com', '555-0107'),
('Moore', 'Jennifer', '1988-12-03', '258 Spruce Way, Town', 'jennifer.moore@company.com', '555-0108'),
('Taylor', 'Robert', '1992-06-28', '369 Fir Ct, Village', 'robert.taylor@company.com', '555-0109'),
('Anderson', 'Maria', '1991-04-12', '741 Redwood Sq, City', 'maria.anderson@company.com', '555-0110');

-- =============================================================================
-- Insert Sample Projects
-- =============================================================================
INSERT INTO project (name, description, dateBegin, dateEnd, nbrPerson, remark, file) VALUES 
('E-commerce Platform', 'Development of a new e-commerce platform with modern features', '2024-01-15', '2024-06-30', 4, 'High priority project', NULL),
('Mobile Banking App', 'Native mobile application for banking services', '2024-02-01', '2024-08-15', 3, 'Security-focused project', NULL),
('Data Analytics Dashboard', 'Business intelligence dashboard for data visualization', '2024-03-10', '2024-09-20', 2, 'Analytics project', NULL),
('HR Management System', 'Complete HR management solution for the company', '2024-01-20', '2024-12-31', 5, 'Internal project', NULL),
('Cloud Migration', 'Migration of legacy systems to cloud infrastructure', '2024-04-01', '2024-10-15', 3, 'Infrastructure project', NULL),
('AI Chatbot', 'Implementation of AI-powered customer service chatbot', '2024-05-15', '2024-11-30', 2, 'Innovation project', NULL);

-- =============================================================================
-- Insert Sample Project-Skills Relationships
-- =============================================================================
INSERT INTO projectskills (idProject, idSkills, noteSkills) VALUES 
-- E-commerce Platform
(1, 1, 8),  -- Java
(1, 8, 9),  -- JavaScript
(1, 9, 8),  -- React
(1, 12, 7), -- SQL
(1, 14, 6), -- Git
(1, 19, 7), -- Agile/Scrum

-- Mobile Banking App
(2, 2, 8),  -- C#
(2, 12, 8), -- SQL
(2, 13, 9), -- PostgreSQL
(2, 18, 9), -- Project Management
(2, 21, 10), -- Testing

-- Data Analytics Dashboard
(3, 5, 9),  -- R
(3, 7, 8),  -- Python
(4, 12, 7), -- SQL
(3, 13, 8), -- PostgreSQL
(3, 22, 7), -- DevOps

-- HR Management System
(4, 3, 8),  -- PHP
(4, 8, 7),  -- JavaScript
(4, 12, 8), -- SQL
(4, 13, 7), -- PostgreSQL
(4, 18, 8), -- Project Management
(4, 19, 7), -- Agile/Scrum

-- Cloud Migration
(5, 15, 9), -- Docker
(5, 16, 8), -- AWS
(5, 22, 8), -- DevOps
(5, 14, 7), -- Git

-- AI Chatbot
(6, 7, 9),  -- Python
(6, 13, 8), -- PostgreSQL
(6, 16, 7), -- AWS
(6, 21, 8); -- Testing

-- =============================================================================
-- Insert Sample Person-Skills Relationships
-- =============================================================================
INSERT INTO personskills (idperson, idskill, noteskill) VALUES 
-- John Smith (Java, JavaScript, React specialist)
(1, 1, 9),   -- Java
(1, 8, 8),   -- JavaScript
(1, 9, 9),   -- React
(1, 14, 7),  -- Git
(1, 19, 6);  -- Agile/Scrum

-- Sarah Johnson (C#, SQL, PostgreSQL expert)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(2, 2, 9),   -- C#
(2, 12, 9),  -- SQL
(2, 13, 8),  -- PostgreSQL
(2, 18, 7),  -- Project Management
(2, 21, 8);  -- Testing

-- Mike Williams (Python, R, Data Analytics)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(3, 5, 9),   -- R
(3, 7, 8),   -- Python
(3, 12, 7),  -- SQL
(3, 13, 8),  -- PostgreSQL
(3, 22, 6);  -- DevOps

-- Emily Brown (PHP, JavaScript, Full-stack)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(4, 3, 8),   -- PHP
(4, 8, 7),   -- JavaScript
(4, 12, 8),  -- SQL
(4, 14, 7),  -- Git
(4, 19, 7);  -- Agile/Scrum

-- David Davis (DevOps, Docker, Cloud)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(5, 15, 9),  -- Docker
(5, 16, 8),  -- AWS
(5, 17, 7),  -- Azure
(5, 14, 8),  -- Git
(5, 22, 9);  -- DevOps

-- Lisa Miller (Python, AI, Testing)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(6, 7, 9),   -- Python
(6, 21, 9),  -- Testing
(6, 12, 7),  -- SQL
(6, 13, 8);  -- PostgreSQL

-- James Wilson (Project Management, Communication)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(7, 18, 9),  -- Project Management
(7, 17, 6),  -- Smooth Talking
(7, 19, 8),  -- Agile/Scrum
(7, 14, 6);  -- Git

-- Jennifer Moore (UI/UX Design, Frontend)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(8, 8, 7),   -- JavaScript
(8, 9, 8),   -- React
(8, 20, 9),  -- UI/UX Design
(8, 19, 6);  -- Agile/Scrum

-- Robert Taylor (Database Specialist)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(9, 12, 9),  -- SQL
(9, 13, 9),  -- PostgreSQL
(9, 14, 7),  -- Git
(9, 21, 8);  -- Testing

-- Maria Anderson (Full-stack with Cloud experience)
INSERT INTO personskills (idperson, idskill, noteskill) VALUES
(10, 1, 7),  -- Java
(10, 8, 8),  -- JavaScript
(10, 16, 7), -- AWS
(10, 15, 6), -- Docker
(10, 19, 7); -- Agile/Scrum

-- =============================================================================
-- Insert Sample Person-Project Assignments
-- =============================================================================
INSERT INTO personproject (idperson, idproject) VALUES 
-- E-commerce Platform Team
(1, 1),   -- John Smith
(4, 1),   -- Emily Brown
(8, 1),   -- Jennifer Moore
(10, 1);  -- Maria Anderson

-- Mobile Banking App Team
INSERT INTO personproject (idperson, idproject) VALUES
(2, 2),   -- Sarah Johnson
(7, 2),   -- James Wilson
(9, 2);   -- Robert Taylor

-- Data Analytics Dashboard Team
INSERT INTO personproject (idperson, idproject) VALUES
(3, 3),   -- Mike Williams
(5, 3);   -- David Davis

-- HR Management System Team
INSERT INTO personproject (idperson, idproject) VALUES
(4, 4),   -- Emily Brown
(7, 4),   -- James Wilson
(9, 4),   -- Robert Taylor
(10, 4),  -- Maria Anderson
(1, 4);   -- John Smith

-- Cloud Migration Team
INSERT INTO personproject (idperson, idproject) VALUES
(5, 5),   -- David Davis
(6, 5),   -- Lisa Miller
(10, 5);  -- Maria Anderson

-- AI Chatbot Team
INSERT INTO personproject (idperson, idproject) VALUES
(3, 6),   -- Mike Williams
(6, 6);   -- Lisa Miller
