<?php

namespace App\Models;

use CodeIgniter\Model;

class V_PersonProjectModel extends Model
{
    protected $table = 'v_personproject';

   
    public function getPersonsByProject($idProjet)
    {
        return $this->where('idproject', $idProjet)
                    ->findAll();
    }
}