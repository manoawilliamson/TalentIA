<?php

namespace App\Models;

use CodeIgniter\Model;

class V_RecomPersonModel extends Model
{
    protected $table = 'v_recommendation_person_project_top5';

    /**
     * Retourne les 5 personnes recommandées pour un projet donné
     * @param int $idProjet
     * @return array
     */
    public function getTop5ForProject($idProjet)
    {
        $recommendations = $this->where('idproject', $idProjet)
                    ->orderBy('matching_score', 'DESC')
                    ->findAll();
        
        // Add skills for each recommended person
        foreach ($recommendations as &$recommendation) {
            $personId = $recommendation['idperson'];
            
            // Get person's skills from personskills table
            $query = $this->db->query("
                SELECT 
                    s.id,
                    s.name as skill_name,
                    ps.noteskill,
                    s.category
                FROM personskills ps
                JOIN skills s ON ps.idskill = s.id
                WHERE ps.idperson = ?
                ORDER BY ps.noteskill DESC
            ", [$personId]);
            
            $recommendation['skills'] = $query->getResultArray();
        }
        
        return $recommendations;
    }
}