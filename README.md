# TalentIA

A comprehensive talent management system built with CodeIgniter 4 for managing projects, skills, and personnel allocation in organizations.

## 📋 Overview

TalentIA is a web application designed to streamline talent management by connecting project requirements with employee skills. The system helps organizations efficiently allocate personnel to projects based on skill requirements and availability.

## 🏗️ Architecture

### Backend Framework
- **CodeIgniter 4** - PHP MVC framework
- **PHP 8.1+** - Server-side language
- **PostgreSQL/MySQL** - Database support

### Frontend Technologies
- **TailwindCSS** - Utility-first CSS framework
- **Vanilla JavaScript** - Client-side interactions
- **PHP Views** - Server-side rendering

## 📁 Project Structure

```
TalentIA/
├── app/                    # Application core
│   ├── Controllers/        # HTTP request handlers
│   ├── Models/            # Database models and business logic
│   ├── Views/             # Frontend templates
│   ├── Config/            # Application configuration
│   ├── Database/          # Database migrations and seeds
│   └── Helpers/           # Utility functions
├── public/                # Web-accessible files
│   ├── css/              # Stylesheets
│   ├── js/               # JavaScript files
│   └── images/           # Static images
├── system/               # CodeIgniter framework files
├── writable/             # Cache, logs, uploads
├── vendor/               # Composer dependencies
├── tests/                # Unit tests
└── database/             # SQL scripts and migrations
```

## 🚀 Features

### User Management
- **Multi-role Authentication**: Admin, Manager, Collaborator roles
- **User Profiles**: Comprehensive user information management
- **Role-based Access Control**: Different permissions per role

### Project Management
- **Project Creation**: Define projects with timelines and requirements
- **Status Tracking**: Monitor project progress (EN COURS, TERMINÉ)
- **Resource Allocation**: Assign personnel based on project needs
- **File Attachments**: Support for project documentation

### Skills Management
- **Skill Catalog**: Organized by categories (Développement, Communication, etc.)
- **Skill Proficiency**: Track skill levels and expertise
- **Skill Requirements**: Define required skills for projects

### Personnel Allocation
- **Smart Matching**: Algorithm-based person-project matching
- **Availability Tracking**: Monitor personnel availability
- **Skill Gap Analysis**: Identify missing skills in teams

### Analytics & Reporting
- **Project Statistics**: Time analysis and progress metrics
- **Technology Statistics**: Skill distribution insights
- **Personnel Statistics**: Performance and utilization metrics

## 🗄️ Database Schema

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

#### Association Tables
- **project_skills**: Links projects to required skills with proficiency levels
- **user_skills**: Tracks user skill proficiencies
- **person_project**: Manages project assignments

## 🎯 Key Controllers

### Authentication
- `Auth.php` - Login/logout functionality
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

## 🔧 Configuration

### Environment Setup
1. Copy `.env.example` to `.env`
2. Configure database credentials
3. Set base URL in `app/Config/App.php`
4. Run database migrations

### Required PHP Extensions
- `ext-intl` - Internationalization
- `ext-mbstring` - Multi-byte string handling
- Database extensions: `ext-mysqli`, `ext-pgsql`, or `ext-sqlite3`

### Frontend Build
```bash
npm install  # Install TailwindCSS
npm run build  # Build CSS assets
```

## 📊 API Endpoints

### Projects
- `GET /projects` - List all projects
- `POST /projects` - Create new project
- `PUT /projects/{id}` - Update project
- `DELETE /projects/{id}` - Delete project

### Skills
- `GET /skills` - List all skills
- `POST /skills` - Create new skill
- `PUT /skills/{id}` - Update skill

### Users
- `GET /users` - List users (admin only)
- `POST /auth/login` - User authentication
- `POST /users/{id}/skills` - Assign skills to user

## 🎨 Frontend Components

### Layout Structure
- **Navbar**: Navigation with user info
- **Sidebar**: Main navigation menu
- **Content Area**: Dynamic content based on route
- **Footer**: Application information

### Key Views
- `dashboard.php` - Main dashboard with statistics
- `projects/` - Project management interfaces
- `skills/` - Skill management forms
- `users/` - User administration

## 🔐 Security Features

- **Session Management**: Secure session handling
- **Input Validation**: Form validation and sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Role-based Authorization**: Access control by user role

## 🧪 Testing

### Running Tests
```bash
composer test  # Run PHPUnit tests
```

### Test Coverage
- Model validation
- Controller endpoints
- Authentication flows

## 📈 Performance Considerations

- **Database Optimization**: Indexed tables for performance
- **Caching**: View caching for frequently accessed data
- **Asset Optimization**: Minified CSS/JS files

## 🚀 Deployment

### Production Setup
1. Configure production database
2. Set environment variables
3. Install dependencies: `composer install --no-dev`
4. Set file permissions for `writable/` directory
5. Configure web server (Apache/Nginx)

### Web Server Configuration
```apache
# Apache .htaccess example
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php/$1 [L]
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create new issue for bugs or feature requests

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
- Basic user management
- Project and skills management
- Personnel allocation features