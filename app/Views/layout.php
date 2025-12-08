<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'TalentIA' ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --bg-tertiary: #2a2a2a;
            --bg-card: #1e1e1e;
            --bg-hover: #333333;
            --text-primary: #ffffff;
            --text-secondary: #b0b0b0;
            --text-muted: #808080;
            --accent-primary: #6366f1;
            --accent-secondary: #8b5cf6;
            --accent-success: #10b981;
            --accent-danger: #ef4444;
            --accent-warning: #f59e0b;
            --border-color: #333333;
            --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.3);
            --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
            --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
            --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.6);
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, var(--bg-primary) 0%, #0f0f0f 100%);
            color: var(--text-primary);
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            line-height: 1.6;
        }

        /* Scrollbar Styling */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }

        ::-webkit-scrollbar-thumb {
            background: var(--border-color);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: var(--text-muted);
        }

        /* Navbar Styles */
        .navbar {
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid var(--border-color);
            padding: 16px 24px;
            color: var(--text-primary);
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 1000;
            box-shadow: var(--shadow-md);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .navbar:hover {
            background: rgba(26, 26, 26, 0.98);
            box-shadow: var(--shadow-lg);
        }

        .navbar .user-info {
            font-weight: 500;
            font-size: 1rem;
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .navbar .user-info::before {
            content: '';
            width: 8px;
            height: 8px;
            background: var(--accent-success);
            border-radius: 50%;
            animation: pulse 2s infinite;
        }

        .navbar a {
            color: var(--text-secondary);
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            position: relative;
            overflow: hidden;
        }

        .navbar a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
            transition: left 0.5s ease;
        }

        .navbar a:hover {
            color: var(--text-primary);
            background: var(--bg-hover);
            transform: translateY(-2px);
        }

        .navbar a:hover::before {
            left: 100%;
        }

        /* Sidebar Styles */
        .sidebar {
            width: 260px;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(20px);
            border-right: 1px solid var(--border-color);
            padding-top: 100px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 900;
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding-left: 12px;
            padding-right: 12px;
            animation: slideIn 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .sidebar a {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 16px;
            color: var(--text-secondary);
            text-decoration: none;
            border-radius: 12px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            position: relative;
            overflow: hidden;
        }

        .sidebar a i {
            width: 20px;
            text-align: center;
            font-size: 16px;
        }

        .sidebar a::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
            transition: left 0.5s ease;
        }

        .sidebar a:hover {
            color: var(--text-primary);
            background: var(--bg-hover);
            transform: translateX(4px);
        }

        .sidebar a:hover::before {
            left: 100%;
        }

        .sidebar a.active {
            color: var(--text-primary);
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            box-shadow: var(--shadow-md);
        }

        /* Hide sidebar on small screens */
        @media (max-width: 768px) {
            .sidebar {
                transform: translateX(-100%);
            }
            .sidebar.active {
                transform: translateX(0);
            }
            .toggle-sidebar-btn {
                display: flex;
            }
        }

        /* Sidebar toggle button */
        .toggle-sidebar-btn {
            display: none;
            background: var(--bg-card);
            color: var(--text-primary);
            border: 1px solid var(--border-color);
            font-size: 18px;
            cursor: pointer;
            padding: 10px 12px;
            position: fixed;
            top: 16px;
            left: 16px;
            z-index: 1001;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            align-items: center;
            justify-content: center;
        }

        .toggle-sidebar-btn:hover {
            background: var(--bg-hover);
            transform: scale(1.05);
        }

        /* Content Area */
        .content {
            margin-left: 260px;
            padding: 100px 24px 24px;
            flex: 1;
            animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            min-height: 100vh;
        }

        h1 {
            color: var(--text-primary);
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 32px;
            background: linear-gradient(135deg, var(--text-primary), var(--text-secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        h2 {
            color: var(--text-primary);
            font-size: 1.875rem;
            font-weight: 600;
            margin-bottom: 24px;
        }

        /* Table Styles */
        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 24px;
            background: var(--bg-card);
            border-radius: 16px;
            overflow: hidden;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
        }

        th, td {
            padding: 16px 20px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }

        th {
            background: var(--bg-tertiary);
            font-weight: 600;
            color: var(--text-primary);
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        td {
            color: var(--text-secondary);
            font-size: 0.9375rem;
        }

        tr:hover td {
            background: var(--bg-hover);
            color: var(--text-primary);
        }

        tr:last-child td {
            border-bottom: none;
        }

        /* Link Styles */
        a {
            color: var(--accent-primary);
            text-decoration: none;
            font-weight: 500;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        a:hover {
            color: var(--accent-secondary);
            transform: translateY(-1px);
        }

        /* Button Styles */
        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
            color: white;
            font-size: 0.9375rem;
            font-weight: 600;
            border: none;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: var(--shadow-md);
            text-decoration: none;
        }

        .btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-xl);
        }

        .btn:active {
            transform: translateY(0);
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        }

        .btn-success {
            background: linear-gradient(135deg, var(--accent-success), #059669);
        }

        .btn-danger {
            background: linear-gradient(135deg, var(--accent-danger), #dc2626);
        }

        .btn-secondary {
            background: var(--bg-tertiary);
            color: var(--text-primary);
        }

        /* Message Styles */
        .success-message {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
            color: var(--accent-success);
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-weight: 500;
            border: 1px solid rgba(16, 185, 129, 0.2);
            animation: slideDown 0.4s ease-out;
        }

        .error-message {
            background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
            color: var(--accent-danger);
            padding: 16px 20px;
            border-radius: 12px;
            margin-bottom: 20px;
            font-weight: 500;
            border: 1px solid rgba(239, 68, 68, 0.2);
            animation: slideDown 0.4s ease-out;
        }

        /* Form Styles */
        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--text-primary);
            font-size: 0.9375rem;
        }

        input[type="text"],
        input[type="email"],
        input[type="password"],
        input[type="date"],
        input[type="file"],
        textarea,
        select {
            width: 100%;
            padding: 12px 16px;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            border-radius: 12px;
            color: var(--text-primary);
            font-size: 0.9375rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: inherit;
        }

        input:focus,
        textarea:focus,
        select:focus {
            outline: none;
            border-color: var(--accent-primary);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
            transform: translateY(-1px);
        }

        textarea {
            resize: vertical;
            min-height: 100px;
        }

        /* Card Styles */
        .card {
            background: var(--bg-card);
            border-radius: 16px;
            padding: 24px;
            box-shadow: var(--shadow-lg);
            border: 1px solid var(--border-color);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .card:hover {
            transform: translateY(-4px);
            box-shadow: var(--shadow-xl);
        }

        /* Animations */
        @keyframes fadeIn {
            0% {
                opacity: 0;
                transform: translateY(20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideIn {
            0% {
                transform: translateX(-100%);
            }
            100% {
                transform: translateX(0);
            }
        }

        @keyframes slideDown {
            0% {
                opacity: 0;
                transform: translateY(-20px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: 0.5;
            }
        }

        /* Mobile Styles */
        @media (max-width: 768px) {
            .content {
                margin-left: 0;
                padding: 80px 16px 16px;
            }

            h1 {
                font-size: 2rem;
            }

            .navbar {
                padding: 12px 16px;
            }

            .navbar .user-info {
                font-size: 0.875rem;
            }

            table, th, td {
                font-size: 0.875rem;
                padding: 12px 16px;
            }
        }

        @media (max-width: 480px) {
            .navbar {
                flex-direction: column;
                gap: 12px;
                padding: 12px;
            }

            .navbar a {
                margin: 0;
                padding: 6px 12px;
                font-size: 0.875rem;
            }

            h1 {
                font-size: 1.75rem;
            }

            .toggle-sidebar-btn {
                top: 12px;
                left: 12px;
            }
        }
    </style>
</head>
<body>

    <!-- Sidebar Toggle Button for Small Screens -->
    <button class="toggle-sidebar-btn" onclick="toggleSidebar()">
        <i class="fas fa-bars"></i>
    </button>

    <!-- Navbar -->
    <div class="navbar">
        <div class="user-info">
            <i class="fas fa-user-circle"></i>
            Welcome, <?= session()->get('user_name'); ?>
        </div>
        <div>
            <a href="<?= base_url('auth/logout') ?>">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </a>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar" id="sidebar">
        <a href="<?= base_url('dashboard') ?>" class="active">
            <i class="fas fa-chart-line"></i>
            Dashboard
        </a>
        <a href="<?= base_url('projects') ?>">
            <i class="fas fa-project-diagram"></i>
            Projects
        </a>
        <a href="<?= base_url('users') ?>">
            <i class="fas fa-users"></i>
            Users
        </a>
        <a href="<?= base_url('skills') ?>">
            <i class="fas fa-code"></i>
            Skills
        </a>
        <a href="<?= base_url('person') ?>">
            <i class="fas fa-user-tie"></i>
            Personnel
        </a>
        <a href="<?= base_url('reports') ?>">
            <i class="fas fa-chart-bar"></i>
            Reports
        </a>
        <a href="<?= base_url('settings') ?>">
            <i class="fas fa-cog"></i>
            Settings
        </a>
        <a href="<?= base_url('help') ?>">
            <i class="fas fa-question-circle"></i>
            Help
        </a>
    </div>

    <!-- Main Content Area -->
    <div class="content">
        <?= $this->renderSection('content'); ?>
    </div>

    <!-- JavaScript for interactions -->
    <script>
        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            sidebar.classList.toggle('active');
        }

        // Set active navigation item based on current URL
        document.addEventListener('DOMContentLoaded', function() {
            const currentPath = window.location.pathname;
            const sidebarLinks = document.querySelectorAll('.sidebar a');
            
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === currentPath || 
                    (currentPath.includes(link.getAttribute('href')) && link.getAttribute('href') !== '/')) {
                    link.classList.add('active');
                }
            });
        });

        // Add smooth scroll behavior
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add loading states for forms
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function() {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                }
            });
        });

        // Add hover effects for cards
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-4px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add ripple effect for buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    pointer-events: none;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });

        // Add ripple animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    </script>

</body>
</html>