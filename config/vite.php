<?php

use craft\helpers\App;

return [
    'checkDevServer' => true,
	'devServerInternal' => 'http://localhost:3000',
	'devServerPublic' => preg_replace('/:\d+$/', '', App::env('PRIMARY_SITE_URL')) . ':3000',
	'serverPublic' => App::env('PRIMARY_SITE_URL') . '/dist/',
	'useDevServer' => App::env('ENVIRONMENT') === 'dev' || App::env('CRAFT_ENVIRONMENT') === 'dev',
    'manifestPath' => '@webroot/dist/.vite/manifest.json',
    'errorEntry' => '',
    'cacheKeySuffix' => '',
    'checkDevServer' => false,
    'includeReactRefreshShim' => false,
    'includeModulePreloadShim' => true,
    'criticalPath' => '@webroot/dist/criticalcss',
    'criticalSuffix' =>'_critical.min.css',
];