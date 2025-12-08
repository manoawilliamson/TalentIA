<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
<div class="dashboard-container">
    <div class="dashboard-header">
        <h1>Dashboard</h1>
        <p class="dashboard-subtitle">Welcome to TalentIA - Your Talent Management System</p>
    </div>

    <?php if (session()->getFlashdata('success')): ?>
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <?= session()->getFlashdata('success') ?>
        </div>
    <?php endif; ?>

    <?php if (session()->getFlashdata('error')): ?>
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <?= session()->getFlashdata('error') ?>
        </div>
    <?php endif; ?>

    <!-- Stats Cards -->
    <div class="stats-grid">
        <div class="card stat-card">
            <div class="stat-icon">
                <i class="fas fa-users"></i>
            </div>
            <div class="stat-content">
                <h3><?= count($users ?? []) ?></h3>
                <p>Total Users</p>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-icon">
                <i class="fas fa-project-diagram"></i>
            </div>
            <div class="stat-content">
                <h3><?= count($projects ?? []) ?></h3>
                <p>Active Projects</p>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-icon">
                <i class="fas fa-code"></i>
            </div>
            <div class="stat-content">
                <h3><?= count($skills ?? []) ?></h3>
                <p>Skills Available</p>
            </div>
        </div>

        <div class="card stat-card">
            <div class="stat-icon">
                <i class="fas fa-chart-line"></i>
            </div>
            <div class="stat-content">
                <h3>85%</h3>
                <p>Efficiency Rate</p>
            </div>
        </div>
    </div>

    <!-- Recent Activity -->
    <div class="card activity-card">
        <h2>Recent Activity</h2>
        <div class="activity-list">
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-user-plus"></i>
                </div>
                <div class="activity-content">
                    <p><strong>New user registered</strong></p>
                    <span class="activity-time">2 hours ago</span>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-plus-circle"></i>
                </div>
                <div class="activity-content">
                    <p><strong>Project created</strong></p>
                    <span class="activity-time">5 hours ago</span>
                </div>
            </div>
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-edit"></i>
                </div>
                <div class="activity-content">
                    <p><strong>Skill updated</strong></p>
                    <span class="activity-time">1 day ago</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Users Table -->
    <div class="card table-card">
        <div class="table-header">
            <h2>Users List</h2>
            <a href="<?= base_url('users/create') ?>" class="btn btn-primary">
                <i class="fas fa-plus"></i>
                Add New User
            </a>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th><i class="fas fa-hashtag"></i> ID</th>
                    <th><i class="fas fa-user"></i> Name</th>
                    <th><i class="fas fa-envelope"></i> Email</th>
                    <th><i class="fas fa-user-tag"></i> Role</th>
                    <th><i class="fas fa-cog"></i> Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($users)): ?>
                    <tr>
                        <td colspan="5" class="no-data">
                            <i class="fas fa-inbox"></i>
                            <p>No users found.</p>
                        </td>
                    </tr>
                <?php else: ?>
                    <?php foreach ($users as $user): ?>
                        <tr>
                            <td><?= $user['id'] ?></td>
                            <td>
                                <div class="user-cell">
                                    <div class="user-avatar">
                                        <i class="fas fa-user-circle"></i>
                                    </div>
                                    <span><?= $user['name'] ?></span>
                                </div>
                            </td>
                            <td><?= $user['email'] ?></td>
                            <td>
                                <span class="role-badge role-<?= $user['role'] ?>">
                                    <?= ucfirst($user['role']) ?>
                                </span>
                            </td>
                            <td>
                                <div class="action-buttons">
                                    <a href="<?= base_url('users/edit/' . $user['id']) ?>" class="btn btn-sm btn-secondary">
                                        <i class="fas fa-edit"></i>
                                        Edit
                                    </a>
                                    <a href="<?= base_url('users/delete/' . $user['id']) ?>" 
                                       class="btn btn-sm btn-danger"
                                       onclick="return confirm('Are you sure you want to delete this user?')">
                                        <i class="fas fa-trash"></i>
                                        Delete
                                    </a>
                                </div>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
</div>

<style>
    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .dashboard-header {
        margin-bottom: 40px;
        text-align: center;
    }

    .dashboard-subtitle {
        color: var(--text-secondary);
        font-size: 1.125rem;
        margin-top: 8px;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 24px;
        margin-bottom: 40px;
    }

    .stat-card {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 24px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: 16px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-xl);
        border-color: var(--accent-primary);
    }

    .stat-icon {
        width: 60px;
        height: 60px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
        color: white;
    }

    .stat-content h3 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin: 0;
    }

    .stat-content p {
        color: var(--text-secondary);
        margin: 4px 0 0 0;
        font-weight: 500;
    }

    .activity-card {
        margin-bottom: 40px;
    }

    .activity-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
    }

    .activity-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 16px;
        background: var(--bg-secondary);
        border-radius: 12px;
        transition: all 0.3s ease;
    }

    .activity-item:hover {
        background: var(--bg-hover);
        transform: translateX(4px);
    }

    .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--bg-tertiary);
        color: var(--accent-primary);
    }

    .activity-content p {
        margin: 0;
        color: var(--text-primary);
        font-weight: 500;
    }

    .activity-time {
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .table-card {
        overflow: hidden;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        flex-wrap: wrap;
        gap: 16px;
    }

    .data-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        background: var(--bg-card);
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid var(--border-color);
    }

    .data-table th {
        background: var(--bg-tertiary);
        padding: 16px 20px;
        text-align: left;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.875rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--border-color);
    }

    .data-table th i {
        margin-right: 8px;
        color: var(--accent-primary);
    }

    .data-table td {
        padding: 16px 20px;
        border-bottom: 1px solid var(--border-color);
        color: var(--text-secondary);
        font-size: 0.9375rem;
    }

    .data-table tr:hover td {
        background: var(--bg-hover);
        color: var(--text-primary);
    }

    .data-table tr:last-child td {
        border-bottom: none;
    }

    .no-data {
        text-align: center;
        padding: 40px !important;
        color: var(--text-muted);
    }

    .no-data i {
        font-size: 3rem;
        margin-bottom: 16px;
        display: block;
    }

    .user-cell {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .user-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: var(--bg-tertiary);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        font-size: 18px;
    }

    .role-badge {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .role-admin {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(220, 38, 38, 0.2));
        color: var(--accent-danger);
        border: 1px solid rgba(239, 68, 68, 0.3);
    }

    .role-manager {
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.2));
        color: var(--accent-warning);
        border: 1px solid rgba(245, 158, 11, 0.3);
    }

    .role-collaborator {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.2));
        color: var(--accent-success);
        border: 1px solid rgba(16, 185, 129, 0.3);
    }

    .action-buttons {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
    }

    .btn-sm {
        padding: 8px 16px;
        font-size: 0.875rem;
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: 1fr;
        }

        .table-header {
            flex-direction: column;
            align-items: stretch;
        }

        .data-table {
            font-size: 0.875rem;
        }

        .data-table th,
        .data-table td {
            padding: 12px 16px;
        }

        .action-buttons {
            flex-direction: column;
        }

        .user-cell {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
        }
    }
</style>
<?= $this->endSection() ?>