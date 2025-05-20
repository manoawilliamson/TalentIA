<?= $this->extend('layout') ?>

<?= $this->section('content') ?>

<style>
    .container {
        max-width: 700px;
        margin: 40px auto;
        padding: 30px;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .back-arrow {
        font-size: 24px;
        display: inline-block;
        margin-bottom: 10px;
        text-decoration: none;
        color: #007bff;
    }

    .back-arrow:hover {
        text-decoration: underline;
    }

    h1 {
        text-align: center;
        margin-bottom: 30px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }

    td {
        padding: 10px 8px;
        border: 1px solid #ddd;
    }

    td:first-child {
        font-weight: bold;
        width: 30%;
        background-color: #f9f9f9;
    }

    td:last-child a {
        color: #007bff;
        text-decoration: none;
    }

    td:last-child a:hover {
        text-decoration: underline;
    }

    .actions {
        text-align: right;
    }

    .btn {
        padding: 10px 20px;
        background-color: #f0ad4e;
        color: white;
        border: none;
        border-radius: 4px;
        text-decoration: none;
    }

    .btn:hover {
        background-color: #ec971f;
    }

    .success-message {
        background-color: #dff0d8;
        padding: 10px;
        margin-bottom: 20px;
        border-left: 5px solid #3c763d;
        color: #3c763d;
    }

    .add-skills-btn {
        background-color: #5cb85c;
        margin-right: 10px;
    }

    .add-skills-btn:hover {
        background-color: #4cae4c;
    }

    .delete-btn {
        background-color: #d9534f;
        margin-right: 10px;
    }

    .delete-btn:hover {
        background-color: #c9302c;
    }
</style>

<div class="container">
    <a href="<?= base_url('projects') ?>" class="back-arrow">←</a>

    <h1>Details Projet</h1>

    <?php if (session()->getFlashdata('success')): ?>
        <div class="success-message">
            <?= session()->getFlashdata('success') ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($project)): ?>
        <table>
            <tr>
                <td>Name</td>
                <td><?= esc($project['name']) ?></td>
            </tr>
            <tr>
                <td>Description</td>
                <td><?= esc($project['description']) ?></td>
            </tr>
            <tr>
                <td>Date begin</td>
                <td><?= esc($project['datebegin']) ?></td>
            </tr>
            <tr>
                <td>Date end</td>
                <td><?= esc($project['dateend']) ?></td>
            </tr>
            <tr>
                <td>Number person</td>
                <td><?= esc($project['nbrperson']) ?></td>
            </tr>
            <tr>
                <td>Remarks</td>
                <td><?= esc($project['remark']) ?></td>
            </tr>
            <?php if (!empty($proskills)): ?>
                <tr>
                    <td>Skills needs</td>
                    <td>
                        <ul style="margin: 0; padding-left: 20px;">
                            <?php foreach ($proskills as $skillRecord): ?>
                                <?php if (!empty($skillRecord['skill'])): ?>
                                    <li><?= esc($skillRecord['skill']) ?> - <?= esc($skillRecord['noteskills']) ?></li>
                                <?php endif; ?>
                            <?php endforeach; ?>
                        </ul>
                        <div style="text-align: right; margin-top: 5px;">
                            <a href="<?= base_url('projectskills/list/' . $project['id']) ?>" style="font-size: 0.85em; color: #666; text-decoration: none; font-style: italic;">
                                ✎ Edit Skills
                            </a>
                        </div>

                    </td>
                </tr>
            <?php endif; ?>


            <?php if (!empty($project['file'])): ?>
                <tr>
                    <td>Fichier</td>
                    <td><a href="<?= base_url('projects/download/' . $project['file']) ?>" target="_blank">Download</a></td>
                </tr>
            <?php endif; ?>
        </table>

        <div class="actions">
            <a href="<?= base_url('projectskills/create/' . $project['id']) ?>" class="btn add-skills-btn">Add Skills</a>
            <a href="<?= base_url('projects/delete/' . $project['id']) ?>"
                class="btn delete-btn"
                onclick="return confirm('Are you sure you want to delete this project?');">
                Delete
            </a>
            <a href="<?= base_url('projects/edit/' . $project['id']) ?>" class="btn">Update</a>
        </div>



    <?php else: ?>
        <p>Empty.</p>
    <?php endif; ?>
</div>

<?= $this->endSection() ?>