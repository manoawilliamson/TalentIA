# TalentIA Database Setup Scripts

This directory contains SQL scripts to set up the TalentIA database completely.

## Quick Setup

Run the master script to execute all setup steps:

```bash
psql -U manoawilliamson -f setup_database.sql
```

## Individual Scripts

If you prefer to run scripts individually, follow this order:

### 1. Create Database
```bash
psql -U manoawilliamson -f 01_create_database.sql
```

### 2. Create Tables
```bash
psql -U manoawilliamson -d talentia -f 02_create_tables.sql
```

### 3. Insert Sample Data
```bash
psql -U manoawilliamson -d talentia -f 03_insert_sample_data.sql
```

### 4. Create Views
```bash
psql -U manoawilliamson -d talentia -f 04_create_views.sql
```

## Database Structure

### Core Tables
- **users** - Application authentication users
- **person** - Employees/personnel records
- **skills** - Skills catalog with categories
- **project** - Project management records
- **projectskills** - Project skill requirements
- **personskills** - Person skill proficiencies
- **personproject** - Project assignments

### Views
- **v_projectskills** - Projects with their required skills
- **v_personskills** - Persons with their skill ratings
- **v_personproject** - Project assignments with details
- **v_projects_time_analysis** - Project timeline statistics
- **v_technology_usage_stats** - Skill usage across projects
- **v_person_participation_stats** - Person project participation
- **v_recommendation_person_project_top5** - Person-to-project recommendations
- **v_recommendation_project_person_top5** - Project-to-person recommendations
- **v_project_alerts** - Projects with missing critical skills
- **v_skill_gap_analysis** - Skill coverage analysis

## Sample Data

The setup includes comprehensive sample data:
- 3 users (admin, manager, collaborator)
- 10 persons with various skills
- 23 skills across different categories
- 6 projects with different timelines
- Skill assignments and project relationships

## Default Credentials

Sample users (password: `password`):
- admin@talentia.com (admin role)
- manager@talentia.com (manager role)
- collaborator@talentia.com (collaborator role)

## Features

- **Automatic project status updates** via triggers
- **Skill-based recommendation engine**
- **Comprehensive analytics views**
- **Performance optimized indexes**
- **Foreign key constraints for data integrity**

## Post-Setup

1. Update your `.env` file with database credentials
2. Run `php spark key:generate` to set encryption key
3. Start the application with `php spark serve`
4. Access the application at `http://localhost:8080`

## Testing

Run test queries to verify setup:

```sql
-- Check all tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' ORDER BY table_name;

-- Check all views
SELECT table_name FROM information_schema.views 
WHERE table_schema = 'public' ORDER BY table_name;

-- Test recommendations
SELECT * FROM v_recommendation_person_project_top5 LIMIT 5;
```
