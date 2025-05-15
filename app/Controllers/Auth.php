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

    private function setUserSession($user)
    {
        $data = [
            'id' => $user['id'],
            'isLoggedIn' => true,
        ];

        session()->set($data);
        return true;
    }

    public function login()
    {
        if ($this->request->getMethod(true) === 'POST') {
            $rules = [
                'email' => 'required|valid_email',
                'password' => 'required|validateUser[email,password]'
            ];
            $errors = [
                'email' => [
                    'required' => "Champ email ne doit pas etre vide",
                    'valid_email' => "invalid email"
                ],
                'password' => [
                    'required' => "Champ mot de passe ne doit pas etre vide",
                    'validateUser' => "Email ou mot de passe incorrect"
                ]
            ];
            if (!$this->validate($rules, $errors)) {
                return view('login', [
                    "validation" => $this->validator,
                ]);
            } else {
                try {
                    $userModel = new UserModel();
                    $user = $userModel->get_user_by_mail($this->request->getVar('email'));
                    if ($user) {
                        $this->setUserSession($user);
                        return redirect()->to(base_url('/dashboard'));
                    } else {
                        throw new \Exception("Auccun utilisateur correspondant");
                    }
                } catch (\Exception $e) {
                    return view('login', [
                        "validation" => $this->validator,
                        "error" => $e->getMessage()
                    ]);
                }
            }
            return view('login');
        }
    }

    public function logout()
    {
        $session = session();
        $session->destroy(); // Destroy the session
        return redirect()->to('/auth'); // Redirect to login page
    }
}
