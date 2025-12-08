<?php

namespace App\Controllers;

use app\Models\NiveauModel;
use CodeIgniter\RESTful\ResourceController;

class NiveauController extends ResourceController{

    public function findAll(){
        $niveauModel = new NiveauModel();
        $niveaux = $niveauModel->findAll();
        return $this->respond($niveaux, 200);
    }

}
?>