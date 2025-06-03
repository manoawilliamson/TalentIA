<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonSkillsModel;
use App\Models\V_PersonSkillsModel;
use App\Models\V_PersonStatsModel;
use CodeIgniter\RESTful\ResourceController;
use DateTime;

class PersonController extends ResourceController
{
    protected $format = 'json';

    public function index()
    {
        $personModel = new PersonModel();
        $persons = $personModel->findAll();
        return $this->respond($persons);
    }

    public function show($id = null)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);
        if (!$person) {
            return $this->failNotFound("Person not found");
        }
        return $this->respond($person);
    }

    public function create()
    {
        $rules = [
            'name' => 'required',
            'firstname' => 'required',
            'birthday' => 'required|valid_date',
            'address' => 'required',
            'email' => 'required|valid_email',
            'telephone' => 'required|numeric|exact_length[10]|number_prefix'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $birthday = $this->request->getVar('birthday');
        $birthdayDate = new DateTime($birthday);
        $today = new DateTime();
        $age = $today->diff($birthdayDate)->y;

        if ($age < 18) {
            return $this->failValidationErrors(['birthday' => "Vous êtes en dessous de 18 ans, vous ne pouvez pas vous inscrire."]);
        }

        $personModel = new PersonModel();
        $data = [
            'name' => $this->request->getVar('name'),
            'firstname' => $this->request->getVar('firstname'),
            'birthday' => $birthday,
            'address' => $this->request->getVar('address'),
            'email' => $this->request->getVar('email'),
            'telephone' => $this->request->getVar('telephone'),
        ];

        $person = $personModel->check_if_already_exist($data['email'], $data['telephone']);
        if ($person) {
            return $this->failResourceExists("Votre email et téléphone sont déjà associés à un compte.");
        }

        $personModel->insert($data);
        return $this->respondCreated($data);
    }

    public function update($id = null)
    {
        $rules = [
            'name' => 'required',
            'firstname' => 'required',
            'birthday' => 'required|valid_date',
            'address' => 'required',
            'email' => 'required|valid_email',
            'telephone' => 'required|numeric|exact_length[10]|number_prefix'
        ];

        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $birthday = $this->request->getVar('birthday');
        $birthdayDate = new DateTime($birthday);
        $today = new DateTime();
        $age = $today->diff($birthdayDate)->y;

        if ($age < 18) {
            return $this->failValidationErrors(['birthday' => "Vous êtes en dessous de 18 ans, vous ne pouvez pas vous inscrire."]);
        }

        $personModel = new PersonModel();
        $data = [
            'name' => $this->request->getVar('name'),
            'firstname' => $this->request->getVar('firstname'),
            'birthday' => $birthday,
            'address' => $this->request->getVar('address'),
            'email' => $this->request->getVar('email'),
            'telephone' => $this->request->getVar('telephone'),
        ];

        $personModel->update($id, $data);
        return $this->respond($data);
    }

    public function delete($id = null)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);
        if (!$person) {
            return $this->failNotFound("Person not found");
        }
        $personModel->delete($id);

        $personskillsModel = new PersonSkillsModel();
        $personskillsModel->where('idperson', $id)->delete();

        return $this->respondDeleted(['id' => $id]);
    }

    public function detail($id)
    {
        $personModel = new PersonModel();
        $person = $personModel->find($id);

        $v_personSkillsModel = new V_PersonSkillsModel();
        $skills = $v_personSkillsModel->getSkillsPerson($id);

        return $this->respond([
            'person' => $person,
            'personskills' => $skills
        ]);
    }
    
    public function count()
    {
        $personModel = new PersonModel();
        $total = $personModel->countAll();
        return $this->respond(['count' => $total]);
    }
    public function collabStat()
    {
        $v_PersonStatsModel = new V_PersonStatsModel();
        $result = $v_PersonStatsModel->getCollabAnalyse();
        return $this->response->setJSON(['data' => $result]);
    }
}
