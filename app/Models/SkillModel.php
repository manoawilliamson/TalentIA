<?php

namespace App\Models;

use CodeIgniter\Model;

class SkillModel extends Model
{
    protected $table = 'skills';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'category', 'created_at', 'updated_at'];

    // Optional: You can define validation rules if needed
    protected $validationRules = [
        'name' => 'required|max_length[255]',
        'category' => 'max_length[100]',
    ];

    public function check_if_already_exist($name, $category)
    {
        $sql = "SELECT * FROM skills WHERE name = ? AND category = ?";
        $query = $this->db->query($sql, [$name, $category]);

        return $query->getResult();
    }
}
