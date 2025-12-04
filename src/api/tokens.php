<?php

declare(strict_types=1);

/**
 * Fichier avec les fonctions necessaires pour manipuler les tokens de connexion à l'API
 */

require_once "connection.php";

function generate_token(): string
{
    $token = str_replace("=", "", base64_encode(random_bytes(160 / 8)));
    return $token;
}
function add_token(string $token, int $id, string $role = "customer"): void
{
    $conn = Connection::getConnection();

    // On mappe le "role" sur la colonne admin : admin = 1 si rôle "admin", sinon 0
    $isAdmin = ($role === "admin") ? 1 : 0;

    $sql = "INSERT INTO tokens (token, id_customer, admin)
            VALUES (:token, :id_customer, :admin)";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        ":token"       => $token,
        ":id_customer" => $id,
        ":admin"       => $isAdmin
    ]);
}



// On verifie le token d'acces: s'il existe, si l'utilisateur a acces à la donné ou si token admin
function check_token(string $token, int $id = -1, string $role = "customer"): bool
{
    try {
        $conn = Connection::getConnection();
        
        $sql = "SELECT id_customer, admin FROM tokens WHERE token = :token";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":token" => $token]);
        $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);

        
        if (!$tokenData) {
            return false;
        }

    $sql = "SELECT id_customer, role
            FROM tokens
            WHERE token = :token";

       
        if ($id !== -1) {
            return (int)$tokenData["id_customer"] === $id;
        }

        
        return true;

    } catch (PDOException $e) {
        
        return false;
    }


    if ($id === -1 && $role === "admin")
        return $tokenData["role"] === $role;
    if ($id !== -1)
        if ($tokenData["role"] === "admin")
            return true;
        else
            return ($tokenData["role"] === $role && $tokenData["id_customer"] === $id);
    return false;
}


