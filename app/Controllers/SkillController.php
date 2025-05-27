<?php

namespace App\Controllers;

use App\Models\SkillModel;
use CodeIgniter\Controller;

class SkillController extends Controller
{
    public function index()
    {
        $skillModel = new SkillModel();
        $skills = $skillModel->findAll();
        return $this->response->setJSON(['skills' => $skills]);
    }



    public function store()
    {
        if ($this->request->getMethod(true) === 'POST') {
            // Accepte JSON ou POST classique
            $input = $this->request->getJSON(true) ?: $this->request->getPost();

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
                return $this->response->setJSON([
                    "validation" => $this->validator->getErrors(),
                ])->setStatusCode(400);
            } else {
                try {
                    $skillModel = new SkillModel();
                    $skill = $skillModel->check_if_already_exist($input['name'], $input['category']);
                    if (empty($skill)) {
                        $id = $skillModel->insert($input);
                        $createdSkill = $skillModel->find($id);
                        return $this->response->setJSON([
                            "message" => "Skill créé avec succès",
                            "skill" => $createdSkill
                        ])->setStatusCode(201);
                    } else {
                        return $this->response->setJSON([
                            "error" => "Ce skill existe déjà."
                        ])->setStatusCode(409);
                    }
                } catch (\Exception $e) {
                    return $this->response->setJSON([
                        "error" => $e->getMessage()
                    ])->setStatusCode(500);
                }
            }
        }
        return $this->response->setStatusCode(405); // Méthode non autorisée
    }

    public function checkExist()
    {
        $name = $this->request->getGet('name');
        $category = $this->request->getGet('category');

        if (!$name) {
            return $this->response->setJSON(['exists' => false, 'error' => 'Missing name parameter'])->setStatusCode(400);
        }

        $skillModel = new \App\Models\SkillModel();
        $result = $skillModel->check_if_already_exist($name, $category);

        return $this->response->setJSON(['exists' => !empty($result)]);
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
        return  $this->response->setStatusCode(201);
    }
}
