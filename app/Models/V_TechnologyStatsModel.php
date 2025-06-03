<?php

namespace App\Models;

use CodeIgniter\Model;

class V_TechnologyStatsModel extends Model
{
    protected $table = 'v_technology_usage_stats';


    public function getTechStats()
    {
        return $this ->findAll();
    }
}