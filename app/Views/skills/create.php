<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>Create Skill</h1>
    <form action="<?= base_url('skills/store') ?>" method="post">
        <label>Name:</label>
        <input type="text" name="name" required>
        
        <label>Category:</label>
        <input type="text" name="category">

        <button type="submit">Create Skill</button>
    </form>
    <?= $this->endSection() ?>