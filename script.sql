CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'collaborator')) DEFAULT 'collaborator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE OR REPLACE FUNCTION update_skills_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_skills_timestamp
BEFORE UPDATE ON skills
FOR EACH ROW
EXECUTE FUNCTION update_skills_updated_at_column();


CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE user_skills (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    skill_id INT NOT NULL,
    level skill_level NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    evaluator_id INT NOT NULL,
    skill_id INT NOT NULL,
    score INT CHECK (score BETWEEN 1 AND 5),
    evaluation_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (evaluator_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


CREATE TABLE training_recommendations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    training_name VARCHAR(255) NOT NULL,
    skill_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);


CREATE OR REPLACE FUNCTION update_projects_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER update_projects_timestamp
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at_column();


CREATE TYPE skill_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

CREATE TABLE project_skills (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    skill_id INT NOT NULL,
    required_level skill_level NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);


CREATE TABLE project_assignments (
    id SERIAL PRIMARY KEY,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insérer des utilisateurs
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', 'root', 'admin'),
('Manager User', 'manager@example.com', 'root', 'manager'),
('Collaborator User', 'collab@example.com', 'root', 'collaborator');


---------------------

CREATE or replace view vue_skill_initial as
SELECT
    id as idSkill,
    0 as utilisation
FROM
    skills;

--- Okay rehefa vita ny eto 
---- Ny ato indray mgroupe par rapport

create or REPLACE view vue_user_skill_isa as
SELECT
    skill_id as id,
    COUNT(*) as utilisation
FROM
    user_skills us
GROUP by
    skill_id;

create or REPLACE view vue_utilisation_globale as
SELECT
    vsi.idSkill,
    COALESCE( vusi.utilisation, vsi.utilisation ) as nbUtilisation
FROM
    vue_skill_initial vsi
LEFT JOIN vue_user_skill_isa vusi
    on  vsi.idSkill = vusi.id;

------ Okay atao jointure sisa reo

CREATE or REPLACE view v_stats_skil_use as
SELECT
    s.id,
    s.name as nomSkill,
    vug.nbutilisation
FROM
    vue_utilisation_globale vug
JOIN
    skills s on vug.idSkill = s.id;


------ Andao anisy data

insert into skills (name, category) values ( 'Java', 'Développement' );
insert into skills (name, category) values ( 'C#', 'Développement' );
insert into skills (name, category) values ( 'PHP', 'Développement' );
insert into skills (name, category) values ( 'C/C++', 'Développement' );
insert into skills (name, category) values ( 'R', 'Développement' );
insert into skills (name, category) values ( 'Ruby on Rails', 'Développement' );
insert into skills (name, category) values ( 'Smooth Talking', 'Communication' );



create or REPLACE view info_projet as
SELECT
    p.id as id,
    p.name as nomProjet,
    p.description,
    s.id as idSkill,
    s.name as nomSkill,
    s.category,
    ps.required_level
FROM
    project_skills ps
JOIN
    projects p on ps.project_id = p.id
JOIN
    skills s on ps.skill_id = s.id;


create table niveau(

    id serial PRIMARY KEY,
    codeNiveau VARCHAR(100) unique,
    descriptionNiveau VARCHAR(255)

);


insert into niveau (codeNiveau, descriptionNiveau) values ('Junior', 'Junior');
insert into niveau (codeNiveau, descriptionNiveau) values ('Sénior', 'Sénior');
insert into niveau (codeNiveau, descriptionNiveau) values ('Expert', 'Expert');



alter table project_skills add column descriptions varchar(255);
alter table project_skills add column effectif int;