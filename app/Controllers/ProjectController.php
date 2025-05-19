<?php

namespace App\Controllers;

use App\Models\ProjectModel;
use CodeIgniter\Controller;
use Kreait\Firebase\Factory;
use Kreait\Firebase\Storage;


class ProjectController extends Controller
{

    public function index()
    {
        $projectModel = new ProjectModel();
        $data['projects'] = $projectModel->findAll();
        return view('projects/list', $data);
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
                // 'file' => 'required'

            ];
            $errors = [
                'name' => [
                    'required' => "Champ name ne doit pas etre vide"
                ],
                'description' => [
                    'required' => "Champ description ne doit pas etre vide"
                ],
                'datebegin' => [
                    'required' => "Champ date begin  ne doit pas etre vide",
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
                'remark' => [
                    'required' => "Champ remarque ne doit pas etre vide"
                ]
                // 'file' => [
                //     'required' => "Champ file ne doit pas etre vide"
                // ]
            ];
            if (!$this->validate($rules, $errors)) {
                return view('projects/create', [
                    "validation" => $this->validator,
                ]);
            }

            try {
                $projectModel = new ProjectModel();
                $file = $this->request->getFile('file');
                $newName = null;
                if ($file->getSize() > 2097152) { // 2MB max
                    return redirect()->back()->with('error', 'Fichier trop volumineux');
                }
                if ($file->isValid() && !$file->hasMoved()) {
                    $newName = $file->getRandomName();
                    $file->move(WRITEPATH . 'uploads', $newName);
                }

                // No need to format dates - HTML date input already sends Y-m-d format
                $data = [
                    'name' => $this->request->getPost('name'),
                    'description' => $this->request->getPost('description'),
                    'datebegin' => $this->request->getPost('datebegin'), // match form field name
                    'dateend' => $this->request->getPost('dateend'),     // match form field name
                    'nbrperson' => $this->request->getPost('nbrperson'), // match form field name
                    'remark' => $this->request->getPost('remark'),
                    'file' => $newName,
                ];

                $projectModel->insert($data);

                return redirect()->to(base_url('projects'));
            } catch (\Exception $e) {
                return view('projects/create', [
                    "validation" => $this->validator,
                    "error" => $e->getMessage()
                ]);
            }
        }

        return redirect()->to(base_url('projects'));
    }

    public function download($filename)
    {
        $path = WRITEPATH . 'uploads/' . $filename;

        if (!file_exists($path)) {
            return redirect()->back()->with('error', 'Fichier non trouvé');
        }

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
        return view('projects/fiche', ['project' => $project]);
    }

    public function delete($id)
    {
        $projectModel = new ProjectModel();
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
