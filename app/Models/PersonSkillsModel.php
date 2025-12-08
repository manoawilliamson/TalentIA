<?php

namespace App\Models;
use CodeIgniter\Model;

class PersonSkillsModel extends Model
{
    protected $table = 'personskills';
    protected $primaryKey = 'id';
    protected $allowedFields = ['idperson', 'idskill','noteskill','dateupdate'];
}