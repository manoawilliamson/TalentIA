<?php

namespace App\Models;
use CodeIgniter\Model;

class ProjectSkillsModel extends Model
{
    protected $table = 'projectskills';
    protected $primaryKey = 'id';
    protected $allowedFields = ['idproject', 'idskills','noteskills'];
}