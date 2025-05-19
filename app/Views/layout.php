<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= $title ?? 'TalentIA' ?></title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
        }

        /* Navbar Styles */
        .navbar {
            background-color: #000000;
            padding: 15px 20px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            z-index: 100;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }

        .navbar .user-info {
            font-weight: bold;
            font-size: 1.1rem;
        }

        .navbar a {
            color: white;
            text-decoration: none;
            margin-right: 40px;
            transition: color 0.3s;
        }

        .navbar a:hover {
            color: #ffeb3b;
        }

        /* Sidebar Styles */
        .sidebar {
            width: 220px;
            background-color: #000000;
            padding-top: 80px;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            z-index: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            animation: slideIn 1s ease-out;
        }

        .sidebar a {
            display: block;
            padding: 15px 20px;
            color: white;
            text-decoration: none;
            width: 100%;
            text-align: center;
            transition: background 0.3s, color 0.3s;
        }


        /* Hide sidebar on small screens */
        @media (max-width: 768px) {
            .sidebar {
                display: none;
            }
            .toggle-sidebar-btn {
                display: block;
            }
        }

        /* Sidebar toggle button */
        .toggle-sidebar-btn {
            display: none;
            background-color: #000;
            color: white;
            border: none;
            font-size: 18px;
            cursor: pointer;
            padding: 10px 20px;
            position: fixed;
            top: 15px;
            left: 10px;
            z-index: 1000;
        }

        /* Content Area */
        .content {
            margin-left: 220px;
            padding: 100px 20px;
            flex: 1;
            animation: fadeIn 1.2s ease-out;
            overflow-y: auto;
        }

        h1 {
            color: #333;
            font-size: 2rem;
            margin-bottom: 20px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: white;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            overflow: hidden;
        }

        th, td {
            border-bottom: 1px solid #ccc;
            padding: 15px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }

        a {
            color: #007bff;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .success-message {
            color: green;
            margin-bottom: 10px;
            font-weight: bold;
        }

        /* Animations */
        @keyframes fadeIn {
            0% {
                opacity: 0;
            }
            100% {
                opacity: 1;
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

        /* Mobile Styles */
        @media (max-width: 768px) {
            .content {
                margin-left: 0;
                padding: 80px 15px;
            }

            h1 {
                font-size: 1.5rem;
            }

            table, th, td {
                font-size: 14px;
                padding: 10px;
            }

            .navbar .user-info {
                font-size: 1rem;
            }
        }

        @media (max-width: 480px) {
            .navbar {
                flex-direction: column;
                padding: 10px;
            }

            .navbar a {
                margin: 10px 0;
            }

            .toggle-sidebar-btn {
                top: 10px;
            }
        }
    </style>
</head>
<body>

    <!-- Sidebar Toggle Button for Small Screens -->
    <button class="toggle-sidebar-btn" onclick="toggleSidebar()">☰</button>

    <!-- Navbar -->
    <div class="navbar">
        <div class="user-info">
            Welcome, <?= session()->get('user_name'); ?>
        </div>
        <div>
            <a href="<?= base_url('auth/logout') ?>">Logout</a>
        </div>
    </div>

    <!-- Sidebar -->
    <div class="sidebar">
        <a href="#">Dashboard</a>
        <a href="projects">Projects</a>
        <a href="users">Users</a>
        <a href="skills">Skills</a>
        <a href="user_skills">User's skills</a>
        <a href="#">Help</a>
    </div>

    <!-- Main Content Area -->
    <div class="content">
        <?= $this->renderSection('content'); ?>
    </div>

    <!-- JavaScript to toggle sidebar -->
    <script>
        function toggleSidebar() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.display = sidebar.style.display === 'block' ? 'none' : 'block';
        }
    </script>

</body>
</html>