<?php

namespace App\Controllers;

use App\Models\PersonModel;
use App\Models\PersonProjectModel;
use App\Models\V_PersonProjectModel;
use CodeIgniter\Controller;
use App\Models\V_RecomPersonModel;

class PersonProjectController extends Controller
{
    public function show($idproject)
    {
        $model = new V_PersonProjectModel();
        $result = $model->getPersonsByProject($idproject);

        return $this->response->setJSON([
            'persons' => $result
        ]);
    }



public function store()
{
    // Accepte JSON ou x-www-form-urlencoded
    $input = $this->request->getJSON(true) ?? $this->request->getPost();

    $rules = [
        'idprojet' => 'required',
        'idperson' => 'required'
    ];
    $errors = [
        'idprojet' => [
            'required' => "Champ projet requis"
        ],
        'idskills' => [
            'idperson' => "Champ skills ne doit pas être vide"
        ]
    ];

    if (!$this->validate($rules, $errors)) {
        return $this->response->setJSON([
            "validation" => $this->validator->getErrors()
        ])->setStatusCode(400);
    }

    try {
        $personProjectModel = new PersonProjectModel();

        // Vérifie si la personne est déjà associée à ce projet
        $existingSkill = $personProjectModel
            ->where('idproject', $input['idprojet'])
            ->where('idperson', $input['idperson'])
            ->first();

        if ($existingSkill) {
            return $this->response->setJSON([
                "error" => "Personne déjà associée à ce projet."
            ])->setStatusCode(409);
        }

        // --- NEW: Enforce 2-project limit ---
        $activeProjectCount = $personProjectModel
            ->join('project', 'project.id = personproject.idproject')
            ->where('personproject.idperson', $input['idperson'])
            ->where('project.etat', 'EN_COURS')
            ->countAllResults();

        if ($activeProjectCount >= 2) {
            return $this->response->setJSON([
                "error" => "Le collaborateur est déjà assigné à 2 projets actifs."
            ])->setStatusCode(400);
        }
        // ------------------------------------

        // Vérifie le nombre de personnes déjà assignées au projet
        $currentCount = $personProjectModel
            ->where('idproject', $input['idprojet'])
            ->countAllResults();

        // Récupère la limite depuis le projet
        $projectModel = new \App\Models\ProjectModel();
        $project = $projectModel->find($input['idprojet']);
        if (!$project) {
            return $this->response->setJSON([
                "error" => "Projet introuvable."
            ])->setStatusCode(404);
        }
        $maxPerson = isset($project['nbrperson']) ? (int)$project['nbrperson'] : 0;

        if ($maxPerson > 0 && $currentCount >= $maxPerson) {
            return $this->response->setJSON([
                "error" => "Le nombre maximum de personnes pour ce projet est déjà atteint."
            ])->setStatusCode(400);
        }

        $data = [
            'idproject' => $input['idprojet'],
            'idperson' => $input['idperson']
        ];

        $insertId = $personProjectModel->insert($data);
        if ($insertId) {
            $newPerson = $personProjectModel->find($insertId);
            return $this->response->setJSON([
                "message" => "Personne ajouté avec succès",
                "idpersonproject" => $insertId,
                "personne" => $insertId
            ])->setStatusCode(201);
        } else {
            return $this->response->setJSON([
                "error" => "Erreur lors de l'insertion"
            ])->setStatusCode(500);
        }
    } catch (\Exception $e) {
        return $this->response->setJSON([
            "error" => $e->getMessage()
        ])->setStatusCode(500);
    }
}

    public function recommendation($idproject)
    {
        $db = \Config\Database::connect();

        // 1. Get the required skill IDs for this project
        $skillIds = $db->table('projectskills')
            ->select('idskills')
            ->where('idproject', $idproject)
            ->get()
            ->getResultArray();

        $skillIdList = array_column($skillIds, 'idskills');

        if (empty($skillIdList)) {
            // No skills configured for this project — return all persons with availability
            $allPersons = $db->query("
                SELECT
                    p.id         AS idperson,
                    p.name,
                    p.firstname,
                    p.email,
                    0            AS matching_score,
                    0            AS matched_skills,
                    (
                        SELECT COUNT(*) 
                        FROM personproject pp2
                        JOIN project pr2 ON pr2.id = pp2.idproject
                        WHERE pp2.idperson = p.id AND pr2.etat = 'EN_COURS'
                    ) < 2 AS available
                FROM person p
                ORDER BY p.name ASC
            ")->getResultArray();

            foreach ($allPersons as &$person) {
                $person['skills']     = [];
                $person['available']  = (bool)$person['available'];
            }

            return $this->response->setJSON(['recommendations' => $allPersons]);
        }

        // 2. Build IN clause safely
        $placeholders = implode(',', array_fill(0, count($skillIdList), '?'));

        // 3. Main recommendation query
        $sql = "
            SELECT
                p.id                                    AS idperson,
                p.name,
                p.firstname,
                p.email,
                ROUND(AVG(ps.noteskill), 2)             AS matching_score,
                COUNT(DISTINCT ps.idskill)              AS matched_skills,
                (
                    SELECT COUNT(*) 
                    FROM personproject pp2
                    JOIN project pr2 ON pr2.id = pp2.idproject
                    WHERE pp2.idperson = p.id AND pr2.etat = 'EN_COURS'
                ) < 2 AS available
            FROM person p
            JOIN personskills ps ON ps.idperson = p.id
            WHERE ps.idskill IN ($placeholders)
            GROUP BY p.id, p.name, p.firstname, p.email
            ORDER BY matching_score DESC, matched_skills DESC
        ";

        $persons = $db->query($sql, $skillIdList)->getResultArray();

        // 4. Attach full skill list (across ALL project skills) for each person
        foreach ($persons as &$person) {
            $personId = $person['idperson'];

            $skillsQuery = $db->query("
                SELECT
                    s.id,
                    s.name   AS skill_name,
                    ps.noteskill,
                    s.category,
                    CASE WHEN ps.idskill IN ($placeholders) THEN true ELSE false END AS is_required
                FROM personskills ps
                JOIN skills s ON s.id = ps.idskill
                WHERE ps.idperson = ?
                ORDER BY ps.noteskill DESC
            ", array_merge($skillIdList, [$personId]));

            $person['skills']    = $skillsQuery->getResultArray();
            $person['available'] = (bool)$person['available'];
            $person['matching_score'] = (float)$person['matching_score'];
        }

        return $this->response->setJSON(['recommendations' => $persons]);
    }

    public function delete($id)
    {
        $personProjectModel = new PersonProjectModel();
        
        if ($personProjectModel->delete($id)) {
            return $this->response->setJSON([
                "message" => "Personne désassignée avec succès"
            ])->setStatusCode(200);
        } else {
            return $this->response->setJSON([
                "error" => "Erreur lors de la désassignation ou enregistrement introuvable"
            ])->setStatusCode(404);
        }
    }
}
