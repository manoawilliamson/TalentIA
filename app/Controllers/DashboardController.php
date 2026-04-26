<?php
namespace App\Controllers;

use App\Models\UserModel;
use App\Models\ProjectModel;
use App\Models\SkillModel;
use App\Models\PersonModel;
use App\Models\V_TechnologyStatsModel;
use App\Models\V_PersonStatsModel;
use CodeIgniter\API\ResponseTrait;

class DashboardController extends BaseController
{
    use ResponseTrait;

    protected $userModel;
    protected $projectModel;
    protected $skillModel;
    protected $personModel;
    protected $techStatsModel;
    protected $personStatsModel;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->projectModel = new ProjectModel();
        $this->skillModel = new SkillModel();
        $this->personModel = new PersonModel();
        $this->techStatsModel = new V_TechnologyStatsModel();
        $this->personStatsModel = new V_PersonStatsModel();
    }

    public function index()
    {
        $data['users'] = $this->userModel->findAll();
        return view('dashboard', $data);
    }

    /**
     * Aggregated statistics for the dynamic dashboard
     */
    public function statistics()
    {
        log_message('debug', 'DashboardController::statistics called');
        $db = \Config\Database::connect();

        // 1. Counters
        $projectCount = $this->projectModel->countAll();
        $skillCount = $this->skillModel->countAll();
        $personCount = $this->personModel->countAll();
        
        // Performance average (from v_person_participation_stats or average of scores)
        $perfResult = $db->table('v_person_participation_stats')->selectAvg('participation_percentage', 'total_avg')->get()->getRow();
        $performanceAvg = $perfResult ? round($perfResult->total_avg, 1) : 0;

        // 2. Project Status Segments
        $segments = [
            ['label' => 'Projets actifs', 'value' => $this->projectModel->where('etat', 'EN_COURS')->countAllResults(), 'color' => '#3b82f6'],
            ['label' => 'En attente', 'value' => $this->projectModel->where('etat', 'PLANIFIÉ')->countAllResults(), 'color' => '#f59e0b'],
            ['label' => 'Terminés', 'value' => $this->projectModel->where('etat', 'TERMINÉ')->countAllResults(), 'color' => '#10b981'],
        ];

        // 3. Top Skills (from v_technology_usage_stats)
        $techStats = $this->techStatsModel->orderBy('project_count', 'DESC')->limit(5)->findAll();
        $topSkills = array_map(function($s) {
            return [
                'name' => $s['technology_name'],
                'count' => (int)$s['project_count'],
                'pct' => round($s['usage_percentage'])
            ];
        }, $techStats);

        // 4. Skill Gaps (using v_skill_gap_analysis if exists, else mock or derive)
        // Check if table exists via raw query to avoid breakage if view is missing
        try {
            $gaps = $db->table('v_skill_gap_analysis')->limit(5)->get()->getResultArray();
        } catch (\Exception $e) {
            $gaps = []; 
        }

        // 5. Recent Activity (Latest projects and assignments)
        $latestProjects = $this->projectModel->orderBy('id', 'DESC')->limit(3)->findAll();
        $activity = [];
        foreach($latestProjects as $p) {
            $activity[] = [
                'title' => 'Nouveau projet',
                'desc' => $p['name'],
                'time' => 'Récent',
                'type' => 'success'
            ];
        }

        // 6. Real Evolution data
        $thirtyDaysAgo = date('Y-m-d H:i:s', strtotime('-30 days'));
        
        $evolution = [
            'projects_new' => $this->projectModel->where('created_at >=', $thirtyDaysAgo)->countAllResults(),
            'skills_new' => $this->skillModel->where('created_at >=', $thirtyDaysAgo)->countAllResults(),
            'persons_total' => $personCount,
            // Keep the array for charts if needed, but provide aggregate numbers
            'projects' => [max(0, $projectCount-2), max(0, $projectCount-1), $projectCount, $projectCount, $projectCount, $projectCount],
            'skills' => [max(0, $skillCount-3), max(0, $skillCount-2), max(0, $skillCount-1), $skillCount, $skillCount, $skillCount],
            'persons' => [max(0, $personCount-1), $personCount, $personCount, $personCount, $personCount, $personCount],
        ];

        // 7. Top Skills dynamic count (distinct skills used in at least one project)
        $topSkillsCount = $db->table('projectskills')->distinct()->select('idskills')->countAllResults();

        return $this->respond([
            'counters' => [
                'projects' => $projectCount,
                'skills' => $skillCount,
                'persons' => $personCount,
                'performance' => $performanceAvg
            ],
            'segments' => $segments,
            'top_skills' => $topSkills,
            'gaps' => $gaps,
            'activity' => $activity,
            'participation' => array_map(function($p) {
                return [
                    'name' => $p['person_name'] ?? 'Inconnu',
                    'firstname' => '',
                    'project_count' => (int)($p['project_count'] ?? 0),
                    'avg_score' => round($p['participation_percentage'] ?? 0)
                ];
            }, $this->personStatsModel->findAll()),
            'evolution' => $evolution,
            'top_skills_count' => $topSkillsCount
        ]);
    }
}
