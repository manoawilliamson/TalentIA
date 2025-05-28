<?php

namespace App\Controllers;

use App\Models\ProjectModel;
use App\Models\V_ProjectSkillsModel;
use CodeIgniter\Controller;


class ProjectController extends Controller
{

    public function index()
    {
        $projectModel = new ProjectModel();
        $data = $projectModel->findAll();
        return $this->response->setJSON(['projects' => $data]);
    }

    public function create()
    {
        return view('projects/create');  // Load create skill form
    }

    public function store()
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'description' => 'required',
                'datebegin' => 'required',
                'dateend' => 'required',
                'nbrperson' => 'required|integer|greater_than[0]',
                'remark' => 'required'
            ];

            if (!$this->validate($rules)) {
                // Si c'est une requête AJAX/API (React), retourne JSON
                if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
                    return $this->response->setStatusCode(422)
                        ->setJSON(['errors' => $this->validator->getErrors()]);
                }
                // Sinon, retourne la vue classique avec erreurs
                return view('projects/create', [
                    "validation" => $this->validator,
                ]);
            }

            try {
                $projectModel = new ProjectModel();
                $file = $this->request->getFile('file');
                $newName = null;

                if ($file && $file->isValid() && !$file->hasMoved()) {
                    if ($file->getSize() > 2097152) { // 2MB max
                        $errorMsg = 'Fichier trop volumineux';
                        if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
                            return $this->response->setStatusCode(400)
                                ->setJSON(['error' => $errorMsg]);
                        }
                        return redirect()->back()->with('error', $errorMsg);
                    }
                    $newName = $file->getRandomName();
                    $file->move(WRITEPATH . 'uploads', $newName);
                }

                $data = [
                    'name' => $this->request->getPost('name'),
                    'description' => $this->request->getPost('description'),
                    'datebegin' => $this->request->getPost('datebegin'),
                    'dateend' => $this->request->getPost('dateend'),
                    'nbrperson' => $this->request->getPost('nbrperson'),
                    'remark' => $this->request->getPost('remark'),
                    'file' => $newName,
                ];

                if (!$projectModel->insert($data)) {
                    $errorMsg = 'Erreur lors de l\'insertion';
                    if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
                        return $this->response->setStatusCode(500)
                            ->setJSON(['error' => $errorMsg]);
                    }
                    return view('projects/create', [
                        "validation" => $this->validator,
                        "error" => $errorMsg
                    ]);
                }

                // Succès : JSON pour API, redirect pour HTML
                if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
                    return $this->response->setStatusCode(201)
                        ->setJSON(['success' => true, 'project' => $data]);
                }
                return redirect()->to(base_url('projects'));
            } catch (\Throwable $e) {
                $errorMsg = $e->getMessage();
                if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
                    return $this->response->setStatusCode(500)
                        ->setJSON(['error' => $errorMsg]);
                }
                return view('projects/create', [
                    "validation" => $this->validator,
                    "error" => $errorMsg
                ]);
            }
        }

        // Si ce n'est pas un POST, retourne la vue classique
        return view('projects/create');
    }


    public function download($filename)
    {
        $path = WRITEPATH . 'uploads/' . $filename;

        if (!file_exists($path)) {
            return $this->response->setStatusCode(404)->setJSON([
                'status' => 'error',
                'message' => 'Fichier non trouvé'
            ]);
        }

        // Pour forcer le téléchargement (Content-Disposition: attachment)
        return $this->response->download($path, null);
    }

    public function edit($id)
    {
        $projectModel = new ProjectModel();
        $data['project'] = $projectModel->find($id);
        return view('projects/edit', $data);
    }

    public function update($id)
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'description' => 'required',
                'datebegin' => 'required',
                'dateend' => 'required',
                'nbrperson' => 'required|integer|greater_than[0]',
                'remark' => 'required'
            ];

            $errors = [
                'name' => ['required' => "Champ name ne doit pas etre vide"],
                'description' => ['required' => "Champ description ne doit pas etre vide"],
                'datebegin' => [
                    'required' => "Champ date begin ne doit pas etre vide",
                    'valid_date' => "Date begin doit être valide et au format mm/jj/aaaa"
                ],
                'dateend' => [
                    'required' => "Champ date end ne doit pas etre vide",
                    'valid_date' => "Date end doit être valide et au format mm/jj/aaaa"
                ],
                'nbrperson' => [
                    'required' => "Champ number person ne doit pas etre vide",
                    'integer' => "Number person doit être un nombre entier",
                    'greater_than' => "Number person doit être un nombre entier positif"
                ],
                'remark' => ['required' => "Champ remarque ne doit pas etre vide"]
            ];

            if (!$this->validate($rules, $errors)) {
                $projectModel = new ProjectModel();
                $project = $projectModel->find($id);
                return view('projects/edit', [
                    "validation" => $this->validator,
                    "project" => $project
                ]);
            }

            try {
                $projectModel = new ProjectModel();
                $project = $projectModel->find($id);
                $file = $this->request->getFile('file');
                $newName = $project['file'] ?? null;

                if ($file && $file->isValid() && !$file->hasMoved()) {
                    if ($newName && file_exists(WRITEPATH . 'uploads/' . $newName)) {
                        unlink(WRITEPATH . 'uploads/' . $newName);
                    }
                    $newName = $file->getRandomName();
                    $file->move(WRITEPATH . 'uploads', $newName);
                }

                $data = [
                    'name' => $this->request->getPost('name'),
                    'description' => $this->request->getPost('description'),
                    'datebegin' => $this->request->getPost('datebegin'),
                    'dateend' => $this->request->getPost('dateend'),
                    'nbrperson' => $this->request->getPost('nbrperson'),
                    'remark' => $this->request->getPost('remark'),
                    'file' => $newName,
                ];

                $projectModel->update($id, $data);
                return redirect()->to(base_url('projects'));
            } catch (\Exception $e) {
                $projectModel = new ProjectModel();
                $project = $projectModel->find($id);
                return view('projects/edit', [
                    "validation" => $this->validator,
                    "project" => $project,
                    "error" => $e->getMessage()
                ]);
            }
        }

        return redirect()->to(base_url('projects'));
    }

    public function detail($id)
    {
        $projectModel = new ProjectModel();
        $project = $projectModel->find($id);

        $v_projectSkillsModel = new V_ProjectSkillsModel();
        $proskills = $v_projectSkillsModel->getSkillsForProject($id);

        // Si la requête attend du JSON (API/AJAX)
        if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
            return $this->response->setStatusCode(200)
                ->setJSON([
                    'project' => $project,
                    'proskills' => $proskills
                ]);
        }

        // Sinon, retourne la vue classique
        return view('projects/fiche', ['project' => $project, 'proskills' => $proskills]);
    }

    public function delete($id)
    {
        $projectModel = new ProjectModel();

        // Si la requête attend du JSON (API/AJAX)
        if ($this->request->isAJAX() || $this->request->getHeaderLine('Accept') === 'application/json') {
            try {
                $deleted = $projectModel->delete($id);
                if ($deleted) {
                    return $this->response->setStatusCode(200)
                        ->setJSON(['success' => true, 'message' => 'Projet supprimé']);
                } else {
                    return $this->response->setStatusCode(404)
                        ->setJSON(['success' => false, 'message' => 'Projet non trouvé']);
                }
            } catch (\Throwable $e) {
                return $this->response->setStatusCode(500)
                    ->setJSON(['success' => false, 'error' => $e->getMessage()]);
            }
        }

        // Sinon, comportement classique (HTML)
        $projectModel->delete($id);
        return redirect()->to(base_url('/projects'));
    }



    // public function addTechDataToProject($id)
    // {
    //     $data = $this->request->getJSON(true);
    //     var_dump($data);
    //     // tokony hoe ny data tonga = 
    //     /**
    //      * 
    //      * project_id
    //      * skill_id
    //      * personnes_requis
    //      * niveau id
    //      * 
    //      */
    //     // Okay rehefa azo eto ito de mila mamorona resaka table ampidirana anzareo
    //     $prj = new ProjectModel();
    //     $prj->addTechDataToProject($id, $data);
    //     return $this->respond(['message' => 'Technologies ajoutée'], 200);
    // }

    // public function getStacksForProject( $id ){
    //     $projectData = (new ProjectModel())->getProjectWithStacks($id);
    //     return $this->respond(['skills' => $projectData], 200);
    // }

}
