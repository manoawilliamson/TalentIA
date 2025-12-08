<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>User Skills List</h1>
    <a href="<?= base_url('user_skills/create') ?>">Add New User Skill</a>

    <?php if (session()->getFlashdata('success')): ?>
        <div class="success-message">
            <?= session()->getFlashdata('success') ?>
        </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Skill ID</th>
                <th>Level</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($user_skills)): ?>
            <tr>
                <td colspan="5">No user skills found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($user_skills as $user_skill): ?>
                <tr>
                    <td><?= $user_skill['id'] ?></td>
                    <td><?= $user_skill['user_id'] ?></td>
                    <td><?= $user_skill['skill_id'] ?></td>
                    <td><?= $user_skill['level'] ?></td>
                    <td>
                        <a href="<?= base_url('user_skills/edit/' . $user_skill['id']) ?>">Edit</a> |
                        <a href="<?= base_url('user_skills/delete/' . $user_skill['id']) ?>" onclick="return confirm('Are you sure?')">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>
    <?= $this->endSection() ?>