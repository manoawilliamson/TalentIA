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
            <th>Skill</th>
            <th>Note</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if (empty($proskills)): ?>
            <tr>
                <td colspan="4">No skills found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($proskills as $skill): ?>
                <tr>
                    <td><?= $skill['skill'] ?></td>
                    <td><?= $skill['noteskills'] ?></td>
                    <td>
                        <a href="<?= base_url(
                                        'projectskills/edit/'          
                                            . $skill['idskills'] . '/' 
                                            . $skill['idprojet']             
                                    ) ?>">✎ Edit | </a>
                        <a href="<?= base_url(
                                        'projectskills/delete/'          
                                            . $skill['idskills'] . '/' 
                                            . $skill['idprojet']             
                                    ) ?>"onclick="return confirm('Are you sure?')">Delete</a>

                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<?= $this->endSection() ?>