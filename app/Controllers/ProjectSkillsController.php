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
    // Accepte JSON ou x-www-form-urlencoded
    $input = $this->request->getJSON(true) ?? $this->request->getPost();

    $rules = [
        'idprojet' => 'required',
        'idskills' => 'required',
        'noteskills' => 'required|integer|greater_than[0]'
    ];
    $errors = [
        'idprojet' => [
            'required' => "Champ projet requis"
        ],
        'idskills' => [
            'required' => "Champ skills ne doit pas être vide"
        ],
        'noteskills' => [
            'required' => "Champ note skills ne doit pas être vide",
            'integer' => "Note skills doit être un nombre entier",
            'greater_than' => "Note skills doit être un nombre entier positif"
        ]
    ];

    if (!$this->validate($rules, $errors)) {
        return $this->response->setJSON([
            "validation" => $this->validator->getErrors()
        ])->setStatusCode(400);
    }

    try {
        $projectSkillsModel = new ProjectSkillsModel();

        // Vérifie si la compétence est déjà associée à ce projet
        $existingSkill = $projectSkillsModel
            ->where('idproject', $input['idprojet'])
            ->where('idskills', $input['idskills'])
            ->first();

        if ($existingSkill) {
            return $this->response->setJSON([
                "error" => "Cette compétence est déjà associée à ce projet."
            ])->setStatusCode(409);
        }

        $data = [
            'idproject' => $input['idprojet'],
            'idskills' => $input['idskills'],
            'noteskills' => $input['noteskills']
        ];

        $insertId = $projectSkillsModel->insert($data);
        if ($insertId) {
            $newSkill = $projectSkillsModel->find($insertId);
            return $this->response->setJSON([
                "message" => "Skill ajouté avec succès",
                "idproskills" => $insertId,
                "skill" => $newSkill
            ])->setStatusCode(201);
        } else {
            return $this->response->setJSON([
                "error" => "Erreur lors de l'insertion"
            ])->setStatusCode(500);
        }
    } catch (\Exception $e) {
        return $this->response->setJSON([
            "error" => $e->getMessage()
        ])->setStatusCode(500);
    }
}

    public function list($id)
    {
        $v_projectSkillsModel = new V_ProjectSkillsModel();
        $data = $v_projectSkillsModel->getSkillsForProject($id);
        return view('projectskills/list', ['proskills' => $data]);
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
        $method = $this->request->getMethod(true);
        if ($method !== 'PUT' && $method !== 'PATCH') {
            return $this->response->setJSON([
                "error" => "Méthode non autorisée"
            ])->setStatusCode(405);
        }

        $input = $this->request->getJSON(true);

        $rules = [
            'noteskills' => 'required|integer|greater_than[0]'
        ];
        $errors = [
            'noteskills' => [
                'required' => "Champ note skills ne doit pas être vide",
                'integer' => "Note skills doit être un nombre entier",
                'greater_than' => "Note skills doit être un nombre entier positif"
            ]
        ];

        if (!$this->validate($rules, $errors)) {
            return $this->response->setJSON([
                "validation" => $this->validator->getErrors(),
            ])->setStatusCode(400);
        }

        $projectSkillsModel = new ProjectSkillsModel();
        // Recherche la ligne à modifier par idprojet ET idskills
        $projectSkill = $projectSkillsModel
            ->where('idproject', $idprojet)
            ->where('idskills', $idskills)
            ->first();

        if (!$projectSkill) {
            return $this->response->setJSON([
                "error" => "Skill non trouvé pour ce projet"
            ])->setStatusCode(404);
        }

        // Met à jour la note
        $projectSkillsModel
            ->where('idproject', $idprojet)
            ->where('idskills', $idskills)
            ->set(['noteskills' => $input['noteskills']])
            ->update();
        $updated = $projectSkillsModel
            ->where('idproject', $idprojet)
            ->where('idskills', $idskills)
            ->first();

        return $this->response->setJSON([
            "message" => "Skill modifié avec succès",
            "skill" => $updated
        ])->setStatusCode(200);
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
