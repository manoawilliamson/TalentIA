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
    FROM 
        project pr
    JOIN 
        projectskills prsk ON pr.id = prsk.idProject
    JOIN 
        personskills ps ON ps.idskill = prsk.idSkills
    JOIN 
        person p ON ps.idperson = p.id
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
    GROUP BY 
        pr.id, pr.name, p.id, p.name, p.firstname, p.email
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
    FROM 
        person p
    JOIN 
        personskills ps ON p.id = ps.idperson
    JOIN 
        projectskills prsk ON ps.idskill = prsk.idSkills
    JOIN 
        project pr ON prsk.idProject = pr.id
    WHERE 
        pr.dateEnd >= CURRENT_DATE -- Only recommend active projects
    GROUP BY 
        pr.id, pr.name, p.id, p.name, p.firstname
) AS ranked
WHERE rank <= 5
ORDER BY idperson, matching_score DESC;

-- View for Project Alerts (Missing Critical Skills)
-- Identifies projects where required skills are not met by any assigned team member
CREATE OR REPLACE VIEW v_project_alerts AS
SELECT 
    pr.id AS idproject,
    pr.name AS project_name,
    s.id AS idskill,
    s.name AS skill_name,
    prsk.noteSkills AS required_level,
    'Missing Critical Skill' AS alert_type
FROM 
    project pr
JOIN 
    projectskills prsk ON pr.id = prsk.idProject
JOIN 
    skills s ON prsk.idSkills = s.id
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
