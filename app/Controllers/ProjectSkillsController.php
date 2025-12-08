<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\ProjectSkillsModel;
use App\Models\SkillModel;
use App\Models\V_ProjectSkillsModel;

class ProjectSkillsController extends Controller
{
    public function index($projectId)
    {

        $skillModel = new SkillModel();
        $data = [
            'skills' => $skillModel->findAll(),
            'projectId' => $projectId
        ];
        return view('projectskills/create', $data);
    }

 
    public function store()
    {
        $input = $this->request->getJSON();

        $data = [
            'idproject'  => $input->idproject,
            'idskills'   => $input->idskills,
            'noteskills' => $input->noteskills,
        ];

        $projectSkillsModel = new ProjectSkillsModel();
        $projectSkillsModel->insert($data);

        return $this->response->setJSON($data);
    }

    public function list($id)
    {
        $v_projectSkillsModel = new V_ProjectSkillsModel();
        $data = $v_projectSkillsModel->getSkillsForProject($id);

        return $this->response->setJSON($data);
    }

    public function edit($idskill, $idproject)
    {
        $v_projectSkillsModel = new V_ProjectSkillsModel();
        $data['proskills'] = $v_projectSkillsModel->where('idprojet', $idproject)
            ->where('idskills', $idskill)
            ->first();
        return view('projectskills/edit', $data);
    }



    public function update($idprojet, $idskills)
    {
        $input = $this->request->getJSON();

        $data = [
            'noteskills' => $input->noteskills,
        ];

        $projectSkillsModel = new ProjectSkillsModel();
        $projectSkillsModel
            ->where('idproject', $idprojet)
            ->where('idskills', $idskills)
            ->set($data)
            ->update();

        return $this->response->setJSON($data);
    }

    public function delete($idprojet, $idskills)
{
    if ($this->request->getMethod(true) !== 'DELETE') {
        return $this->response->setJSON([
            "error" => "Méthode non autorisée"
        ])->setStatusCode(405);
    }

    $projectSkillsModel = new ProjectSkillsModel();
    $deleted = $projectSkillsModel
        ->where('idproject', $idprojet)
        ->where('idskills', $idskills)
        ->delete();

    if ($deleted) {
        return $this->response->setJSON([
            "message" => "Skill supprimé du projet avec succès"
        ])->setStatusCode(200);
    } else {
        return $this->response->setJSON([
            "error" => "Aucune correspondance trouvée"
        ])->setStatusCode(404);
    }
}
}
