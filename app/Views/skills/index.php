<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>Skills List</h1>
    <a href="<?= base_url('skills/create') ?>">Add New Skill</a>

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
                <th>Category</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($skills)): ?>
            <tr>
                <td colspan="4">No skills found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($skills as $skill): ?>
                <tr>
                    <td><?= $skill['id'] ?></td>
                    <td><?= $skill['name'] ?></td>
                    <td><?= $skill['category'] ?></td>
                    <td>
                        <a href="<?= base_url('skills/edit/' . $skill['id']) ?>">Edit</a> |
                        <a href="<?= base_url('skills/delete/' . $skill['id']) ?>" onclick="return confirm('Are you sure?')">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>

    <?= $this->endSection() ?>