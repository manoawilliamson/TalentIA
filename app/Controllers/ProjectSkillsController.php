<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\ProjectSkillsModel;
use App\Models\SkillModel;

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
        $id = $this->request->getPost('id');
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
                "projectId" => $id,
                "skills" => $skillModel->findAll()
            ]);
        }

        try {
            $projectSkillsModel = new ProjectSkillsModel();
            $data = [
                'idproject' => $id,
                'idskills' => $this->request->getPost('idskills'),
                'noteskills' => $this->request->getPost('noteskills')
            ];

            $existingSkill = $projectSkillsModel->where('idproject', $id)
                ->where('idskills', $this->request->getPost('idskills'))
                ->first();

            if (!$existingSkill) {
                $projectSkillsModel->insert($data);
                return redirect()->to(base_url('projects/fiche/' . $id));
            } else {
                $skillModel = new SkillModel();
                return view('projectskills/create', [
                    "validation" => $this->validator,
                    "projectId" => $id,
                    "skills" => $skillModel->findAll(),
                    "error" => "Cette compétence est déjà associée à ce projet."
                ]);
            }
        } catch (\Exception $e) {
            $skillModel = new SkillModel();
            return view('projectskills/create', [
                "validation" => $this->validator,
                "projectId" => $id,
                "skills" => $skillModel->findAll(),
                "error" => $e->getMessage()
            ]);
        }
    }
}
