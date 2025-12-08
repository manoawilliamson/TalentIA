<?php


namespace app\Models;

use CodeIgniter\Model;

class NiveauModel extends Model{

    protected $table = 'niveau';
    protected $primaryKey = 'id';
    protected $allowedFields = ['codeNiveau', 'descriptionNiveau'];

    // Optional: You can define validation rules if needed
    protected $validationRules = [
        'codeNiveau' => 'unique'
    ];

    function __construct()
    {
        parent::__construct();
    }

}




?>