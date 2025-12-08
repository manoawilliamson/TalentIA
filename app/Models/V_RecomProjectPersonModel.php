<?php

namespace App\Models;

use CodeIgniter\Model;

class V_RecomProjectPersonModel extends Model
{
    protected $table = 'v_recommendation_project_person_top5';

    /**
     * Retourne les 5 projets recommandés pour une personne donnée
     * @param int $idPerson
     * @return array
     */
    public function getTop5ForPerson($idPerson)
    {
        return $this->where('idperson', $idPerson)
                    ->orderBy('matching_score', 'DESC')
                    ->findAll();
    }
}
