<?php

namespace App\Models;

use CodeIgniter\Model;

class V_PersonSkillsModel extends Model
{
    protected $table = 'v_personskills';
    protected $primaryKey = null;
    protected $allowedFields = ['idperson', 'name', 'firstname', 'birthday', 'address', 'email', 'telephone', 'idskill', 'skill', 'noteskill', 'dateupdate'];


    public function getSkillsPerson($id)
    {
        $query = $this->db->query(
            "SELECT DISTINCT ON (idskill) * FROM v_personskills
                WHERE noteskill != 0 and idperson = ? ORDER BY idskill, dateupdate DESC",
            [$id]
        );
        $result = $query->getResult();

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'idperson' => $row->idperson,
                'name' => $row->name,
                'firstname' => $row->firstname,
                'birthday' => $row->birthday,
                'address' => $row->address,
                'email' => $row->email,
                'telephone' => $row->telephone,
                'idskill' => $row->idskill,
                'skill' => $row->skill,
                'noteskill' => $row->noteskill,
                'dateupdate' => $row->dateupdate
            ];
        }
        return $data;
    }
    public function getHistorySkillsPerson($id)
    {
        $query = $this->db->query(
            "SELECT skill,noteskill, DATE(dateupdate) as dateupdate FROM v_personskills
                WHERE noteskill != 0 and idperson= ? ORDER BY dateupdate DESC",
            [$id]
        );
        $result = $query->getResult();

        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'skill' => $row->skill,
                'noteskill' => $row->noteskill,
                'dateupdate' => $row->dateupdate

            ];
        }
        return $data;
    }

    // In your V_PersonSkillsModel.php
    public function getMonthlySkillAverages($id)
    {
        $query = $this->db->query(
            "SELECT 
            to_char(dateupdate, 'YYYY-MM') AS month,
            AVG(noteskill) AS average_skill
        FROM v_personskills
        WHERE idperson = ? AND noteskill != 0
        GROUP BY to_char(dateupdate, 'YYYY-MM')
        ORDER BY month ASC",
            [$id]
        );
        $result = $query->getResult();
        $data = [];
        foreach ($result as $row) {
            $data[] = [
                'month' => $row->month,
                'average_skill' => $row->average_skill

            ];
        }
        return $data;
        return $query->getResultArray();
    }
}
