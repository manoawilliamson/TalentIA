<?php

namespace App\Models;

use CodeIgniter\Model;

class V_ProjectTimeAnalyseModel extends Model
{
    protected $table = 'v_projects_time_analysis';

    /**
     * Retourne les 5 personnes recommandées pour un projet donné
     * @param int $idProjet
     * @return array
     */
    public function getProjectAnalyse()
    {
        return $this ->findAll();
    }
}