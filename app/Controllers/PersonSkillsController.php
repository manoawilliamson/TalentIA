<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonSkillsModel;
use CodeIgniter\Controller;
use App\Models\SkillModel;
use App\Models\V_PersonSkillsModel;
use CodeIgniter\API\ResponseTrait;

class PersonSkillsController extends Controller
{
    use ResponseTrait;
    public function index($personId)
    {

        $skillModel = new SkillModel();
        $data = [
            'skills' => $skillModel->findAll(),
            'personId' => $personId
        ];
        return view('personskills/create', $data);
    }
    public function detail($id)
    {
        $v_personSkillsModel = new V_PersonSkillsModel();
        $skills = $v_personSkillsModel->getSkillsPerson($id);
        return $this->response->setJSON(['personskills' => $skills]);
    }



    public function store()
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'idperson'   => 'required|integer',
            'idskills'   => 'required|integer',
            'noteskills' => 'required|integer|greater_than[0]',
        ];
        $errors = [
            'idperson' => [
                'required' => "Champ personne obligatoire",
                'integer'  => "ID personne invalide"
            ],
            'idskills' => [
                'required' => "Champ skills ne doit pas etre vide",
                'integer'  => "ID skill invalide"
            ],
            'noteskills' => [
                'required'     => "Champ note skills ne doit pas etre vide",
                'integer'      => "Note skills doit être un nombre entier",
                'greater_than' => "Note skills doit être un nombre entier positif"
            ]
        ];

        if (!$this->validate($rules, $errors)) {
            return $this->respond([
                'status' => 'error',
                'validation' => $this->validator->getErrors()
            ], 400);
        }

        try {
            $personSkillsModel = new PersonSkillsModel();
            $data = [
                'idperson'  => $input['idperson'],
                'idskill'   => $input['idskills'],   // colonne DB: idskill
                'noteskill' => $input['noteskills'], // colonne DB: noteskill
            ];
            $personSkillsModel->insert($data);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Skill ajouté avec succès',
                'data'    => $data
            ], 201);
        } catch (\Exception $e) {
            return $this->respond([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function update($id = null)
    {
        $input = $this->request->getJSON(true) ?? $this->request->getPost();

        $rules = [
            'idperson'   => 'required|integer',
            'idskill'    => 'required|integer',
            'noteskill'  => 'required|integer',
        ];
        $errors = [
            'idperson' => [
                'required' => "Champ personne obligatoire",
                'integer'  => "ID personne invalide"
            ],
            'idskill' => [
                'required' => "Champ skills ne doit pas etre vide",
                'integer'  => "ID skill invalide"
            ],
            'noteskill' => [
                'required'     => "Champ note skills ne doit pas etre vide",
                'integer'      => "Note skills doit être un nombre entier"
            ]
        ];

        if (!$this->validate($rules, [
            'idperson'  => $input['idperson'] ?? null,
            'idskill'   => $input['idskill'] ?? null,
            'noteskill' => $input['noteskill'] ?? null,
        ])) {
            return $this->respond([
                'status' => 'error',
                'validation' => $this->validator->getErrors()
            ], 400);
        }

        try {
            $personSkillsModel = new PersonSkillsModel();
            $data = [
            'idperson'  => (int)$input['idperson'],
            'idskill'   => (int)$input['idskill'],
            'noteskill' => (int)$input['noteskill'], // Conversion explicite en int
        ];

            $personSkillsModel->insert($data);

            return $this->respond([
                'status'  => 'success',
                'message' => 'Nouvelle note insérée pour ce skill',
                'data'    => $data
            ], 201);
        } catch (\Exception $e) {
            return $this->respond([
                'status'  => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function history($id)
{
    $personModel = new PersonModel();
    $person = $personModel->find($id);

    if (!$person) {
        return $this->response->setJSON([
            'error' => 'Personne non trouvée'
        ])->setStatusCode(404);
    }

    $v_personSkillsModel = new V_PersonSkillsModel();
    $data = [
        'person' => $person,
        'personskills' => $v_personSkillsModel->getHistorySkillsPerson($id),
        'monthlyAverages' => $v_personSkillsModel->getMonthlySkillAverages($id)
    ];

    return $this->response->setJSON($data)->setStatusCode(200);
}

    public function historys($id)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);

        if (!$person) {
            return $this->response->setJSON([
                'error' => 'Personne non trouvée'
            ])->setStatusCode(404);
        }

        $v_personSkillsModel = new V_PersonSkillsModel();
        $data = [
            // 'persons' => $person,
            'personskills' => $v_personSkillsModel->getHistorySkillsPerson($id),
            'monthlyAverages' => $v_personSkillsModel->getMonthlySkillAverages($id)
        ];

        return $this->response->setJSON($data)->setStatusCode(200);
    }
}
