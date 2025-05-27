<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonSkillsModel;
use CodeIgniter\Controller;
use App\Models\SkillModel;
use App\Models\V_PersonSkillsModel;

class PersonSkillsController extends Controller
{
    public function index($personId)
    {

        $skillModel = new SkillModel();
        $data = [
            'skills' => $skillModel->findAll(),
            'personId' => $personId
        ];
        return view('personskills/create', $data);
    }

    public function store()
    {
        $idperson = $this->request->getPost('idperson');
        $rules = [
            'noteskills' => 'required|integer|greater_than[0]',
            'idskills' => 'required'
        ];
        $errors = [
            'noteskills' => [
                'required' => "Champ note skills ne doit pas etre vide",
                'integer' => "Note skills doit être un nombre entier",
                'greater_than' => "Note skills doit être un nombre entier positif"
            ],
            'idskills' => [
                'required' => "Champ skills ne doit pas etre vide"
            ]
        ];

        if (!$this->validate($rules, $errors)) {
            $skillModel = new SkillModel();
            return view('projectskills/create', [
                "validation" => $this->validator,
                "personId" => $idperson,
                "skills" => $skillModel->findAll()
            ]);
        }

        try {
            $personSkillsModel = new PersonSkillsModel();
            $data = [
                'idperson' => $idperson,
                'idskill' => $this->request->getPost('idskills'),
                'noteskill' => $this->request->getPost('noteskills'),
            ];

            $personSkillsModel->insert($data);
            return redirect()->to(base_url('person/fiche/' . $idperson));
        } catch (\Exception $e) {
            $skillModel = new SkillModel();
            return view('projectskills/create', [
                "validation" => $this->validator,
                "person" => $idperson,
                "skills" => $skillModel->findAll(),
                "error" => $e->getMessage()
            ]);
        }
    }
    public function history($id)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);

        $v_personSkillsModel = new V_PersonSkillsModel();
        $data = [
            'person' => $person,
            'personskills' => $v_personSkillsModel->getHistorySkillsPerson($id),
            'monthlyAverages' => $v_personSkillsModel->getMonthlySkillAverages($id)
        ];
        // var_dump($data);
        return view('person/history', $data);
    }
}
