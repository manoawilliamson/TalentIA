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

    public function updateSkill($idskills)
    {
        if ($this->request->getMethod(true) === 'POST') {
            $idprojet = $this->request->getPost('idprojet');

            $rules = [
                'noteskills' => 'required|integer|greater_than[0]',
                'idskills' => 'required'
            ];
            $errors = [
                'noteskills' => [
                    'required' => "Champ note skills ne doit pas être vide",
                    'integer' => "Note skills doit être un nombre entier",
                    'greater_than' => "Note skills doit être un nombre entier positif"
                ],
                'idskills' => [
                    'required' => "Champ skills ne doit pas être vide"
                ]
            ];

            if (!$this->validate($rules, $errors)) {
                $v_projectSkillsModel = new V_ProjectSkillsModel();
                $data['proskills'] = $v_projectSkillsModel->where('idprojet', $idprojet)
                    ->where('idskills', $idskills)
                    ->first();
                return view('projectskills/edit', [
                    "validation" => $this->validator,
                    "proskills" => $data['proskills']
                ]);
            }

            try {
                $projectSkillsModel = new ProjectSkillsModel();
                $idskill = $this->request->getPost('idskills');
                $idprojet = $this->request->getPost('idprojet');
                $note = $this->request->getPost('noteskills');
                $existingSkill = $projectSkillsModel->where('idproject', $idprojet)
                    ->where('idskills', $idskill)
                    ->first();
                if (!$existingSkill) {
                    $projectSkillsModel->updateNoteSkill($idprojet, $idskill, $note);
                    return redirect()->to(base_url('projects/fiche/' . $idprojet));
                }
                else {
                    return view('projectskills/create', [
                "validation" => $this->validator
                ]);
                }

            } catch (\Exception $e) {
                return view('projectskills/edit', [
                    "validation" => $this->validator,
                    "error" => $e->getMessage()
                ]);
            }
        }
    }

    public function delete($idskill, $idproject)
    {
        $projectSkillsModel = new ProjectSkillsModel();
        $projectSkillsModel->deleteSkill($idproject, $idskill);
        return redirect()->to(base_url('projects/fiche/' . $idproject));
    }
}
