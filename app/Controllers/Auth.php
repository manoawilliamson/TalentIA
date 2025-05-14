<?php namespace App\Controllers;

use App\Models\UserModel;
use CodeIgniter\RESTful\ResourceController;

class Auth extends ResourceController
{
    public function index()
    {
        // Load the login view
        return view('login');
    }

    public function login()
    {

        $users = $this->request->getJSON(true);
        $session = session();
        $userModel = new UserModel();

        // Fetch user from the database
        $user = $userModel->where('email', $users['mail'])->first();

        // Check if user exists and password matches
        if ($user && $user['password'] === $users['password']) {
            return $this->respond(["message" => "Login successfful"], 201);
        } else {
            return $this->respond(["message" => "Invalid email or password"], 403);

        }
    }

    public function logout()
    {
        $session = session();
        $session->destroy(); // Destroy the session
        return redirect()->to('/auth'); // Redirect to login page
    }
}
