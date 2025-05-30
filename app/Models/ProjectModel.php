<?php

namespace App\Models;

use CodeIgniter\Model;

class ProjectModel extends Model
{

    protected $table = 'project';
    protected $primaryKey = 'id';
    protected $allowedFields = ['name', 'description', 'datebegin', 'dateend', 'nbrperson', 'remark', 'file', 'etat','created_at', 'updated_at'];

    // Optional: You can define validation rules if needed
    // protected $validationRules = [
    //     'name' => 'required|max_length[255]',
    //     'description' => 'max_length[100]',
    // ];

    protected $useTimestamps = true;

    function getActiveSkills($idProjet)
    {
        // mila dinihana le requete
        $sqlActive = "
            select 
                * 
            from 
                info_projet ip
            left join
                skills s
            on ip.idSkill = s.id
            where 
                ip.id = 3
            and
        ";
    }


    function addTechDataToProject($idProjet, $otherData)
    {
        try {
            $sql = "insert into project_skills(project_id, skill_id, required_level, effectif, descriptions) values ( ?, ?, ?, ?, ?)";

            $this->db->query($sql, [
                $this->db->escapeString('' . $idProjet),
                $this->db->escapeString('' . $otherData['skill_id']),
                $this->db->escapeString('' . $otherData['required_level']),
                $this->db->escapeString('' . $otherData['effectif']),
                $this->db->escapeString('' . $otherData['descriptions']),
            ]);
        } catch (\Exception $e) {
            echo $e->getMessage();
        }
    }

    function getProjectWithStacks($idProjet)
    {
        return $this->db->table('project_skills')
            ->join('skills', 'project_skills.skill_id = skills.id')
            ->where('project_skills.project_id', $idProjet)
            ->get()
            ->getResult();
    }
}
