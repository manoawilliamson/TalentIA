<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>List of projects</h1>
    <a href="<?= base_url('projects/create') ?>">Add New Project</a>

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
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($projects)): ?>
            <tr>
                <td colspan="4">No projects found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($projects as $project): ?>
                <tr onclick="window.location='<?= base_url('projects/fiche/' . $project['id']) ?>'">
                    <td><?= $project['id'] ?></td>
                    <td><?= $project['name'] ?></td>
                    <td><?= $project['description'] ?></td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>

    <?= $this->endSection() ?>