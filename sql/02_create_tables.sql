-- =============================================================================
-- TalentIA Tables Creation Script
-- =============================================================================
-- Run this after creating the database: psql -U postgres -d talentia -f 02_create_tables.sql

-- =============================================================================
-- Users Table (for application authentication)
-- =============================================================================
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'collaborator')) DEFAULT 'collaborator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- Skills Table
-- =============================================================================
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- =============================================================================
-- Projects Table
-- =============================================================================
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateBegin DATE,
    dateEnd DATE,
    nbrPerson INTEGER NOT NULL,
    remark TEXT,
    file TEXT,
    etat VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);

-- =============================================================================
-- Person Table (employees/personnel)
-- =============================================================================
CREATE TABLE person (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    firstname VARCHAR(255),
    birthday date,
    address VARCHAR(255),
    email VARCHAR(255),
    telephone VARCHAR(255)
);

-- =============================================================================
-- Association Tables
-- =============================================================================

-- Project-Skills relationship
CREATE TABLE projectskills (
    id serial primary key,
    idProject int,
    idSkills int,
    noteSkills int,
    FOREIGN KEY (idProject) REFERENCES project(id) ON DELETE CASCADE,
    FOREIGN KEY (idSkills) REFERENCES skills(id) ON DELETE CASCADE
);

-- Person-Skills relationship
CREATE TABLE personskills (
    id serial primary key,
    idperson int,
    idskill int,
    noteskill int default 0,
    dateupdate timestamp default CURRENT_TIMESTAMP,
    FOREIGN KEY (idperson) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (idskill) REFERENCES skills(id) ON DELETE CASCADE
);

-- Person-Project assignments
CREATE TABLE personproject (
    id serial primary key,
    idperson int,
    idproject int,
    FOREIGN KEY (idperson) REFERENCES person(id) ON DELETE CASCADE,
    FOREIGN KEY (idproject) REFERENCES project(id) ON DELETE CASCADE
);

-- =============================================================================
-- Triggers and Functions
-- =============================================================================

-- Function to automatically update project status (etat)
CREATE OR REPLACE FUNCTION update_project_etat()
RETURNS TRIGGER AS $$
BEGIN
    NEW.etat = CASE
        WHEN NEW.dateBegin > CURRENT_DATE THEN 'PLANIFIÉ'
        WHEN NEW.dateEnd >= CURRENT_DATE THEN 'EN_COURS'
        WHEN NEW.dateEnd < CURRENT_DATE THEN 'TERMINÉ'
        ELSE NULL
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before INSERT or UPDATE
CREATE TRIGGER trigger_update_etat
BEFORE INSERT OR UPDATE
ON project
FOR EACH ROW
EXECUTE FUNCTION update_project_etat();

-- Update existing projects
UPDATE project
SET etat = CASE
    WHEN dateBegin > CURRENT_DATE THEN 'PLANIFIÉ'
    WHEN dateEnd >= CURRENT_DATE THEN 'EN_COURS'
    WHEN dateEnd < CURRENT_DATE THEN 'TERMINÉ'
    ELSE NULL
END;

-- =============================================================================
-- Indexes for better performance
-- =============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_project_datebegin ON project(datebegin);
CREATE INDEX idx_project_dateend ON project(dateend);
CREATE INDEX idx_personskills_idperson ON personskills(idperson);
CREATE INDEX idx_personskills_idskill ON personskills(idskill);
CREATE INDEX idx_projectskills_idproject ON projectskills(idproject);
CREATE INDEX idx_projectskills_idskills ON projectskills(idskills);
CREATE INDEX idx_personproject_idperson ON personproject(idperson);
CREATE INDEX idx_personproject_idproject ON personproject(idproject);
