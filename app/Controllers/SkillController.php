<?php

namespace App\Controllers;

use App\Models\SkillModel;
use CodeIgniter\Controller;

class SkillController extends Controller
{
    public function index()
    {
        $skillModel = new SkillModel();
        $data['skills'] = $skillModel->findAll();
        return view('skills/index', $data);
    }

    public function create()
    {
        return view('skills/create');  // Load create skill form
    }

    public function store()
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'category' => 'required'
            ];
            $errors = [
                'name' => [
                    'required' => "Champ name ne doit pas etre vide"
                ],
                'category' => [
                    'required' => "Champ category ne doit pas etre vide"
                ]
            ];
            if (!$this->validate($rules, $errors)) {
                return view('skills/create', [
                    "validation" => $this->validator,
                ]);
            } else {
                try {
                    $skillModel = new SkillModel();
                    $data = [
                        'name'     => $this->request->getPost('name'),
                        'category'  => $this->request->getPost('category'),
                    ];
                    $skill = $skillModel->check_if_already_exist($data['name'], $data['category']);
                    if (!$skill) {
                        $skillModel->insert($data);
                    } else {
                        throw new \Exception("Ce skill existe deja.");
                    }
                } catch (\Exception $e) {
                    return view('skills/create', [
                        "validation" => $this->validator,
                        "error" => $e->getMessage()
                    ]);
                }
            }
        }
        return redirect()->to(base_url('/skills'));
    }

    public function save()
    {
        $data = $this->request->getJSON(true);
        $skillModel = new SkillModel();
        $skillModel->insert($data);
        return redirect()->to(base_url('/skills'));
    }

    public function edit($id)
    {
        $skillModel = new SkillModel();
        $data['skill'] = $skillModel->find($id);  // Find the skill by ID
        return view('skills/edit', $data);  // Load edit form with skill data
    }

    public function update($id)
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'category' => 'required'
            ];
            $errors = [
                'name' => [
                    'required' => "Champ name ne doit pas être vide"
                ],
                'category' => [
                    'required' => "Champ category ne doit pas être vide"
                ]
            ];

            if (!$this->validate($rules, $errors)) {
                $skillModel = new SkillModel();
                $skill = $skillModel->find($id);

                return view('skills/edit', [
                    "validation" => $this->validator,
                    "skill" => $skill
                ]);
            } else {
                try {
                    $skillModel = new SkillModel();
                    $data = [
                        'name'     => $this->request->getPost('name'),
                        'category' => $this->request->getPost('category'),
                    ];

                    $skills = $skillModel->check_if_already_exist($data['name'], $data['category']);
                    if (!$skills) {
                        $skillModel->update($id, $data);
                        return redirect()->to('skills');
                    } else {
                        return view('skills/edit', [
                            'error' => 'Cette compétence existe déjà.',
                            'skill' => ['id' => $id, 'name' => $data['name'], 'category' => $data['category']]
                        ]);
                    }
                } catch (\Exception $e) {
                    return view('skills/edit', [
                        'error' => 'Une erreur est survenue : ' . $e->getMessage(),
                        'skill' => ['id' => $id, 'name' => $this->request->getPost('name'), 'category' => $this->request->getPost('category')]
                    ]);
                }
            }
        }
    }


    public function delete($id)
    {
        $skillModel = new SkillModel();
        $skillModel->delete($id);
        return redirect()->to(base_url('/skills'));
    }
}
