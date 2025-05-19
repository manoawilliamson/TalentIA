<?= $this->extend('layout') ?>
<?= $this->section('content') ?>

<style>
    .form-container {
        max-width: 600px;
        margin: 50px auto;
        padding: 40px;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .form-container h1 {
        text-align: center;
        color: #222;
        font-size: 28px;
        margin-bottom: 30px;
    }

    .form-container label {
        display: block;
        margin-bottom: 6px;
        color: #333;
        font-weight: 500;
    }

    .form-container input[type="text"],
    .form-container input[type="date"],
    .form-container input[type="file"],
    .form-container textarea {
        width: 100%;
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: border-color 0.3s;
        font-family: inherit;
    }

    .form-container input:focus,
    .form-container textarea:focus {
        border-color: #007bff;
        outline: none;
    }

    .error-message {
        color: red;
        font-size: 13px;
        margin-bottom: 10px;
        display: block;
    }

    .form-container button {
        width: 100%;
        padding: 12px;
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s;
        margin-top: 10px;
    }

    .form-container button:hover {
        background-color: #0056b3;
    }

    .form-container a {
        display: inline-block;
        margin-top: 15px;
        color: #007bff;
        text-decoration: none;
        font-size: 14px;
    }

    .form-container a:hover {
        text-decoration: underline;
    }
</style>

<div class="form-container">
    <a href="<?= base_url('projects') ?>">← Back</a>
    <h1>Add new Project</h1>

    <?php if (isset($error)) : ?>
        <span class="error-message"><?= $error ?></span>
    <?php endif; ?>

    <form action="<?= base_url('projects/store') ?>" method="post" enctype="multipart/form-data">
        <label>Name</label>
        <input type="text" name="name">
        <?php if (isset($validation) && $validation->getError('name')) : ?>
            <span class="error-message"><?= $validation->getError('name') ?></span>
        <?php endif; ?>

        <label>Description</label>
        <textarea id="description" name="description" rows="9"></textarea>
        <?php if (isset($validation) && $validation->getError('description')) : ?>
            <span class="error-message"><?= $validation->getError('description') ?></span>
        <?php endif; ?>

        <label>Date begin</label>
        <input type="date" name="datebegin">
        <?php if (isset($validation) && $validation->getError('datebegin')) : ?>
            <span class="error-message"><?= $validation->getError('datebegin') ?></span>
        <?php endif; ?>

        <label>Date end</label>
        <input type="date" name="dateend">
        <?php if (isset($validation) && $validation->getError('dateend')) : ?>
            <span class="error-message"><?= $validation->getError('dateend') ?></span>
        <?php endif; ?>

        <label>Number person</label>
        <input type="text" name="nbrperson">
        <?php if (isset($validation) && $validation->getError('nbrperson')) : ?>
            <span class="error-message"><?= $validation->getError('nbrperson') ?></span>
        <?php endif; ?>


        <label>Remark</label>
        <textarea id="remark" name="remark" rows="4"></textarea>
        <?php if (isset($validation) && $validation->getError('remark')) : ?>
            <span class="error-message"><?= $validation->getError('remark') ?></span>
        <?php endif; ?>

        <label>File</label>
        <input type="file" id="file" name="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg">
        <?php if (isset($validation) && $validation->getError('file')) : ?>
            <span class="error-message"><?= $validation->getError('file') ?></span>
        <?php endif; ?>
        <button type="submit">Save</button>
    </form>
</div>

<?= $this->endSection() ?>
