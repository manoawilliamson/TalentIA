<?php

namespace App\Models;
use CodeIgniter\Model;

class PersonProjectModel extends Model
{
    protected $table = 'personproject';
    protected $primaryKey = 'id';
    protected $allowedFields = ['idperson', 'idproject'];
}