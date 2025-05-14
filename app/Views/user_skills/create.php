<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>Create User Skill</h1>
    <form action="<?= base_url('user_skills/store') ?>" method="post">
        <label>User ID:</label>
        <input type="number" name="user_id" required>
        
        <label>Skill ID:</label>
        <input type="number" name="skill_id" required>
        
        <label>Level:</label>
        <select name="level" required>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
        </select>

        <button type="submit">Create User Skill</button>
    </form>
    <?= $this->endSection() ?>