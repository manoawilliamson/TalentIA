<?= $this->extend('layout') ?>

<?= $this->section('content') ?>
<a href="<?= base_url('person/fiche/' . $person['id']) ?>" class="back-arrow">←</a>
<h1>Skill History for <?= $person['name'] ?> </h1>

<?php if (session()->getFlashdata('success')): ?>
    <div class="success-message">
        <?= session()->getFlashdata('success') ?>
    </div>
<?php endif; ?>

<!-- Filter Inputs -->
<div class="filter-container">
    <div class="filter-row">
        <div class="filter-group">
            <input type="text" id="skillFilter" placeholder="Filter by skill...">
        </div>
        <div class="filter-group">
            <select id="levelFilter">
                <option value="">All Levels</option>
                <?php foreach ($personskills as $skill): ?>
                <option value="<?=$skill['noteskill'] ?>"><?=$skill['noteskill'] ?></option>
                <?php endforeach; ?>
            </select>
        </div>
        <div class="filter-group">
            <input type="date" id="dateFilter">
        </div>
        <button id="resetFilters" class="reset-btn">Reset</button>
    </div>
</div>

<table id="skillsTable">
    <thead>
        <tr>
            <th>Skill</th>
            <th>Level</th>
            <th>Date acquired/updated</th>
        </tr>
    </thead>
    <tbody>
        <?php if (empty($personskills)): ?>
            <tr>
                <td colspan="3">No skills found.</td>
            </tr>
        <?php else: ?>
            <?php foreach ($personskills as $skill): ?>
                <tr>
                    <td class="skill-cell"><?= $skill['skill'] ?></td>
                    <td class="level-cell"><?= $skill['noteskill'] ?></td>
                    <td class="date-cell"><?= $skill['dateupdate'] ?></td>
                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<!-- Chart.js -->
<div class="chart-container" style="margin: 30px 0; height: 400px;">
    <canvas id="skillChart"></canvas>
</div>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
const monthlyData = <?= json_encode($monthlyAverages) ?>;
        
        const labels = monthlyData.map(item => item.month);
        const averages = monthlyData.map(item => parseFloat(item.average_skill).toFixed(2));
 
        const ctx = document.getElementById('skillChart').getContext('2d');
        const skillChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Average Skill Level',
                    data: averages,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,
                        max: 5,
                        title: {
                            display: true,
                            text: 'Skill Level'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `Avg: ${context.parsed.y.toFixed(2)}`;
                            }
                        }
                    },
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Monthly Average Skill Level'
                    }
                }
            }
        });


    document.addEventListener('DOMContentLoaded', function() {
        const skillFilter = document.getElementById('skillFilter');
        const levelFilter = document.getElementById('levelFilter');
        const dateFilter = document.getElementById('dateFilter');
        const resetBtn = document.getElementById('resetFilters');
        const table = document.getElementById('skillsTable');
        const rows = table.getElementsByTagName('tr');

        function filterTable() {
            const skillValue = skillFilter.value.toLowerCase();
            const levelValue = levelFilter.value;
            const dateValue = dateFilter.value;

            // Start from 1 to skip header row
            for (let i = 1; i < rows.length; i++) {
                const skillCell = rows[i].querySelector('.skill-cell');
                const levelCell = rows[i].querySelector('.level-cell');
                const dateCell = rows[i].querySelector('.date-cell');

                if (skillCell && levelCell && dateCell) {
                    const skillText = skillCell.textContent.toLowerCase();
                    const levelText = levelCell.textContent.trim();
                    const dateText = dateCell.textContent.trim();
                    const rowDate = new Date(dateText);
                    const filterDate = dateValue ? new Date(dateValue) : null;

                    const skillMatch = skillText.includes(skillValue);
                    const levelMatch = !levelValue || levelText === levelValue;
                    const dateMatch = !dateValue ||
                        (rowDate.toDateString() === filterDate.toDateString());

                    if (skillMatch && levelMatch && dateMatch) {
                        rows[i].style.display = '';
                    } else {
                        rows[i].style.display = 'none';
                    }
                }
            }
        }

        skillFilter.addEventListener('keyup', filterTable);
        levelFilter.addEventListener('change', filterTable);
        dateFilter.addEventListener('change', filterTable);

        resetBtn.addEventListener('click', function() {
            skillFilter.value = '';
            levelFilter.value = '';
            dateFilter.value = '';
            filterTable();
        });
    });
</script>

<style>
    .chart-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
    
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

    #skillFilter,
    #levelFilter,
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

    .back-arrow {
        display: inline-block;
        margin-bottom: 20px;
        text-decoration: none;
        color: #333;
        font-size: 18px;
    }

    .success-message {
        background-color: #dff0d8;
        color: #3c763d;
        padding: 10px;
        margin-bottom: 20px;
        border-radius: 4px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 15px;
    }

    th,
    td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }
</style>
<?= $this->endSection() ?>