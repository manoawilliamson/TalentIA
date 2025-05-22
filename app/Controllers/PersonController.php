<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonSkillsModel;
use App\Models\V_PersonSkillsModel;
use CodeIgniter\Controller;
use DateTime;

class PersonController extends Controller
{
    public function index()
    {
        $personModel = new PersonModel();
        $data['persons'] = $personModel->findAll();
        return view('person/list', $data);
    }

    public function create()
    {
        return view('person/create');
    }

    public function store()
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'firstname' => 'required',
                'birthday' => 'required|valid_date',
                'address' => 'required',
                'email' => 'required|valid_email',
                'telephone' => 'required|numeric|exact_length[10]|number_prefix'

            ];
            
            $errors = [
                'name' => [
                    'required' => "Champ name ne doit pas être vide"
                ],
                'firstname' => [
                    'required' => "Champ firstname ne doit pas être vide"
                ],
                'birthday' => [
                    'required' => "Champ birthday ne doit pas être vide",
                    'valid_date' => "Date de naissance invalide"
                ],
                'address' => [
                    'required' => "Champ address ne doit pas être vide"
                ],
                'email' => [
                    'required' => "Champ email ne doit pas être vide",
                    'valid_email' => "Champ email n'est pas valide"
                ],
                'telephone' => [
                'required' => "Champ telephone ne doit pas être vide",
                'numeric' => "Champ telephone invalide",
                'exact_length' => "Le numéro doit contenir exactement 10 chiffres",
                'number_prefix' => "Le telephone doit commencer par 034, 038, 032, 037 ou 033"
                ]
            ];
            if (!$this->validate($rules, $errors)) {
                return view('person/create', [
                    "validation" => $this->validator,
                ]);
            }

            $birthday = $this->request->getPost('birthday');
            $birthdayDate = new DateTime($birthday);
            $today = new DateTime();
            $age = $today->diff($birthdayDate)->y;
            
            if ($age < 18) {
                return view('person/create', [
                    "validation" => $this->validator,
                    "error" => "Vous êtes en dessous de 18 ans, vous ne pouvez pas vous inscrire."
                ]);
            }

            try {
                $personModel = new PersonModel();
                $data = [
                    'name' => $this->request->getPost('name'),
                    'firstname' => $this->request->getPost('firstname'),
                    'birthday' => $birthday,
                    'address' => $this->request->getPost('address'),
                    'email' => $this->request->getPost('email'),
                    'telephone' => $this->request->getPost('telephone'),
                ];

                $person = $personModel->check_if_already_exist($data['email'], $data['telephone']);
                if ($person) {
                    throw new \Exception("Votre email et téléphone sont déjà associés à un compte.");
                }
                $personModel->createPerson($data);
                return redirect()->to('/person');

            } catch (\Exception $e) {
                return view('person/create', [
                    "validation" => $this->validator,
                    "error" => $e->getMessage()
                ]);
            }
        }
    }

    public function edit($id)
    {
        $personModel = new PersonModel();
        $data['person'] = $personModel->find($id);
        return view('person/edit', $data);
    }

    public function update($id)
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'name' => 'required',
                'firstname' => 'required',
                'birthday' => 'required|valid_date',
                'address' => 'required',
                'email' => 'required|valid_email',
                'telephone' => 'required|numeric|exact_length[10]|number_prefix'
            ];
            
            $errors = [
                'name' => [
                    'required' => "Champ name ne doit pas être vide"
                ],
                'firstname' => [
                    'required' => "Champ firstname ne doit pas être vide"
                ],
                'birthday' => [
                    'required' => "Champ birthday ne doit pas être vide",
                    'valid_date' => "Date de naissance invalide"
                ],
                'address' => [
                    'required' => "Champ address ne doit pas être vide"
                ],
                'email' => [
                    'required' => "Champ email ne doit pas être vide",
                    'valid_email' => "Champ email n'est pas valide"
                ],
                'telephone' => [
                'required' => "Champ telephone ne doit pas être vide",
                'numeric' => "Champ telephone invalide",
                'exact_length' => "Le numéro doit contenir exactement 10 chiffres",
                'number_prefix' => "Le telephone doit commencer par 034, 038, 032, 037 ou 033"
                ]
            ];

            if (!$this->validate($rules, $errors)) {
                return view('person/create', [
                    "validation" => $this->validator,
                ]);
            }
            $birthday = $this->request->getPost('birthday');
            $birthdayDate = new DateTime($birthday);
            $today = new DateTime();
            $age = $today->diff($birthdayDate)->y;
            
            if ($age < 18) {
                return view('person/create', [
                    "validation" => $this->validator,
                    "error" => "Vous êtes en dessous de 18 ans, vous ne pouvez pas vous inscrire."
                ]);
            }

            try {
                $personModel = new PersonModel();
                $data = [
                    'name' => $this->request->getPost('name'),
                    'firstname' => $this->request->getPost('firstname'),
                    'birthday' => $birthday,
                    'address' => $this->request->getPost('address'),
                    'email' => $this->request->getPost('email'),
                    'telephone' => $this->request->getPost('telephone'),
                ];

                // $person = $personModel->check_if_already_exist($data['email'], $data['telephone']);
                // if ($person) {
                //     throw new \Exception("Votre email et téléphone sont déjà associés à un compte.");
                // }
                $personModel->update($id,$data);
                return redirect()->to('/person');

            } catch (\Exception $e) {
                return view('person/create', [
                    "validation" => $this->validator,
                    "error" => $e->getMessage()
                ]);
            }
        }
    }

    public function delete($id)
    {
        $personModel = new PersonModel();
        $personModel->delete($id);
        $personskillsModel = new PersonSkillsModel();
        $personskillsModel->where('idperson', $id)->delete();
        return redirect()->to(base_url('/person'));
    }

    public function detail($id)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);

        $v_personSkillsModel = new V_PersonSkillsModel();
        $data = $v_personSkillsModel->getSkillsPerson( $id);
        // var_dump($data);
        return view('person/fiche', ['person' => $person, 'personskills' => $data]);
    }
}