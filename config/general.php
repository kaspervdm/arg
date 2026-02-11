<?php
/**
 * General Configuration
 *
 * All of your system's general configuration settings go in here. You can see a
 * list of the available settings in vendor/craftcms/cms/src/config/GeneralConfig.php.
 *
 * @see \craft\config\GeneralConfig
 */

use craft\helpers\App;

return [

    "*" => [
        "allowAdminChanges" => false,
        "defaultCpLanguage" => "en_GB",
        "defaultCpLocale" => "nl_BE",
        "defaultTokenDuration" => "P10D",
        "defaultWeekStartDay" => 1,
        "disallowRobots" => true,
        "elevatedSessionDuration" => 360000,
        "enableCsrfProtection" => true,
        "enableGql" => false,
        "enableTemplateCaching" => false,
        "errorTemplatePrefix" => "_errors/",
        "maxRevisions" => 10,
        "omitScriptNameInUrls" => true,
        "postCpLoginRedirect" => "entries",
        "sameSiteCookieValue" => "Lax",
        "securityKey" => App::env("CRAFT_SECURITY_KEY"),
        "useEmailAsUsername" => true,
        "verificationCodeDuration" => "P3W",

        "aliases" => [
            '@webroot' => dirname(__DIR__) . '/web',
            '@uploads' => dirname(__DIR__) . '/web/uploads',
            '@primaryBaseUrl' => App::env('PRIMARY_SITE_URL'),
            '@siteUrlNl' => App::env('PRIMARY_SITE_URL') . '/nl',
            '@siteUrlEn' => App::env('PRIMARY_SITE_URL') . '/en',
            '@siteUrlFr' => App::env('PRIMARY_SITE_URL') . '/fr',
        ],

    ],

    "production" => [
        "disallowRobots" => false,
        "enableTemplateCaching" => true,
    ],

    "staging" => [
        "devMode" => true,
        "testToEmailAddress" => App::env("MAIL_DEBUG_ADDRESS"),
    ],

    "dev" => [
        "allowAdminChanges" => true,
        "devMode" => true,
        "testToEmailAddress" => App::env("MAIL_DEBUG_ADDRESS"),
    ],

    "offline" => [
        "isSystemLive" => false,
    ]

];