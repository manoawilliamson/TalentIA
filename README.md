# 🌟 TalentIA - Talent Management System

**TalentIA** est une application web de gestion des talents et des compétences, développée avec **CodeIgniter 4** pour le backend et **React.js** avec **Tailwind CSS** pour le frontend.  
Elle permet aux entreprises et organisations de gérer efficacement les profils, les compétences et les parcours professionnels.

---

## 🚀 Fonctionnalités principales
- 👤 **Gestion des profils utilisateurs** (création, modification, suppression)
- 📊 **Suivi des compétences et expériences**
- 🔐 **Authentification et autorisation sécurisées** (JWT)
- 🌐 **API RESTful** pour communication frontend-backend
- 💻 **Interface moderne et responsive** avec React + Tailwind CSS
- 🎯 **Système de recommandation** - Matching intelligent projet-personne basé sur les compétences
- 📈 **Analytics \u0026 Reporting** - Statistiques de projets, compétences et utilisation

---

## ⚙️ Prérequis
Assurez-vous d'avoir installé :
- **PHP** >= 8.1
- **Composer**
- **PostgreSQL**
- **Node.js** >= 18
- **npm**

---

## 📥 Installation et démarrage

### 1️⃣ Cloner le projet
```bash
git clone https://github.com/manoawilliamson/TalentIA.git
cd TalentIA
```

### 2️⃣ Backend Setup
```bash
composer install
cp env .env
# Configurer .env avec vos paramètres PostgreSQL
php spark serve
```

### 3️⃣ Frontend Setup
```bash
cd template
npm install
npm run dev
```

### 🛠 Stack technique
**Backend**
- CodeIgniter 4 (PHP)
- PostgreSQL
- JWT Authentication

**Frontend**
- React.js
- Tailwind CSS
- Axios

**Serveurs**
- Backend: http://localhost:8080
- Frontend: http://localhost:5173

---

## 📁 Project Structure

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

---

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
- **Skill Proficiency**: Track skill levels and expertise (1-10 rating)
- **Skill Requirements**: Define required skills for projects
- **Person Skills**: Manage individual skill ratings

### Personnel Allocation
- **Smart Matching**: Algorithm-based person-project matching
- **Availability Tracking**: Monitor personnel availability
- **Skill Gap Analysis**: Identify missing skills in teams
- **Recommendation System**: AI-powered suggestions for project assignments

### Analytics & Reporting
- **Project Statistics**: Time analysis and progress metrics
- **Technology Statistics**: Skill distribution insights
- **Personnel Statistics**: Performance and utilization metrics

---

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

---

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
- `RecommendationController.php` - Smart matching recommendations

---

## 📊 API Endpoints

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

---

## 🔐 Security Features

- **Session Management**: Secure session handling
- **Input Validation**: Form validation and sanitization
- **SQL Injection Prevention**: Parameterized queries
- **Role-based Authorization**: Access control by user role
- **CORS Configuration**: Secure cross-origin requests

---

## 🧪 Testing

### Running Tests
```bash
composer test  # Run PHPUnit tests
```

### Test Coverage
- Model validation
- Controller endpoints
- Authentication flows

---

## 📈 Performance Considerations

- **Database Optimization**: Indexed tables for performance
- **Caching**: View caching for frequently accessed data
- **Asset Optimization**: Minified CSS/JS files
- **Database Views**: Optimized views for recommendations

---

## 🚀 Deployment

### Production Setup
1. Configure production database
2. Set environment variables
3. Install dependencies: `composer install --no-dev`
4. Build frontend: `cd template && npm run build`
5. Set file permissions for `writable/` directory
6. Configure web server (Apache/Nginx)

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit pull request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

For support and questions:
- Check the documentation
- Review existing issues
- Create new issue for bugs or feature requests

---

## 🔄 Version History

- **v1.1.0** - Skills management and recommendation system
  - Person skills management with ratings
  - Project skills requirements
  - Smart recommendation algorithm
  - Enhanced UI with React components
- **v1.0.0** - Initial release with core functionality
  - Basic user management
  - Project and skills management
  - Personnel allocation features
