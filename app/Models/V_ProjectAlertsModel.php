<?php

namespace App\Models;

use CodeIgniter\Model;

class V_ProjectAlertsModel extends Model
{
    protected $table = 'v_project_alerts';

    /**
     * Retourne les alertes de compétences manquantes pour un projet
     * @param int $idProject
     * @return array
     */
    public function getAlertsForProject($idProject)
    {
        return $this->where('idproject', $idProject)->findAll();
    }
}
