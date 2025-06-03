CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'collaborator')) DEFAULT 'collaborator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@example.com', 'root', 'admin'),
('Manager User', 'manager@example.com', 'root', 'manager'),
('Collaborator User', 'collab@example.com', 'root', 'collaborator');

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

insert into skills (name, category) values ( 'Java', 'Développement' );
insert into skills (name, category) values ( 'C#', 'Développement' );
insert into skills (name, category) values ( 'PHP', 'Développement' );
insert into skills (name, category) values ( 'C/C++', 'Développement' );
insert into skills (name, category) values ( 'R', 'Développement' );
insert into skills (name, category) values ( 'Ruby on Rails', 'Développement' );
insert into skills (name, category) values ( 'Smooth Talking', 'Communication' );


CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateBegin DATE,
    dateEnd DATE,
    nbrPerson INTEGER not null,
    remark TEXT,
    file TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
ALTER TABLE project
ADD COLUMN etat VARCHAR(50);
UPDATE project
SET etat = CASE
    WHEN dateEnd >= CURRENT_DATE THEN 'EN COURS'
    WHEN dateEnd < CURRENT_DATE THEN 'TERMINÉ'
    ELSE NULL
END;

-- Create a function to update the etat column
CREATE OR REPLACE FUNCTION update_project_etat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.etat = CASE
        WHEN NEW.dateEnd >= CURRENT_DATE THEN 'EN COURS'
        WHEN NEW.dateEnd < CURRENT_DATE THEN 'TERMINÉ'
        ELSE NULL
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to call the function before INSERT or UPDATE
CREATE TRIGGER trigger_update_etat
BEFORE INSERT OR UPDATE OF dateEnd
ON project
FOR EACH ROW
EXECUTE FUNCTION update_project_etat();


create table projectskills(
	id serial primary key,
	idProject int,
	idSkills int,
	noteSkills int,
	FOREIGN KEY (idProject) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (idSkills) REFERENCES skills(id) ON DELETE CASCADE
);


create or replace view v_projectskills as
select 
p.id as idprojet,p.name,p.description,p.datebegin,p.dateend,p.nbrperson, p.remark,ps.idskills,s.name as skill, ps.noteskills,p.file
	from project p 
left join 
	projectskills ps on ps.idProject = p.id
left join 
	skills s on ps.idskills = s.id;




create table person(
	id serial primary key,
	name VARCHAR(255),
	firstname VARCHAR(255),
	birthday date,
	address VARCHAR(255),
	email VARCHAR(255),
	telephone VARCHAR(255)
);


create table personskills(
	id serial primary key,
	idperson int,
	idskill int,
	noteskill int default 0,
	dateupdate timestamp default CURRENT_TIMESTAMP,
	FOREIGN KEY (idperson) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (idskill) REFERENCES skills(id) ON DELETE CASCADE
);



create or replace view v_personskills as 
select 
ps.idperson,p.name,p.firstname,p.birthday,p.address,p.email,p.telephone,ps.idskill,s.name as skill,ps.noteskill,ps.dateupdate 
from personskills ps 
left join 
person p on p.id = ps.idperson
left join 
skills s on s.id = ps.idskill;




SELECT DISTINCT ON (idskill) *
FROM v_personskills
WHERE noteskill != 0 and idperson = 15
ORDER BY idskill, dateupdate DESC;

select idperson, name,firstname,address,email,telephone, idskill,skill,noteskill, DATE(dateupdate) as dateupdate
FROM v_personskills
WHERE noteskill != 0
ORDER by dateupdate DESC;



SELECT 
    to_char(dateupdate, 'YYYY-MM') AS month,
    AVG(noteskill) AS average_skill
FROM v_personskills
WHERE idperson = 10 AND noteskill != 0
GROUP BY to_char(dateupdate, 'YYYY-MM')
ORDER BY month ASC

create table personproject(
	id serial primary key,
	idperson int,
	idproject int,
	FOREIGN KEY (idperson) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (idproject) REFERENCES project(id) ON DELETE CASCADE
);
select * from  personproject;

