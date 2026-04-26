-- =============================================================================
-- TalentIA Master Setup Script
-- =============================================================================
-- This script runs all database setup scripts in the correct order
-- Usage: psql -U manoawilliamson -f setup_database.sql

-- =============================================================================
-- Instructions
-- =============================================================================
-- 1. Make sure PostgreSQL is running
-- 2. Run this script with your PostgreSQL username
-- 3. The script will execute all setup scripts in sequence

-- =============================================================================
-- Execute all setup scripts
-- =============================================================================

-- Create database
\echo 'Creating database...'
\i 01_create_database.sql

-- Create tables
\echo 'Creating tables...'
\c talentia
\i 02_create_tables.sql

-- Insert sample data
\echo 'Inserting sample data...'
\i 03_insert_sample_data.sql

-- Create views
\echo 'Creating views...'
\i 04_create_views.sql

-- =============================================================================
-- Setup Complete
-- =============================================================================
\echo 'Database setup complete!'
\echo 'Database: talentia'
\echo 'Tables created: 8'
\echo 'Views created: 10'
\echo 'Sample records inserted:'
\echo '  - Users: 3'
\echo '  - Persons: 10'
\echo '  - Skills: 23'
\echo '  - Projects: 6'
\echo '  - Project-Skills: 24'
\echo '  - Person-Skills: 42'
\echo '  - Person-Projects: 16'

-- =============================================================================
-- Test Queries (Optional)
-- =============================================================================
\echo ''
\echo 'Running test queries...'

-- Test basic data
\echo '1. Total users:'
SELECT COUNT(*) as total_users FROM users;

\echo '2. Total persons:'
SELECT COUNT(*) as total_persons FROM person;

\echo '3. Total skills:'
SELECT COUNT(*) as total_skills FROM skills;

\echo '4. Total projects:'
SELECT COUNT(*) as total_projects FROM project;

\echo '5. Active projects:'
SELECT COUNT(*) as active_projects FROM project WHERE dateEnd >= CURRENT_DATE;

\echo '6. Sample recommendations for project 1:'
SELECT * FROM v_recommendation_person_project_top5 WHERE idproject = 1;

\echo '7. Technology usage stats (top 5):'
SELECT * FROM v_technology_usage_stats LIMIT 5;

\echo '8. Person participation stats (top 5):'
SELECT * FROM v_person_participation_stats LIMIT 5;

\echo ''
\echo 'Setup completed successfully!'
