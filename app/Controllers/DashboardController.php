<?php

namespace App\Controllers;

use App\Models\UserModel;

class DashboardController extends BaseController
{
    protected $userModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
    }

    public function index()
    {
        $data['users'] = $this->userModel->findAll(); // Fetch all users
        return view('dashboard', $data); // Ensure this matches the view file name
    }
}
