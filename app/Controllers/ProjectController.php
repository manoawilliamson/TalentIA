<?php

namespace App\Controllers;

use App\Models\ProjectModel;
use App\Models\V_ProjectSkillsModel;
use App\Models\V_ProjectTimeAnalyseModel;
use CodeIgniter\Controller;


class ProjectController extends Controller
{


    public function index()
    {
        $projectModel = new ProjectModel();
        $data = $projectModel->orderBy('dateend', 'DESC')->findAll();
        return $this->response->setJSON(['projects' => $data]);
    }

    public function create()
    {
        return view('projects/create');  // Load create skill form
    }

    public function store()
    {
        if ($this->request->getMethod(true) === 'POST') {
            // Check if it's an API request (JSON)
            $isApi = strpos($this->request->getHeaderLine('Content-Type'), 'application/json') !== false ||
                     strpos($this->request->getHeaderLine('Accept'), 'application/json') !== false;

            $isJsonRequest = strpos($this->request->getHeaderLine('Content-Type'), 'application/json') !== false;

            if ($isApi && $isJsonRequest) {
                // For API, merge JSON data into POST data for validation
                $jsonData = $this->request->getJSON(true);
                $this->request->setGlobal('post', array_merge($this->request->getPost(), $jsonData));
            }

            $rules = [
                'name' => 'required',
                'description' => 'required',
                'datebegin' => 'required',
                'dateend' => 'required',
                'nbrperson' => 'required|integer|greater_than[0]'
            ];

            if (!$this->validate($rules)) {
                // Si c'est une requête AJAX/API (React), retourne JSON
                if ($isApi) {
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
                        if ($isApi) {
                            return $this->response->setStatusCode(400)
                                ->setJSON(['error' => $errorMsg]);
                        }
                        return redirect()->back()->with('error', $errorMsg);
                    }
                    $newName = $file->getRandomName();
                    $file->move(WRITEPATH . 'uploads', $newName);
                }

                $rawDateBegin = $isJsonRequest ? $this->request->getJSON()->datebegin : $this->request->getPost('datebegin');
                $rawDateEnd = $isJsonRequest ? $this->request->getJSON()->dateend : $this->request->getPost('dateend');
                
                // --- Auto-status calculation ---
                $today = date('Y-m-d');
                $status = 'PLANIFIÉ';
                if ($rawDateEnd < $today) {
                    $status = 'TERMINÉ';
                } elseif ($rawDateBegin <= $today) {
                    $status = 'EN_COURS';
                }
                // -------------------------------

                $data = [
                    'name' => $isJsonRequest ? $this->request->getJSON()->name : $this->request->getPost('name'),
                    'description' => $isJsonRequest ? $this->request->getJSON()->description : $this->request->getPost('description'),
                    'datebegin' => $rawDateBegin,
                    'dateend' => $rawDateEnd,
                    'nbrperson' => $isJsonRequest ? $this->request->getJSON()->nbrperson : $this->request->getPost('nbrperson'),
                    'remark' => $isJsonRequest ? $this->request->getJSON()->remark : $this->request->getPost('remark'),
                    'etat' => $status,
                    'file' => $newName,
                ];

                $insertedId = $projectModel->insert($data);
                
                if (!$insertedId) {
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
                        ->setJSON(['success' => true, 'id' => $insertedId, 'project' => $data]);
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
        $method = $this->request->getMethod(true);
        
        // Handle API requests (PUT with JSON)
        if ($method === 'PUT') {
            $input = $this->request->getJSON(true);
            
            $rules = [
                'name' => 'required',
                'description' => 'required',
                'datebegin' => 'required',
                'dateend' => 'required',
                'nbrperson' => 'required|integer|greater_than[0]'
            ];

            $this->request->setGlobal('post', $input);
            
            if (!$this->validate($rules)) {
                return $this->response->setStatusCode(422)
                    ->setJSON(['errors' => $this->validator->getErrors()]);
            }

            try {
                $projectModel = new ProjectModel();
                
                // --- Auto-status calculation ---
                $today = date('Y-m-d');
                $status = 'PLANIFIÉ';
                if ($input['dateend'] < $today) {
                    $status = 'TERMINÉ';
                } elseif ($input['datebegin'] <= $today) {
                    $status = 'EN_COURS';
                }
                // -------------------------------

                $data = [
                    'name' => $input['name'],
                    'description' => $input['description'],
                    'datebegin' => $input['datebegin'],
                    'dateend' => $input['dateend'],
                    'nbrperson' => $input['nbrperson'],
                    'remark' => $input['remark'],
                    'etat' => $status,
                ];

                $projectModel->update($id, $data);
                return $this->response->setStatusCode(200)
                    ->setJSON(['success' => true, 'message' => 'Projet mis à jour']);
            } catch (\Exception $e) {
                return $this->response->setStatusCode(500)
                    ->setJSON(['error' => $e->getMessage()]);
            }
        }
        
        // Handle traditional POST form requests
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'description' => 'required',
                'datebegin' => 'required',
                'dateend' => 'required',
                'nbrperson' => 'required|integer|greater_than[0]'
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
                ]
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

                $rawDateBegin = $this->request->getPost('datebegin');
                $rawDateEnd = $this->request->getPost('dateend');

                // --- Auto-status calculation ---
                $today = date('Y-m-d');
                $status = 'PLANIFIÉ';
                if ($rawDateEnd < $today) {
                    $status = 'TERMINÉ';
                } elseif ($rawDateBegin <= $today) {
                    $status = 'EN_COURS';
                }
                // -------------------------------

                $data = [
                    'name' => $this->request->getPost('name'),
                    'description' => $this->request->getPost('description'),
                    'datebegin' => $rawDateBegin,
                    'dateend' => $rawDateEnd,
                    'nbrperson' => $this->request->getPost('nbrperson'),
                    'remark' => $this->request->getPost('remark'),
                    'etat' => $status,
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
    public function count()
    {
         $projectModel = new ProjectModel();
        $total = $projectModel->countAll();
        return $this->response->setJSON(['count' => $total]);
    }
    public function countByPeriod($period = 'month')
    {
        $v_projectTimeAnalyseModel = new V_ProjectTimeAnalyseModel();
         $builder = $v_projectTimeAnalyseModel
            ->select('period_value, period_display, project_count')
            ->where('period_type', $period)
            ->orderBy('period_display', 'ASC');
        $results = $builder->get()->getResult();

        return $this->response->setJSON(['data' => $results]);
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

    public function startNow($id)
    {
        $projectModel = new ProjectModel();
        $project = $projectModel->find($id);
        
        if (!$project) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Projet non trouvé']);
        }

        $today = date('Y-m-d');
        $data = [
            'datebegin' => $today,
            'etat' => 'EN_COURS'
        ];

        try {
            $projectModel->update($id, $data);
            return $this->response->setStatusCode(200)->setJSON([
                'success' => true, 
                'message' => 'Projet démarré immédiatement',
                'new_status' => 'EN_COURS'
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON(['error' => $e->getMessage()]);
        }
    }

    public function terminateNow($id)
    {
        $projectModel = new ProjectModel();
        $project = $projectModel->find($id);

        if (!$project) {
            return $this->response->setStatusCode(404)->setJSON(['error' => 'Projet non trouvé']);
        }

        // To force termination today while respecting the trigger (which uses dateEnd < CURRENT_DATE for TERMINÉ)
        // we set dateEnd to yesterday.
        $yesterday = date('Y-m-d', strtotime('-1 day'));
        $data = [
            'dateend' => $yesterday,
            'etat' => 'TERMINÉ'
        ];

        try {
            $projectModel->update($id, $data);
            return $this->response->setStatusCode(200)->setJSON([
                'success' => true, 
                'message' => 'Projet terminé immédiatement',
                'new_status' => 'TERMINÉ'
            ]);
        } catch (\Exception $e) {
            return $this->response->setStatusCode(500)->setJSON(['error' => $e->getMessage()]);
        }
    }
}
