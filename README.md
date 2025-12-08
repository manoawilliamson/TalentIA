# TalentIA - Talent Management System

A comprehensive talent management system built with CodeIgniter 4 and React.js for managing projects, skills, and personnel allocation in organizations.

## Overview

TalentIA is a web application designed to streamline talent management by connecting project requirements with employee skills. The system helps organizations efficiently allocate personnel to projects based on skill requirements and availability through an intelligent recommendation engine.

## Technology Stack

### Backend
- CodeIgniter 4 (PHP)
- PostgreSQL
- JWT Authentication

### Frontend
- React.js with TypeScript
- Tailwind CSS
- Axios for API communication

### Development Servers
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

## Prerequisites

- PHP >= 8.1
- Composer
- PostgreSQL
- Node.js >= 18
- npm

## Installation

### Clone the Repository
```bash
git clone https://github.com/manoawilliamson/TalentIA.git
cd TalentIA
```

### Backend Setup
```bash
composer install
cp env .env
# Configure .env with your PostgreSQL credentials
php spark serve
```

### Frontend Setup
```bash
cd template
npm install
npm run dev
```

## Project Structure

```
TalentIA/
├── app/                    # Application core
│   ├── Controllers/        # HTTP request handlers
│   ├── Models/            # Database models and business logic
│   ├── Views/             # PHP templates (legacy)
│   ├── Config/            # Application configuration
│   ├── Database/          # Database migrations and seeds
│   └── Helpers/           # Utility functions
├── template/              # React frontend
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
├── public/                # Web-accessible files
├── writable/             # Cache, logs, uploads
└── vendor/               # Composer dependencies
```

## Features

### User Management
- Multi-role authentication (Admin, Manager, Collaborator)
- Comprehensive user profile management
- Role-based access control with granular permissions

### Project Management
- Project lifecycle management with timelines
- Status tracking and progress monitoring
- Resource allocation and assignment
- File attachments and documentation support

### Skills Management
- Categorized skill catalog
- Skill proficiency tracking (1-10 rating scale)
- Project skill requirements definition
- Individual skill ratings and assessments

### Personnel Allocation
- Algorithm-based person-project matching
- Availability tracking and conflict detection
- Skill gap analysis and identification
- Intelligent recommendation system for project assignments

### Analytics and Reporting
- Project statistics and time analysis
- Technology distribution insights
- Personnel performance and utilization metrics

## Database Schema

### Core Tables

#### Users
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'manager', 'collaborator')) DEFAULT 'collaborator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Projects
```sql
CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateBegin DATE,
    dateEnd DATE,
    nbrPerson INTEGER not null,
    remark TEXT,
    file TEXT,
    etat VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
```

#### Skills
```sql
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
);
```

### Association Tables
- **project_skills** - Links projects to required skills with proficiency levels
- **user_skills** - Tracks user skill proficiencies
- **person_project** - Manages project assignments

## API Endpoints

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Skills
- `GET /api/skills` - List all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/{id}` - Update skill

### Users
- `GET /api/users` - List users (admin only)
- `POST /api/auth/login` - User authentication
- `POST /api/users/{id}/skills` - Assign skills to user

### Recommendations
- `GET /api/recommendations/project/{id}` - Get person recommendations for project
- `GET /api/recommendations/person/{id}` - Get project recommendations for person

## Key Controllers

### Authentication
- `Auth.php` - Login and logout functionality
- `UserController.php` - User profile management

### Core Features
- `ProjectController.php` - CRUD operations for projects
- `SkillController.php` - Skills management
- `PersonController.php` - Personnel management
- `DashboardController.php` - Main dashboard view

### Specialized Controllers
- `PersonSkillsController.php` - User skill assignments
- `ProjectSkillsController.php` - Project skill requirements
- `PersonProjectController.php` - Project assignments
- `RecommendationController.php` - Smart matching recommendations

## Security Features

- Session-based authentication with secure session handling
- Comprehensive input validation and sanitization
- SQL injection prevention through parameterized queries
- Role-based authorization and access control
- CORS configuration for secure cross-origin requests

## Testing

### Running Tests
```bash
composer test  # Run PHPUnit tests
```

### Test Coverage
- Model validation
- Controller endpoints
- Authentication flows

## Performance Considerations

- Database optimization with indexed tables
- View caching for frequently accessed data
- Minified CSS and JavaScript assets
- Optimized database views for recommendations

## Deployment

### Production Setup
1. Configure production database credentials
2. Set appropriate environment variables
3. Install dependencies: `composer install --no-dev`
4. Build frontend: `cd template && npm run build`
5. Set file permissions for `writable/` directory
6. Configure web server (Apache or Nginx)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Review the documentation
- Check existing issues
- Create a new issue for bugs or feature requests

## Version History

### v1.1.0 - Skills Management and Recommendation System
- Person skills management with rating system
- Project skills requirements
- Smart recommendation algorithm
- Enhanced UI with React components

### v1.0.0 - Initial Release
- Basic user management
- Project and skills management
- Personnel allocation features
