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
    .form-container select {
        width: 100%;
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: border-color 0.3s;
        font-family: inherit;
    }

    .form-container input:focus,
    .form-container select:focus {
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
    <a href="<?= base_url('person') ?>">← Back</a>
    <h1>Add skills persons</h1>

    <?php if (isset($error)) : ?>
        <span class="error-message"><?= $error ?></span>
    <?php endif; ?>

    <form action="<?= base_url('personskills/store') ?>" method="post">
        <input type="hidden" name="idperson" value="<?= esc($personId) ?>" readonly>

        <label for="idskills">Skills</label>
        <select name="idskills" id="idskills" required>
            <option value="">-- Choose one skill --</option>
            <?php foreach ($skills as $skill) : ?>
                <option value="<?= esc($skill['id']) ?>"><?= esc($skill['name']) ?></option>
            <?php endforeach; ?>
        </select>
        <?php if (isset($validation) && $validation->getError('idskills')) : ?>
            <span class="error-message"><?= $validation->getError('idskills') ?></span>
        <?php endif; ?>

        <label>Note skills</label>
        <input type="text" name="noteskills">
        <?php if (isset($validation) && $validation->getError('noteskills')) : ?>
            <span class="error-message"><?= $validation->getError('noteskills') ?></span>
        <?php endif; ?>
        <button type="submit">Save</button>
    </form>
</div>



<?= $this->endSection() ?>