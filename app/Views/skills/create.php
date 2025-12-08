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

    .form-container input[type="text"] {
        width: 100%;
        padding: 12px;
        margin-bottom: 8px;
        border: 1px solid #ccc;
        border-radius: 8px;
        transition: border-color 0.3s;
    }

    .form-container input[type="text"]:focus {
        border-color: #007bff;
        outline: none;
    }

    .error-message {
        color: red;
        font-size: 13px;
        margin-bottom: 14px;
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
    <a href="<?= base_url('skills') ?>">← Back</a>
    <h1>Add new skill</h1>

    <?php if (isset($error)) : ?>
        <span class="error-message"><?= $error ?></span>
    <?php endif; ?>

    <form action="<?= base_url('skills/store') ?>" method="post">
        <label>Name</label>
        <input type="text" name="name">
        <?php if (isset($validation) && $validation->getError('name')) : ?>
            <span class="error-message"><?= $validation->getError('name') ?></span>
        <?php endif; ?>

        <label>Category</label>
        <input type="text" name="category">
        <?php if (isset($validation) && $validation->getError('category')) : ?>
            <span class="error-message"><?= $validation->getError('category') ?></span>
        <?php endif; ?>

        <button type="submit">Save</button>
    </form>
</div>

<?= $this->endSection() ?>
