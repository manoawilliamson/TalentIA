<?php namespace App\Controllers;

use App\Models\ProjectModel;
use CodeIgniter\RESTful\ResourceController;


class ProjectController extends ResourceController {

    public function index()
    {
        $prj = new ProjectModel();
        $skills = $prj->findAll(); 
        return $this->respond($skills, 200);
    }

    public function save(){
        $data = $this->request->getJSON(true);
        $prj = new ProjectModel();
        $prj->insert($data);
        return $this->respond(['message' => 'Successfull'], 202);

    }

    public function modify($id)
    {
        $prj = new ProjectModel();
        $data = $this->request->getJSON(true);
        // Update skill
        $prj->update($id, $data);

        return $this->respond(['message' => 'Modification success']);

        // return redirect()->to(base_url('/skills'))->with('success', 'Skill updated successfully!');
    }

    public function deleteSkill($id)
    {
        $prj = new ProjectModel();
        $prj->delete($id);  // Delete the skill
        return $this->respond(['message' => 'Suppression success']);

    }

    public function addTechDataToProject( $id ){
        $data = $this->request->getJSON(true);
        var_dump($data);
        // tokony hoe ny data tonga = 
        /**
         * 
         * project_id
         * skill_id
         * personnes_requis
         * niveau id
         * 
         */
        // Okay rehefa azo eto ito de mila mamorona resaka table ampidirana anzareo
        $prj = new ProjectModel();
        $prj->addTechDataToProject( $id, $data );
        return $this->respond(['message' => 'Technologies ajoutée'], 200);
    }

    public function getStacksForProject( $id ){
        $projectData = (new ProjectModel())->getProjectWithStacks($id);
        return $this->respond(['skills' => $projectData], 200);
    }

}



?>