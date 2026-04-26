-- =============================================================================
-- TalentIA Views Creation Script
-- =============================================================================
-- Run this after inserting data: psql -U postgres -d talentia -f 04_create_views.sql

-- =============================================================================
-- Project Skills View
-- =============================================================================
CREATE OR REPLACE VIEW v_projectskills AS
SELECT 
    p.id AS idprojet,
    p.name,
    p.description,
    p.datebegin,
    p.dateend,
    p.nbrperson,
    p.remark,
    ps.idskills,
    s.name AS skill,
    ps.noteskills,
    p.file,
    p.etat
FROM project p 
LEFT JOIN projectskills ps ON ps.idProject = p.id
LEFT JOIN skills s ON ps.idskills = s.id;

-- =============================================================================
-- Person Skills View
-- =============================================================================
CREATE OR REPLACE VIEW v_personskills AS 
SELECT 
    ps.idperson,
    p.name,
    p.firstname,
    p.birthday,
    p.address,
    p.email,
    p.telephone,
    ps.idskill,
    s.name AS skill,
    ps.noteskill,
    ps.dateupdate 
FROM personskills ps 
LEFT JOIN person p ON p.id = ps.idperson
LEFT JOIN skills s ON s.id = ps.idskill;

-- =============================================================================
-- Person Project View
-- =============================================================================
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
    pr.etat,
    pr.created_at,
    pr.updated_at
FROM personproject pp
LEFT JOIN person p ON p.id = pp.idperson
LEFT JOIN project pr ON pr.id = pp.idproject;

