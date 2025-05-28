<?php

namespace App\Models;

use CodeIgniter\Model;

class V_RecomPersonModel extends Model
{
    protected $table = 'v_recommendation_person_project_top5';

    /**
     * Retourne les 5 personnes recommandées pour un projet donné
     * @param int $idProjet
     * @return array
     */
    public function getTop5ForProject($idProjet)
    {
        return $this->where('idproject', $idProjet)
                    ->orderBy('matching_score', 'DESC')
                    ->findAll();
    }
}