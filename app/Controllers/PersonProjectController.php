<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonProjectModel;
use App\Models\V_PersonProjectModel;
use CodeIgniter\Controller;
use App\Models\V_RecomPersonModel;

class PersonProjectController extends Controller
{
    public function show($idproject)
    {
        $model = new V_PersonProjectModel();
        $result = $model->getPersonsByProject($idproject);

        return $this->response->setJSON([
            'persons' => $result
        ]);
    }



public function store()
{
    // Accepte JSON ou x-www-form-urlencoded
    $input = $this->request->getJSON(true) ?? $this->request->getPost();

    $rules = [
        'idprojet' => 'required',
        'idperson' => 'required'
    ];
    $errors = [
        'idprojet' => [
            'required' => "Champ projet requis"
        ],
        'idskills' => [
            'idperson' => "Champ skills ne doit pas être vide"
        ]
    ];

    if (!$this->validate($rules, $errors)) {
        return $this->response->setJSON([
            "validation" => $this->validator->getErrors()
        ])->setStatusCode(400);
    }

    try {
        $personProjectModel = new PersonProjectModel();

        // Vérifie si la personne est déjà associée à ce projet
        $existingSkill = $personProjectModel
            ->where('idproject', $input['idprojet'])
            ->where('idperson', $input['idperson'])
            ->first();

        if ($existingSkill) {
            return $this->response->setJSON([
                "error" => "Personne déjà associée à ce projet."
            ])->setStatusCode(409);
        }

        // Vérifie le nombre de personnes déjà assignées au projet
        $currentCount = $personProjectModel
            ->where('idproject', $input['idprojet'])
            ->countAllResults();

        // Récupère la limite depuis le projet
        $projectModel = new \App\Models\ProjectModel();
        $project = $projectModel->find($input['idprojet']);
        if (!$project) {
            return $this->response->setJSON([
                "error" => "Projet introuvable."
            ])->setStatusCode(404);
        }
        $maxPerson = isset($project['nbrperson']) ? (int)$project['nbrperson'] : 0;

        if ($maxPerson > 0 && $currentCount >= $maxPerson) {
            return $this->response->setJSON([
                "error" => "Le nombre maximum de personnes pour ce projet est déjà atteint."
            ])->setStatusCode(400);
        }

        $data = [
            'idproject' => $input['idprojet'],
            'idperson' => $input['idperson']
        ];

        $insertId = $personProjectModel->insert($data);
        if ($insertId) {
            $newPerson = $personProjectModel->find($insertId);
            return $this->response->setJSON([
                "message" => "Personne ajouté avec succès",
                "idpersonproject" => $insertId,
                "personne" => $insertId
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

    public function recommendation($idproject)
    {
        $recommendationModel = new V_RecomPersonModel();
        $result = $recommendationModel->getTop5ForProject($idproject);

        return $this->response->setJSON([
            'recommendations' => $result
        ]);
    }
}
