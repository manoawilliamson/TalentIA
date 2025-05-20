<?php

namespace App\Models;

use CodeIgniter\Model;

class V_ProjectSkillsModel extends Model
{
    protected $table = 'v_projectskills';
    protected $primaryKey = null;
    protected $allowedFields = ['idprojet', 'name', 'description', 'datebegin', 'dateend', 'nbrperson', 'remark', 'idskills', 'skill', 'noteskills', 'file'];


    public function getSkillsForProject($id)
    {
        $query = $this->db->query("SELECT * FROM v_projectskills WHERE idprojet = ?", [$id]);
        $result = $query->getResult();

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'idprojet' => $row->idprojet,
                'name' => $row->name,
                'description' => $row->description,
                'datebegin' => $row->datebegin,
                'dateend' => $row->dateend,
                'nbrperson' => $row->nbrperson,
                'remark' => $row->remark,
                'idskills' => $row->idskills,
                'skill' => $row->skill,
                'noteskills' => $row->noteskills,
                'file' => $row->file

            ];
        }
        return $data;
    }
}
