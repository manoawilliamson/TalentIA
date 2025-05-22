<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>Persons List</h1>
    <a href="<?= base_url('person/create') ?>">Add New person</a>

    <?php if (session()->getFlashdata('success')): ?>
        <div class="success-message">
            <?= session()->getFlashdata('success') ?>
        </div>
    <?php endif; ?>

    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>First name</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
        <?php if (empty($persons)): ?>
            <tr>
                <td colspan="4">No persons found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($persons as $person): ?>
                <tr onclick="window.location='<?= base_url('person/fiche/' . $person['id']) ?>'">
                    <td><?= $person['name'] ?></td>
                    <td><?= $person['firstname'] ?></td>
                    <td>
                        <a href="<?= base_url('person/edit/' . $person['id']) ?>">Edit</a> |
                        <a href="<?= base_url('person/delete/' . $person['id']) ?>" onclick="return confirm('Are you sure?')">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
        </tbody>
    </table>

    <?= $this->endSection() ?>