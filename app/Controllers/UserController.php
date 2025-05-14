<?php

namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\Controller;

class UserController extends Controller
{
    public function index() {
        $model = new UserModel();
        $users = $model->findAll(); // Récupère tous les utilisateurs
        return $this->response->setJSON($users); // Retourne les utilisateurs au format JSON
    }

    public function create()
    {
        return view('users/create');  // Load create user form
    }

    public function store()
    {
        $userModel = new UserModel();

        // Hash the password before storing it
        $passwordHash = password_hash($this->request->getPost('password'), PASSWORD_DEFAULT);

        // Collect form data
        $data = [
            'name'     => $this->request->getPost('name'),
            'email'    => $this->request->getPost('email'),
            'role'     => $this->request->getPost('role'),
            'password' => $passwordHash,  // Store the hashed password
        ];

        // Save the user
        $userModel->insert($data);

        return redirect()->to(base_url('/dashboard'))->with('success', 'User added successfully!');
    }

    public function edit($id)
    {
        $userModel = new UserModel();
        $data['user'] = $userModel->find($id);  // Find the user by ID
        return view('users/edit', $data);  // Load edit form with user data
    }

    public function update($id)
    {
        $userModel = new UserModel();

        // If the password field is not empty, hash it before saving
        $password = $this->request->getPost('password');
        if ($password) {
            $passwordHash = password_hash($password, PASSWORD_DEFAULT);
            $data['password'] = $passwordHash;
        }

        // Collect form data
        $data['name']  = $this->request->getPost('name');
        $data['email'] = $this->request->getPost('email');
        $data['role']  = $this->request->getPost('role');

        // Update user
        $userModel->update($id, $data);

        return redirect()->to(base_url('/dashboard'))->with('success', 'User updated successfully!');
    }

    public function delete($id)
    {
        $userModel = new UserModel();
        $userModel->delete($id);  // Delete the user
        return redirect()->to(base_url('users'))->with('success', 'User deleted successfully!');
    }
}
