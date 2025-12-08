<?php

namespace App\Controllers;

use App\Models\V_RecomPersonModel;
use App\Models\V_RecomProjectPersonModel;
use App\Models\V_ProjectAlertsModel;
use CodeIgniter\RESTful\ResourceController;

class RecommendationController extends ResourceController
{
    protected $format = 'json';

    public function getForProject($projectId)
    {
        $model = new V_RecomPersonModel();
        $data = $model->getTop5ForProject($projectId);
        return $this->respond($data);
    }

    public function getForPerson($personId)
    {
        $model = new V_RecomProjectPersonModel();
        $data = $model->getTop5ForPerson($personId);
        return $this->respond($data);
    }

    public function getProjectAlerts($projectId)
    {
        $model = new V_ProjectAlertsModel();
        $data = $model->getAlertsForProject($projectId);
        return $this->respond($data);
    }
}
