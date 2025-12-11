<?php

declare(strict_types=1);

/**
 * Fichier avec les fonctions necessaires pour manipuler les tokens de connexion à l'API
 */

require_once "connection.php";

const SESSION_DURATION = 360; // durée en minutes; validité du token

function generate_token(): string
{
    $token = str_replace("=", "", base64_encode(random_bytes(160 / 8)));
    return $token;
}
function add_token(string $token, int $id, string $role = "customer"): void
{
    $conn = Connection::getConnection();

    try {
        $sql = "DELETE from tokens WHERE id_customer=:id AND role=:role";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $id,
            ":role" => $role
        ]);
    } catch (PDOException $e) {
        echo $e->getMessage();
    }

    try {
        $sql = "INSERT INTO tokens (token, id_customer, role)
            VALUES (:token, :id_customer, :role)";


        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":token"       => $token,
            ":id_customer" => $id,
            ":role"       => $role
        ]);
    } catch (PDOException $e) {
        return;
    }
}


// On verifie le token d'acces: s'il existe, si l'utilisateur a acces à la donné ou si token admin
function check_token(string $token, int $id = -1, string $role = "customer"): bool
{
    try {
        $conn = Connection::getConnection();

        $sql = "SELECT id_customer, role, created_at FROM tokens WHERE token = :token";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":token" => $token]);
        $tokenData = $stmt->fetch(PDO::FETCH_ASSOC);


        if (!$tokenData) {
            return false;
        }


        /*  if ($id !== -1) {
            return (int)$tokenData["id_customer"] === $id;
        } */
    } catch (PDOException $e) {

        return false;
    }

    $creation_date = DateTime::createFromFormat("Y-m-d H:i:s",  $tokenData["created_at"]);
    $now = new DateTime("now");

    if ($creation_date->getTimestamp() + (SESSION_DURATION * 60) < $now->getTimestamp()) // Session expirée
        return false;

    if ($id === -1 && $role === "admin")
        return $tokenData["role"] === $role;
    if ($id !== -1)
        if ($tokenData["role"] === "admin")
            return true;
        else
            return ($tokenData["role"] === $role && $tokenData["id_customer"] === $id);
    return false;
}
