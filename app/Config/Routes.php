<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/dashboard', 'DashboardController::index', ['filter' => 'auth']); 
$routes->get('/auth', 'Auth::index'); 
$routes->post('/auth/login', 'Auth::login'); 
$routes->get('/auth/logout', 'Auth::logout');

$routes->group('/users',['filter' => 'auth'], function($routes) {
    $routes->get('', 'UserController::index');
    $routes->get('create', 'UserController::create');
    $routes->post('store', 'UserController::store');
    $routes->get('edit/(:num)', 'UserController::edit/$1');
    $routes->post('update/(:num)', 'UserController::update/$1');
    $routes->get('delete/(:num)', 'UserController::delete/$1'); 
});

$routes->group('skills',['filter' => 'auth'], function($routes) {
    $routes->get('', 'SkillController::index'); 
    $routes->get('create', 'SkillController::create');
    $routes->post('store', 'SkillController::store');
    $routes->get('edit/(:num)', 'SkillController::edit/$1'); 
    $routes->post('update/(:num)', 'SkillController::update/$1');
    $routes->get('delete/(:num)', 'SkillController::delete/$1');
});

$routes->group('projects',['filter' => 'auth'], function($routes) {
    $routes->get('', 'ProjectController::index'); 
    $routes->get('create', 'ProjectController::create'); 
    $routes->post('store', 'ProjectController::store'); 
    $routes->get('edit/(:num)', 'ProjectController::edit/$1');
    $routes->post('update/(:num)', 'ProjectController::update/$1');
    $routes->get('delete/(:num)', 'ProjectController::delete/$1');
    $routes->get('fiche/(:num)', 'ProjectController::detail/$1');
    $routes->get('download/(:segment)', 'ProjectController::download/$1');
});

$routes->group('projectskills', ['filter' => 'auth'], function($routes) {;
    $routes->get('create/(:num)', 'ProjectSkillsController::index/$1');
    $routes->get('list/(:num)', 'ProjectSkillsController::list/$1');
    $routes->post('store', 'ProjectSkillsController::store');
    $routes->get('edit/(:num)/(:segment)', 'ProjectSkillsController::edit/$1/$2');
    $routes->get('delete/(:num)/(:segment)', 'ProjectSkillsController::delete/$1/$2');
    $routes->post('update/(:num)', 'ProjectSkillsController::updateSkill/$1');

});

$routes->group('person', ['filter' => 'auth'], function($routes) {;
    $routes->get('', 'PersonController::index');
    $routes->get('create', 'PersonController::create');
    $routes->post('store', 'PersonController::store'); 
    $routes->get('edit/(:num)', 'PersonController::edit/$1');
    $routes->post('update/(:num)', 'PersonController::update/$1');
    $routes->get('delete/(:num)', 'PersonController::delete/$1'); 
    $routes->get('fiche/(:num)', 'PersonController::detail/$1');
});

$routes->group('personskills', ['filter' => 'auth'], function($routes) {;
    $routes->get('create/(:num)', 'PersonSkillsController::index/$1');
    $routes->get('history/(:num)', 'PersonSkillsController::history/$1');
    $routes->get('graphhistory/(:num)', 'PersonSkillsController::graphhistory/$1');
});

$routes->group('personproject', ['filter' => 'auth'], function($routes) {;
    $routes->get('', 'PersonProjectController::index');
    $routes->get('create', 'PersonProjectController::store');
});


$routes->group('user_skills',['filter' => 'auth'], function($routes) {
    try{
        $routes->get('', 'UserSkillController::index'); 
        $routes->get('create', 'UserSkillController::create'); 
        $routes->post('store', 'UserSkillController::store'); 
        $routes->get('edit/(:num)', 'UserSkillController::edit/$1'); 
        $routes->post('update/(:num)', 'UserSkillController::update/$1');
        $routes->get('delete/(:num)', 'UserSkillController::delete/$1');
        $routes->get('test', 'UserSkillController::test_user_skills');
    }catch(\Exception $e){
        var_dump($e);
    }
});