-- =============================================================================
-- Projects Time Analysis View
-- =============================================================================
CREATE OR REPLACE VIEW v_projects_time_analysis AS
SELECT 
    'year' AS period_type,
    EXTRACT(YEAR FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY') AS period_display,
    COUNT(*) AS project_count
FROM project
GROUP BY EXTRACT(YEAR FROM dateBegin), TO_CHAR(dateBegin, 'YYYY')
UNION ALL
SELECT 
    'month' AS period_type,
    EXTRACT(MONTH FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY-MM') AS period_display,
    COUNT(*) AS project_count
FROM project
GROUP BY EXTRACT(MONTH FROM dateBegin), TO_CHAR(dateBegin, 'YYYY-MM')
UNION ALL
SELECT 
    'week' AS period_type,
    EXTRACT(WEEK FROM dateBegin) AS period_value,
    TO_CHAR(dateBegin, 'YYYY-"W"WW') AS period_display,
    COUNT(*) AS project_count
FROM project
GROUP BY EXTRACT(WEEK FROM dateBegin), TO_CHAR(dateBegin, 'YYYY-"W"WW')
ORDER BY period_type, period_display;

-- =============================================================================
-- Technology Usage Statistics View
-- =============================================================================
CREATE OR REPLACE VIEW v_technology_usage_stats AS
WITH total_projects AS (
    SELECT COUNT(*) AS total FROM project
)
SELECT 
    s.id AS technology_id,
    s.name AS technology_name,
    s.category AS technology_category,
    COUNT(ps.idProject) AS project_count,
    COUNT(ps.idProject)::FLOAT / NULLIF((SELECT total FROM total_projects), 0) * 100 AS usage_percentage
FROM skills s
LEFT JOIN projectskills ps ON s.id = ps.idSkills
GROUP BY s.id, s.name, s.category
ORDER BY project_count DESC;

-- =============================================================================
-- Person Participation Statistics View
-- =============================================================================
CREATE OR REPLACE VIEW v_person_participation_stats AS
WITH total_projects AS (
    SELECT COUNT(*) AS total FROM project
)
SELECT 
    p.id AS person_id,
    CONCAT(p.name, ' ', p.firstname) AS person_name,
    p.email,
    COUNT(pp.idproject) AS project_count,
    COUNT(pp.idproject)::FLOAT / NULLIF((SELECT total FROM total_projects), 0) * 100 AS participation_percentage
FROM person p
LEFT JOIN personproject pp ON p.id = pp.idperson
GROUP BY p.id, p.name, p.firstname, p.email
ORDER BY project_count DESC;

-- =============================================================================
-- Recommendation Views
-- =============================================================================

-- View for recommending people to a project (Top 5 best matches)
-- Excludes people already assigned to ANY active project
CREATE OR REPLACE VIEW v_recommendation_person_project_top5 AS
SELECT *
FROM (
    SELECT 
        pr.id AS idproject,
        pr.name AS project_name,
        p.id AS idperson,
        p.name,
        p.firstname,
        p.email,
        SUM(ps.noteskill * prsk.noteSkills) AS matching_score,
        COUNT(DISTINCT prsk.idSkills) AS total_required_skills,
        COUNT(DISTINCT ps.idskill) FILTER (WHERE ps.idskill = prsk.idSkills) AS matched_skills,
        ROW_NUMBER() OVER (PARTITION BY pr.id ORDER BY SUM(ps.noteskill * prsk.noteSkills) DESC) AS rank
    FROM project pr
    JOIN projectskills prsk ON pr.id = prsk.idProject
    JOIN personskills ps ON prsk.idSkills = ps.idskill
    JOIN person p ON ps.idperson = p.id
    WHERE 
        pr.dateEnd >= CURRENT_DATE -- Only for active projects
        AND NOT EXISTS (
            -- Exclude people already assigned to any active project
            SELECT 1
            FROM personproject pp
            JOIN project pr2 ON pp.idproject = pr2.id
            WHERE pp.idperson = p.id
            AND pr2.dateEnd >= CURRENT_DATE
        )
    GROUP BY pr.id, pr.name, p.id, p.name, p.firstname, p.email
    HAVING 
        COUNT(DISTINCT ps.idskill) FILTER (WHERE ps.idskill = prsk.idSkills) > 0 -- At least one matching skill
) AS ranked
WHERE rank <= 5
ORDER BY idproject, matching_score DESC;

-- View for recommending projects to a person (Reverse of the existing one)
CREATE OR REPLACE VIEW v_recommendation_project_person_top5 AS
SELECT *
FROM (
    SELECT 
        pr.id AS idproject,
        pr.name AS project_name,
        p.id AS idperson,
        p.name AS person_name,
        p.firstname AS person_firstname,
        SUM(ps.noteskill * prsk.noteSkills) AS matching_score,
        COUNT(DISTINCT prsk.idSkills) AS total_required_skills,
        COUNT(DISTINCT ps.idskill) FILTER (WHERE ps.idskill = prsk.idSkills) AS matched_skills,
        ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY SUM(ps.noteskill * prsk.noteSkills) DESC) AS rank
    FROM person p
    JOIN personskills ps ON p.id = ps.idperson
    JOIN projectskills prsk ON ps.idskill = prsk.idSkills
    JOIN project pr ON prsk.idProject = pr.id
    WHERE pr.dateEnd >= CURRENT_DATE -- Only recommend active projects
    GROUP BY pr.id, pr.name, p.id, p.name, p.firstname
) AS ranked
WHERE rank <= 5
ORDER BY idperson, matching_score DESC;

-- =============================================================================
-- Project Alerts View (Missing Critical Skills)
-- =============================================================================
CREATE OR REPLACE VIEW v_project_alerts AS
SELECT 
    pr.id AS idproject,
    pr.name AS project_name,
    s.id AS idskill,
    s.name AS skill_name,
    prsk.noteSkills AS required_level,
    'Missing Critical Skill' AS alert_type
FROM project pr
JOIN projectskills prsk ON pr.id = prsk.idProject
JOIN skills s ON prsk.idSkills = s.id
WHERE 
    pr.dateEnd >= CURRENT_DATE
    AND NOT EXISTS (
        SELECT 1
        FROM personproject pp
        JOIN personskills ps ON pp.idperson = ps.idperson
        WHERE pp.idproject = pr.id
        AND ps.idskill = prsk.idSkills
        AND ps.noteskill >= prsk.noteSkills -- Ensure the person has the skill at the required level
    );

-- =============================================================================
-- Skill Gap Analysis View
-- =============================================================================
CREATE OR REPLACE VIEW v_skill_gap_analysis AS
SELECT 
    pr.id AS project_id,
    pr.name AS project_name,
    s.id AS skill_id,
    s.name AS skill_name,
    prsk.noteSkills AS required_level,
    COALESCE(AVG(ps.noteskill), 0) AS current_team_level,
    prsk.noteSkills - COALESCE(AVG(ps.noteskill), 0) AS skill_gap,
    CASE 
        WHEN COALESCE(AVG(ps.noteskill), 0) >= prsk.noteSkills THEN 'Covered'
        WHEN COALESCE(AVG(ps.noteskill), 0) > 0 THEN 'Partially Covered'
        ELSE 'Not Covered'
    END AS coverage_status
FROM project pr
JOIN projectskills prsk ON pr.id = prsk.idProject
JOIN skills s ON prsk.idSkills = s.id
LEFT JOIN personproject pp ON pr.id = pp.idproject
LEFT JOIN personskills ps ON pp.idperson = ps.idperson AND ps.idskill = prsk.idSkills
GROUP BY pr.id, pr.name, s.id, s.name, prsk.noteSkills
ORDER BY skill_gap DESC;
