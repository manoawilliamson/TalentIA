<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Skill</title>
</head>
<body>
    <h1>Edit Skill</h1>
    <form action="<?= base_url('skills/update/' . $skill['id']) ?>" method="post">
        <label>Name:</label>
        <input type="text" name="name" value="<?= $skill['name'] ?>" required>
        
        <label>Category:</label>
        <input type="text" name="category" value="<?= $skill['category'] ?>">

        <button type="submit">Update Skill</button>
    </form>

    <a href="<?= base_url('skills') ?>">Back to Skills List</a>
</body>
</html>