$routes->group('api', function($routes) {
    $routes->options('(:any)', static function () {
        $response = service('response');
        $response->setStatusCode(204);
        $response->setHeader('Allow', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        $response->setHeader('Access-Control-Allow-Origin', '*');
        $response->setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
        $response->setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return $response;
    });
    $routes->post('login', 'Auth::login');
    $routes->group('stats', function($routes){
        $routes->get('user_skills', 'UserSkillController::getStatsSkills');
    });
     $routes->group('users', function($routes){
        $routes->get('/', 'Api\UserController::index');        
        $routes->get('(:num)', 'Api\UserController::show/$1'); 
        $routes->post('/', 'Api\UserController::create');      
        $routes->put('(:num)', 'Api\UserController::update/$1'); 
        $routes->delete('(:num)', 'Api\UserController::delete/$1'); 
    });

    $routes->group('skills', function($routes){
        $routes->get('/', 'Api\SkillController::index');        
        $routes->get('(:num)', 'Api\SkillController::show/$1'); 
        $routes->post('/', 'Api\SkillController::create');      
        $routes->put('(:num)', 'Api\SkillController::update/$1'); 
        $routes->delete('(:num)', 'Api\SkillController::delete/$1'); 
    });

     $routes->group('projects', function($routes){
        $routes->get('/', 'ProjectController::index');              
        $routes->get('(:num)', 'Api\ProjectController::show/$1');       
        $routes->post('/', 'ProjectController::store');            
        $routes->put('(:num)', 'Api\ProjectController::update/$1');     
        $routes->delete('(:num)', 'Api\ProjectController::delete/$1');  
    });
    $routes->group('person', function($routes){
        $routes->get('/', 'Api\PersonController::index');           // Liste toutes les personnes
        $routes->get('(:num)', 'Api\PersonController::show/$1');    // Détail d'une personne
        $routes->post('/', 'Api\PersonController::create');         // Création d'une personne
        $routes->put('(:num)', 'Api\PersonController::update/$1');  // Modification d'une personne
        $routes->delete('(:num)', 'Api\PersonController::delete/$1'); // Suppression d'une personne
    });
     $routes->group('personskills', function($routes){
        $routes->get('/', 'Api\PersonSkillsController::index');            // Liste toutes les personskills
        $routes->get('(:num)', 'Api\PersonSkillsController::show/$1');     // Détail d'une personskill
        $routes->post('/', 'Api\PersonSkillsController::create');          // Création d'une personskill
        $routes->put('(:num)', 'Api\PersonSkillsController::update/$1');   // Modification d'une personskill
        $routes->delete('(:num)', 'Api\PersonSkillsController::delete/$1');// Suppression d'une personskill
    });

    $routes->group('personproject', function($routes){
        $routes->get('/', 'Api\PersonProjectController::index');            // Liste tous les personproject
        $routes->get('(:num)', 'Api\PersonProjectController::show/$1');     // Détail d'un personproject
        $routes->post('/', 'Api\PersonProjectController::create');          // Création d'un personproject
        $routes->put('(:num)', 'Api\PersonProjectController::update/$1');   // Modification d'un personproject
        $routes->delete('(:num)', 'Api\PersonProjectController::delete/$1');// Suppression d'un personproject
    });

    $routes->group('user_skills', function($routes){
        $routes->get('/', 'Api\UserSkillController::index');            // Liste tous les user_skills
        $routes->get('(:num)', 'Api\UserSkillController::show/$1');     // Détail d'un user_skill
        $routes->post('/', 'Api\UserSkillController::create');          // Création d'un user_skill
        $routes->put('(:num)', 'Api\UserSkillController::update/$1');   // Modification d'un user_skill
        $routes->delete('(:num)', 'Api\UserSkillController::delete/$1');// Suppression d'un user_skill
    });
});

// A simple route for testing
$routes->get('hello', function() {
    return "Hello, World!";
});