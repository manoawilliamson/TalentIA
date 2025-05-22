<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');
$routes->get('/dashboard', 'DashboardController::index', ['filter' => 'auth']); // Ensure this matches your controller name
$routes->get('/auth', 'Auth::index'); // The login page
$routes->post('/auth/login', 'Auth::login'); // Process login form
$routes->get('/auth/logout', 'Auth::logout'); // Process logout

$routes->group('/users',['filter' => 'auth'], function($routes) {
    $routes->get('', 'UserController::index'); // List users
    $routes->get('create', 'UserController::create'); // Form to create a new user
    $routes->post('store', 'UserController::store'); // Handle new user submission
    $routes->get('edit/(:num)', 'UserController::edit/$1'); // Form to edit user
    $routes->post('update/(:num)', 'UserController::update/$1'); // Handle user update
    $routes->get('delete/(:num)', 'UserController::delete/$1'); // Handle user deletion
});

$routes->group('skills',['filter' => 'auth'], function($routes) {
    $routes->get('', 'SkillController::index'); // List skills
    $routes->get('create', 'SkillController::create'); // Form to create a new skill
    $routes->post('store', 'SkillController::store'); // Handle new skill submission
    $routes->get('edit/(:num)', 'SkillController::edit/$1'); // Form to edit skill
    $routes->post('update/(:num)', 'SkillController::update/$1'); // Handle skill update
    $routes->get('delete/(:num)', 'SkillController::delete/$1'); // Handle skill deletion
});

$routes->group('projects',['filter' => 'auth'], function($routes) {
    $routes->get('', 'ProjectController::index'); // List projects
    $routes->get('create', 'ProjectController::create'); // Fskillorm to create a project 
    $routes->post('store', 'ProjectController::store'); // Handle new project submission
    $routes->get('edit/(:num)', 'ProjectController::edit/$1'); // Form to edit project
    $routes->post('update/(:num)', 'ProjectController::update/$1'); // Handle project update
    $routes->get('delete/(:num)', 'ProjectController::delete/$1'); // Handle project deletion
    $routes->get('fiche/(:num)', 'ProjectController::detail/$1'); // Handle project deletion
    $routes->get('download/(:segment)', 'ProjectController::download/$1');
});

$routes->group('projectskills', ['filter' => 'auth'], function($routes) {;
    $routes->get('create/(:num)', 'ProjectSkillsController::index/$1');
    $routes->get('list/(:num)', 'ProjectSkillsController::list/$1');
    $routes->post('store', 'ProjectSkillsController::store');
    $routes->get('edit/(:num)/(:segment)', 'ProjectSkillsController::edit/$1/$2');
    $routes->get('delete/(:num)/(:segment)', 'ProjectSkillsController::delete/$1/$2');
    $routes->post('update/(:num)', 'ProjectSkillsController::updateSkill/$1'); // Handle skill update

});
$routes->group('person', ['filter' => 'auth'], function($routes) {;
    $routes->get('', 'PersonController::index');
    $routes->get('create', 'PersonController::create');
    $routes->post('store', 'PersonController::store'); 
    $routes->get('edit/(:num)', 'PersonController::edit/$1');
    $routes->post('update/(:num)', 'PersonController::update/$1');
    $routes->get('delete/(:num)', 'PersonController::delete/$1'); 
    $routes->get('fiche/(:num)', 'PersonController::detail/$1'); // Handle project deletion
});

$routes->group('personskills', ['filter' => 'auth'], function($routes) {;
    $routes->get('create/(:num)', 'PersonSkillsController::index/$1');
});


$routes->group('user_skills',['filter' => 'auth'], function($routes) {
    try{
        $routes->get('', 'UserSkillController::index'); // List user skills
        $routes->get('create', 'UserSkillController::create'); // Form to create a new user skill
        $routes->post('store', 'UserSkillController::store'); // Handle new user skill submission
        $routes->get('edit/(:num)', 'UserSkillController::edit/$1'); // Form to edit user skill
        $routes->post('update/(:num)', 'UserSkillController::update/$1'); // Handle user skill update
        $routes->get('delete/(:num)', 'UserSkillController::delete/$1'); // Handle user skill deletion
        $routes->get('test', 'UserSkillController::test_user_skills'); // Handle user skill deletion
    }catch(\Exception $e){
        var_dump($e);
    }
});

// API routes (if applicable)
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
    $routes->group('skills', function($routes){
        $routes->get('/', 'SkillController::index');
        $routes->post('/', 'SkillController::save');
        $routes->put('(:num)', 'SkillController::modify/$1');
        $routes->delete('(:num)', 'SkillController::deleteSkill/$1');
    });
    $routes->group('projects', function($routes){
        $routes->get('/', 'ProjectController::index');
        $routes->post('/', 'ProjectController::save');
        $routes->put('(:num)', 'ProjectController::modify/$1');
        $routes->delete('(:num)', 'ProjectController::deleteSkill/$1');
        $routes->post('(:num)/add-detail-stack', 'ProjectController::addTechDataToProject/$1');
        $routes->get('(:num)/get-detail-stack', 'ProjectController::getStacksForProject/$1');
    });
});

// A simple route for testing
$routes->get('hello', function() {
    return "Hello, World!";
});