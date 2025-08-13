# 🌟 TalentIA

**TalentIA** est une application web de gestion des talents et des compétences, développée avec **CodeIgniter 4** pour le backend et **React.js** avec **Tailwind CSS** pour le frontend.  
Elle permet aux entreprises et organisations de gérer efficacement les profils, les compétences et les parcours professionnels.

---

## 🚀 Fonctionnalités principales
- 👤 **Gestion des profils utilisateurs** (création, modification, suppression)
- 📊 **Suivi des compétences et expériences**
- 🔐 **Authentification et autorisation sécurisées** (JWT)
- 🌐 **API RESTful** pour communication frontend-backend
- 💻 **Interface moderne et responsive** avec React + Tailwind CSS

---

## ⚙️ Prérequis
Assurez-vous d’avoir installé :
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
BACKEND:
  composer install
  cp env .env
  # Configurer .env avec vos paramètres PostgreSQL
  php spark serve
FRONTEND:
  cd template
  npm install
  npm run dev
```

### 🛠 Stack technique
Backend
  CodeIgniter 4 (PHP)
  PostgreSQL
  JWT Authentication
Frontend
  React.js
  Tailwind CSS
  Axios

Backend disponible par défaut sur :
➡️ http://localhost:8080

Frontend disponible par défaut sur :
➡️ http://localhost:5173
