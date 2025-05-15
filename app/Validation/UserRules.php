<?php

namespace App\Validation;
use App\Models\UserModel;

class UserRules
{
    public function validateUser(string $str, string $fields, array $data)
    {
        $model = new UserModel();
        $user = $model->where('email', $data['email'])->first();
        if (!$user)
            return false;
        else {
            if ($user['password'] === $data['password']) {
                return true;
            } else {
                return false; 
            }
        }
    }
}
