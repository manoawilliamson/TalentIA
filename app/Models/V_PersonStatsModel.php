<?php

namespace App\Models;

use CodeIgniter\Model;

class V_PersonStatsModel extends Model
{
    protected $table = 'v_person_participation_stats';

    /**
     * Retourne les 5 personnes recommandées pour un projet donné
     * @param int $idProjet
     * @return array
     */
    public function getCollabAnalyse()
    {
        return $this ->findAll();
    }
}