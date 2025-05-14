<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
    <h1>Edit User Skill</h1>
    <form action="<?= base_url('user_skills/update/' . $user_skill['id']) ?>" method="post">
        <label>User ID:</label>
        <input type="number" name="user_id" value="<?= $user_skill['user_id'] ?>" required>

        <label>Skill ID:</label>
        <input type="number" name="skill_id" value="<?= $user_skill['skill_id'] ?>" required>

        <label>Level:</label>
        <select name="level" required>
            <option value="beginner" <?= ($user_skill['level'] == 'beginner') ? 'selected' : '' ?>>Beginner</option>
            <option value="intermediate" <?= ($user_skill['level'] == 'intermediate') ? 'selected' : '' ?>>Intermediate</option>
            <option value="advanced" <?= ($user_skill['level'] == 'advanced') ? 'selected' : '' ?>>Advanced</option>
            <option value="expert" <?= ($user_skill['level'] == 'expert') ? 'selected' : '' ?>>Expert</option>
        </select>

        <button type="submit">Update User Skill</button>
    </form>
    <?= $this->endSection() ?>