CREATE or replace VIEW v_recommendation_person_project_top5 AS
SELECT *
FROM (
    SELECT 
        p.id AS idperson,
        p.name,
        p.firstname,
        pr.id AS idproject,
        pr.name AS project,
        SUM(ps.noteskill * prsk.noteSkills) AS matching_score,
        COUNT(DISTINCT prsk.idSkills) AS total_required_skills,
        COUNT(DISTINCT ps.idskill) FILTER (WHERE ps.idskill = prsk.idSkills) AS matched_skills,
        ROW_NUMBER() OVER (PARTITION BY pr.id ORDER BY SUM(ps.noteskill * prsk.noteSkills) DESC) AS rank
    FROM 
        project pr
    JOIN 
        projectskills prsk ON pr.id = prsk.idProject
    JOIN 
        personskills ps ON prsk.idSkills = ps.idskill
    JOIN 
        person p ON ps.idperson = p.id
    GROUP BY 
        p.id, pr.id, pr.name, p.name, p.firstname
) AS ranked
WHERE rank <= 5
ORDER BY idproject, matching_score DESC;

CREATE OR REPLACE VIEW v_personproject AS
SELECT 
    pp.idperson,
    p.name,
    p.firstname,
    p.birthday,
    p.address,
    p.email,
    p.telephone,
    pp.idproject,
    pr.name AS project_name,
    pr.description,
    pr.dateBegin,
    pr.dateEnd,
    pr.nbrPerson,
    pr.remark,
    pr.file,
    pr.created_at,
    pr.updated_at
FROM 
    personproject pp
LEFT JOIN 
    person p ON p.id = pp.idperson
LEFT JOIN 
    project pr ON pr.id = pp.idproject;
select * from v_personproject;


CREATE OR REPLACE VIEW v_projects_time_analysis AS
SELECT 
    'year' AS period_type,
    EXTRACT(YEAR FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY') AS period_display,
    COUNT(*) AS project_count
FROM 
    project
GROUP BY 
    EXTRACT(YEAR FROM dateBegin),
    TO_CHAR(dateBegin, 'YYYY')
UNION ALL
SELECT 
    'month' AS period_type,
    EXTRACT(MONTH FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY-MM') AS period_display,
    COUNT(*) AS project_count
FROM 
    project
GROUP BY 
    EXTRACT(MONTH FROM dateBegin),
    TO_CHAR(dateBegin, 'YYYY-MM')
UNION ALL
SELECT 
    'week' AS period_type,
    EXTRACT(WEEK FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY-"W"WW') AS period_display,
    COUNT(*) AS project_count
FROM 
    project
GROUP BY 
    EXTRACT(WEEK FROM dateBegin),
    TO_CHAR(dateBegin, 'YYYY-"W"WW')
ORDER BY 
    period_type, period_display;


CREATE OR REPLACE VIEW v_technology_usage_stats AS
WITH total_projects AS (
    SELECT COUNT(*) AS total FROM project
)
SELECT 
    s.id AS technology_id,
    s.name AS technology_name,
    COUNT(ps.idProject) AS project_count,
    COUNT(ps.idProject)::FLOAT / (SELECT total FROM total_projects) * 100 AS usage_percentage
FROM 
    skills s
LEFT JOIN 
    projectskills ps ON s.id = ps.idSkills
GROUP BY 
    s.id, s.name
ORDER BY 
    project_count DESC;



CREATE OR REPLACE VIEW v_person_participation_stats AS
WITH total_projects AS (
    SELECT COUNT(*) AS total FROM project
)
SELECT 
    p.id AS person_id,
    CONCAT(p.name, ' ', p.firstname) AS person_name,
    COUNT(pp.idproject) AS project_count,
    COUNT(pp.idproject)::FLOAT / (SELECT total FROM total_projects) * 100 AS participation_percentage
FROM 
    person p
LEFT JOIN 
    personproject pp ON p.id = pp.idperson
GROUP BY 
    p.id, p.name, p.firstname
ORDER BY 
    project_count DESC;
select * from v_personskills;