<?php

namespace App\Models;
use CodeIgniter\Model;

class ProjectSkillsModel extends Model
{
    protected $table = 'projectskills';
    protected $primaryKey = 'id';
    protected $allowedFields = ['idproject', 'idskills','noteskills'];


    public function updateNoteSkill($idproject, $idskills,$note)
    {
     return $this->where('idproject', $idproject)
                    ->where('idskills', $idskills)
                    ->set('noteskills', $note)
                    ->update();   
    }
    public function deleteSkill($idproject, $idskills)
    {
        return $this->where('idproject', $idproject)
                    ->where('idskills', $idskills)
                    ->delete();
    }
}