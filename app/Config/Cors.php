<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 */
class Cors extends BaseConfig
{
    public array $default = [
        'allowedOrigins' => ['*'], // Permet les requêtes depuis ton frontend
        'allowedOriginsPatterns' => [],
        'supportsCredentials' => false,
        'allowedHeaders' => ['Content-Type', 'Authorization'], // Autorise les en-têtes nécessaires
        'exposedHeaders' => [],
        'allowedMethods' => ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
        'maxAge' => 7200,
    ];
}