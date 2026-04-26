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
            // Check if it's an API request (JSON)
            $contentType = $this->request->getHeaderLine('Content-Type');
            $accept = $this->request->getHeaderLine('Accept');
            $isApi = strpos($contentType, 'application/json') !== false ||
                     strpos($accept, 'application/json') !== false;



            $email = $isApi ? $this->request->getJSON()->email : $this->request->getVar('email');
            $password = $isApi ? $this->request->getJSON()->password : $this->request->getVar('password');

            if (empty($email) || empty($password)) {
                if ($isApi) {
                    return $this->response->setJSON([
                        'status' => 'error',
                        'message' => 'Email and password are required'
                    ])->setStatusCode(400);
                } else {
                    return view('login', [
                        "error" => "Email and password are required"
                    ]);
                }
            }

            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                if ($isApi) {
                    return $this->response->setJSON([
                        'status' => 'error',
                        'message' => 'Invalid email format'
                    ])->setStatusCode(400);
                } else {
                    return view('login', [
                        "error" => "Invalid email format"
                    ]);
                }
            }

            try {
                $userModel = new UserModel();
                $user = $userModel->get_user_by_mail($email);
                if ($user && password_verify($password, $user['password'])) {
                    $this->setUserSession($user);
                    if ($isApi) {
                        return $this->response->setJSON([
                            'status' => 'success',
                            'message' => 'Login successful',
                            'user' => [
                                'id' => $user['id'],
                                'name' => $user['name'],
                                'email' => $user['email'],
                                'role' => $user['role']
                            ]
                        ])->setStatusCode(200);
                    } else {
                        return redirect()->to(base_url('/dashboard'));
                    }
                } else {
                    if ($isApi) {
                        return $this->response->setJSON([
                            'status' => 'error',
                            'message' => 'Invalid email or password'
                        ])->setStatusCode(401);
                    } else {
                        return view('login', [
                            "error" => "Invalid email or password"
                        ]);
                    }
                }
            } catch (\Exception $e) {
                if ($isApi) {
                    return $this->response->setJSON([
                        'status' => 'error',
                        'message' => 'Server error: ' . $e->getMessage()
                    ])->setStatusCode(500);
                } else {
                    return view('login', [
                        "error" => $e->getMessage()
                    ]);
                }
            }
            if (!$isApi) {
                return view('login');
            }
        }
    }

    public function logout()
    {
        $session = session();
        $session->destroy(); // Destroy the session
        return redirect()->to('/auth'); // Redirect to login page
    }
}
