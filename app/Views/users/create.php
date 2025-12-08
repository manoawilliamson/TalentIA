<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
        <h1>Add User</h1>
        <form action="<?= base_url('users/store') ?>" method="post">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>

            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>

            <label for="role">Role:</label>
            <select id="role" name="role" required>
                <option value="collaborator">Collaborator</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
            </select>

            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required>

            <button type="submit">Add User</button>
        </form>

    <?= $this->endSection() ?>
