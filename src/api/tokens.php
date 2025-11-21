<?php

declare(strict_types=1);

/**
 * Fichier avec les fonctions necessaires pour manipuler les tokens de connexion à l'API
 */

session_start();

if (!isset($_SESSION["token_list"]))
    $_SESSION["token_list"] = [];

require_once "../connection.php";

function generate_token(): string
{
    $token = str_replace("=", "", base64_encode(random_bytes(160 / 8)));
    return $token;
}

// On verifie le token d'acces: s'il existe, si l'utilisateur a acces à la donné ou si token admin
function check_token(string $token, int $id = -1, bool $admin = false): bool
{
    /*  var_dump($_SESSION["token_list"]);
    echo "/n -- " . $token . " -- " . $id; */

    if (isset($_SESSION["token_list"][$token])) {

        if ($id !== -1 && $admin === false)
            return false;
        if ($id !== -1 && $_SESSION["token_list"][$token]["id"] === $id)
            return true;
        if ($admin !== false && $_SESSION["token_list"][$token]["admin"] === true)
            return true;
    }
    return false;
}

// Ajout du token à la liste des tokens, format: [ ... token => { "id_customer" => int , "admin" => bool}]
function add_token(string $token, int $id, bool $admin = false): void
{
    $_SESSION["token_list"][$token] = ["id" => $id, "admin" => $admin];
    //var_dump($_SESSION["token_list"]);
}
