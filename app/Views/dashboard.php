<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
        <h1>Users List</h1>
        <a href="<?= base_url('users/create') ?>" class="btn btn-primary">Add New User</a>

        <?php if (session()->getFlashdata('success')): ?>
            <div class="success-message">
                <?= session()->getFlashdata('success') ?>
            </div>
        <?php endif; ?>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            <?php if (empty($users)): ?>
                <tr>
                    <td colspan="5">No users found.</td>
                </tr>
            <?php else: ?>
                <?php foreach ($users as $user): ?>
                    <tr>
                        <td><?= $user['id'] ?></td>
                        <td><?= $user['name'] ?></td>
                        <td><?= $user['email'] ?></td>
                        <td><?= $user['role'] ?></td>
                        <td>
                            <a href="<?= base_url('users/edit/' . $user['id']) ?>">Edit</a> | 
                            <a href="<?= base_url('users/delete/' . $user['id']) ?>" onclick="return confirm('Are you sure?')">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            <?php endif; ?>
            </tbody>
        </table>
        <?= $this->endSection() ?>