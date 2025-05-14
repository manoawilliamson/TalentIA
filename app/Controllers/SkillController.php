<?php

namespace App\Controllers;

use App\Models\SkillModel;
use CodeIgniter\Controller;
use CodeIgniter\RESTful\ResourceController;

class SkillController extends ResourceController
{
    public function index()
    {
        $skillModel = new SkillModel();
        $skills = $skillModel->findAll(); 
        return $this->respond($skills, 200);
    }

    public function create()
    {
        return view('skills/create');  // Load create skill form
    }

    public function store()
    {
        $skillModel = new SkillModel();
        
        // Collect form data
        $data = [
            'name'     => $this->request->getPost('name'),
            'category'  => $this->request->getPost('category'),
        ];

        // Save the skill
        $skillModel->insert($data);

        return redirect()->to(base_url('/skills'))->with('success', 'Skill added successfully!');
    }

    public function save(){
        $data = $this->request->getJSON(true);
        $skillModel = new SkillModel();
        $skillModel->insert($data);
        return $this->respond(['message' => 'Successfull'], 202);

    }

    // public function edit($id)
    // {
    //     $skillModel = new SkillModel();
    //     $data['skill'] = $skillModel->find($id);  // Find the skill by ID
    //     return view('skills/edit', $data);  // Load edit form with skill data
    // }

    public function modify($id)
    {
        $skillModel = new SkillModel();
        $data = $this->request->getJSON(true);
        // Update skill
        $skillModel->update($id, $data);

        return $this->respond(['message' => 'Modification success']);

        // return redirect()->to(base_url('/skills'))->with('success', 'Skill updated successfully!');
    }

    public function deleteSkill($id)
    {
        $skillModel = new SkillModel();
        $skillModel->delete($id);  // Delete the skill
        return $this->respond(['message' => 'Suppression success']);

    }
}