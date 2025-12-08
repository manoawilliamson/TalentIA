<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
        <h1>User Update</h1>
        <form action="<?= base_url('users/update/' . $user['id']) ?>" method="post">
            <label>Name:</label>
            <input type="text" name="name" value="<?= $user['name'] ?>" required>

            <label>Email:</label>
            <input type="email" name="email" value="<?= $user['email'] ?>" required>

            <label>Role:</label>
            <select name="role">
                <option value="collaborator" <?= ($user['role'] === 'collaborator') ? 'selected' : '' ?>>Collaborator</option>
                <option value="manager" <?= ($user['role'] === 'manager') ? 'selected' : '' ?>>Manager</option>
                <option value="admin" <?= ($user['role'] === 'admin') ? 'selected' : '' ?>>Admin</option>
            </select>

            <label>Password (Leave blank if you don't want to change):</label>
            <input type="password" name="password">

            <button type="submit">Update User</button>
        </form>


        <?= $this->endSection() ?>