<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
<h1>Persons List</h1>
<a href="<?= base_url('person/create') ?>">Add New person</a>

<?php if (session()->getFlashdata('success')): ?>
    <div class="success-message">
        <?= session()->getFlashdata('success') ?>
    </div>
<?php endif; ?>

<!-- Filter Inputs -->
<div class="filter-container">
    <div class="filter-row">
        <div class="filter-group">
            <input type="text" id="nameFilter" placeholder="Filter by name...">
        </div>
        <div class="filter-group">
            <input type="text" id="firstNameFilter" placeholder="Filter by first name...">
        </div>
        <button id="resetFilters" class="reset-btn">Reset</button>
    </div>
</div>

<table id="personTable">
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
                    <td class="name-cell"><?= $person['name'] ?></td>
                    <td class="firstname-cell"><?= $person['firstname'] ?></td>
                    <td>
                        <a href="<?= base_url('person/edit/' . $person['id']) ?>">Edit</a> |
                        <a href="<?= base_url('person/delete/' . $person['id']) ?>" onclick="return confirm('Are you sure?')">Delete</a>
                    </td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        const nameFilter = document.getElementById('nameFilter');
        const firstNameFilter = document.getElementById('firstNameFilter');
        const resetBtn = document.getElementById('resetFilters');
        const table = document.getElementById('personTable');
        const rows = table.getElementsByTagName('tr');

        function filterTable() {
            const nameValue = nameFilter.value.toLowerCase();
            const firstNameValue = firstNameFilter.value.toLowerCase();

            for (let i = 1; i < rows.length; i++) {
                const nameCell = rows[i].querySelector('.name-cell');
                const firstnameCell = rows[i].querySelector('.firstname-cell');

                if (nameCell && firstnameCell) {
                    const nameText = nameCell.textContent.toLowerCase();
                    const firstnameText = firstnameCell.textContent.toLowerCase();

                    const nameMatch = nameText.includes(nameValue);
                    const firstnameMatch = firstnameText.includes(firstNameValue);

                    if (nameMatch && firstnameMatch) {
                        rows[i].style.display = '';
                    } else {
                        rows[i].style.display = 'none';
                    }
                }
            }
        }

        nameFilter.addEventListener('keyup', filterTable);
        firstNameFilter.addEventListener('keyup', filterTable);

        resetBtn.addEventListener('click', function() {
            nameFilter.value = '';
            firstNameFilter.value = '';
            filterTable();
        });
    });
</script>
<style>
    .filter-container {
        margin: 20px 0;
        /* padding: 15px; */
        background-color: #f5f5f5;
        border-radius: 5px;
    }

    .filter-row {
        display: flex;
        align-items: center;
        gap: 15px;
        flex-wrap: wrap;
    }

    .filter-group {
        display: flex;
        flex-direction: column;
    }

    .filter-group label {
        margin-bottom: 5px;
        font-weight: 500;
        font-size: 14px;
    }

    #nameFilter,
    #firstNameFilter,
    #dateFilter {
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 14px;
    }

    .reset-btn {
        padding: 8px 15px;
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        align-self: flex-end;
    }

    .reset-btn:hover {
        background-color: #e0e0e0;
    }
</style>

<?= $this->endSection() ?>