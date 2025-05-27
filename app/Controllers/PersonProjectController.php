<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonProjectModel;
use CodeIgniter\Controller;
use App\Models\SkillModel;
use App\Models\V_PersonSkillsModel;

class PersonProjectController extends Controller
{
    public function index($projecId)
    {

        $personModel = new PersonModel();
        $data = [
            'persons' => $personModel->findAll(),
            'projecId' => $projecId
        ];
        return view('personprojects/create', $data);
    }

    public function store()
    {
        $idproject= $this->request->getPost('idproject');
        $rules = [
            'idproject' => 'required'
        ];
        $errors = [
            'idproject' => [
                'required' => "Champ skills ne doit pas etre vide"
            ]
        ];

        if (!$this->validate($rules, $errors)) {
            $personModel = new PersonModel();
            return view('personprojects/create', [
                "validation" => $this->validator,
                "idproject" => $idproject,
                "persons" => $personModel->findAll()
            ]);
        }

        try {
            $personProjectModel = new PersonProjectModel();
            $data = [
                'idproject' => $idproject,
                'idskill' => $this->request->getPost('idskills')
            ];

            $personProjectModel->insert($data);
            return redirect()->to(base_url('project/fiche/' . $idproject));
        } catch (\Exception $e) {
            $personModel = new PersonModel();
            return view('projectskills/create', [
                "validation" => $this->validator,
                "idproject" => $idproject,
                "person" => $personModel->findAll(),
                "error" => $e->getMessage()
            ]);
        }
    }
}
