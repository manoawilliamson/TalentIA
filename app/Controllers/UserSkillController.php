<?php

namespace App\Controllers;

use App\Models\UserSkillModel;
use App\Models\UserModel;
use App\Models\SkillModel;
use CodeIgniter\Controller;
use CodeIgniter\RESTful\ResourceController;

class UserSkillController extends ResourceController
{
    public function index()
    {
        $userSkillModel = new UserSkillModel();
        $data['user_skills'] = $userSkillModel->findAll();  // Fetch all user skills
        var_dump($data);
        return view('user_skills/index', $data);  // Load user skills list view
    }

    public function create()
    {
        $userModel = new UserModel();
        $skillModel = new SkillModel();

        $data['users'] = $userModel->findAll();  // Fetch all users
        $data['skills'] = $skillModel->findAll();  // Fetch all skills

        return view('user_skills/create', $data);  // Load create user skill form
    }

    public function store()
    {
        $userSkillModel = new UserSkillModel();

        // Collect form data
        $data = [
            'user_id' => $this->request->getPost('user_id'),
            'skill_id' => $this->request->getPost('skill_id'),
            'level' => $this->request->getPost('level'),
        ];

        // Save the user skill
        $userSkillModel->insert($data);

        return redirect()->to(base_url('/user_skills'))->with('success', 'User skill added successfully!');
    }

    // public function edit($id)
    // {
    //     $userSkillModel = new UserSkillModel();
    //     $data['user_skill'] = $userSkillModel->find($id);  // Find the user skill by ID

    //     $userModel = new UserModel();
    //     $skillModel = new SkillModel();
    //     $data['users'] = $userModel->findAll();  // Fetch all users
    //     $data['skills'] = $skillModel->findAll();  // Fetch all skills

    //     return view('user_skills/edit', $data);  // Load edit form with user skill data
    // }

    // public function update($id)
    // {
    //     $userSkillModel = new UserSkillModel();

    //     // Collect form data
    //     $data = [
    //         'user_id' => $this->request->getPost('user_id'),
    //         'skill_id' => $this->request->getPost('skill_id'),
    //         'level' => $this->request->getPost('level'),
    //     ];

    //     // Update user skill
    //     $userSkillModel->update($id, $data);

    //     return $this->respond(['success', 'User skill updated successfully!'], 200);
    // }

    // public function delete($id)
    // {
    //     $userSkillModel = new UserSkillModel();
    //     $userSkillModel->delete($id);  // Delete the user skill
    //     // return $this->respond(['success', 'User skill deleted successfully!'], 200);
    //     // return redirect()->to(base_url('/user_skills'))->with('success', 'User skill deleted successfully!');
    // }

    public function getStatsSkills(){
        $userSkillModel = new UserSkillModel();
        $query = $userSkillModel->getStats();
        return $this->respond($query);
    }


}