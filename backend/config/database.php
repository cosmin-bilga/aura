<?php

define('DB_HOST', 'localhost');
define('DB_USERNAME','root');
define('DB_PASSWORD','');
define('DB_DATABASE','aura');

define('DB_OPTIONS', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);

function db(): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_DATABASE . ';charset=utf8mb4';
    $pdo = new PDO($dsn, DB_USERNAME, DB_PASSWORD, DB_OPTIONS);
    return $pdo;
}