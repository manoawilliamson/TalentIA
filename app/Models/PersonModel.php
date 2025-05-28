<?php

namespace App\Models;
use CodeIgniter\Model;

class PersonModel extends Model
{
    protected $table = 'person';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'firstname','birthday','address','email','telephone'];


    function createPerson($data)
    {
       $this->db->table($this->table)->insert($data);
        $idperson = $this->db->insertID();

        $skillModel = new SkillModel();
        $skills = $skillModel->findAll();

        $personSkillsModel = new PersonSkillsModel();
        foreach ($skills as $skill) {
            $personSkillsModel->insert([
                'idperson' => $idperson,
                'idskill' => $skill['id'],
                'noteskill' => 0,
                'dateupdate' => date('Y-m-d H:i:s')
            ]);
        }
    }
    public function check_if_already_exist($email, $telephone)
    {
        $sql = "SELECT * FROM person WHERE email = ? AND telephone = ?";
        $query = $this->db->query($sql, [$email, $telephone]);
        return $query->getResult();
    }

    
}