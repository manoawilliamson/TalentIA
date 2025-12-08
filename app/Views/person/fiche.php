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
    .history:hover {
        background-color:rgb(55, 53, 62);
    }
    .history {
        background-color:rgb(55, 53, 62);
        margin-right: 10px;

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
    <a href="<?= base_url('person') ?>" class="back-arrow">←</a>

    <h1>Information</h1>

    <?php if (session()->getFlashdata('success')): ?>
        <div class="success-message">
            <?= session()->getFlashdata('success') ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($person)): ?>
        <table>
            <tr>
                <td>Name</td>
                <td><?= esc($person['name']) ?></td>
            </tr>
            <tr>
                <td>First name</td>
                <td><?= esc($person['firstname']) ?></td>
            </tr>
            <tr>
                <td>Birthday</td>
                <td><?= esc($person['birthday']) ?></td>
            </tr>
            <tr>
                <td>Address</td>
                <td><?= esc($person['address']) ?></td>
            </tr>
            <tr>
                <td>Email</td>
                <td><?= esc($person['email']) ?></td>
            </tr>
            <tr>
                <td>Telephone</td>
                <td><?= esc($person['telephone']) ?></td>
            </tr>
            <tr>
    <td>Skills</td>
    <td>
        <?php if (!empty($personskills)): ?>
            <ul style="margin: 0; padding-left: 20px;">
                <?php foreach ($personskills as $skillRecord): ?>
                    <?php if (!empty($skillRecord['skill'])): ?>
                        <li><?= esc($skillRecord['skill']) ?> - <?= esc($skillRecord['noteskill']) ?></li>
                    <?php endif; ?>
                <?php endforeach; ?>
            </ul>
        <?php else: ?>
            
        <?php endif; ?>
    </td>
</tr>
        </table>

        <div class="actions">
            <a href="<?= base_url('personskills/history/' . $person['id']) ?>" class="btn history">History</a>
            <a href="<?= base_url('personskills/create/' . $person['id']) ?>" class="btn add-skills-btn">Add Skills</a>
            <a href="<?= base_url('person/delete/' . $person['id']) ?>"
                class="btn delete-btn"
                onclick="return confirm('Are you sure you want to delete this person?');">
                Delete
            </a>
            <a href="<?= base_url('person/edit/' . $person['id']) ?>" class="btn">Update</a>
        </div>



    <?php else: ?>
        <p>Empty.</p>
    <?php endif; ?>
</div>

<?= $this->endSection() ?>