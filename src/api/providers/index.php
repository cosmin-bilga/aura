<?php

declare(strict_types=1);

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : id_provider
 * AUTH: token matching id_provider OR admin token
 * RETURN: id_provider, name, firstname, email, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, created_at, updated_at, statut
 * 
 */


require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");


switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        providers_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function providers_get(array $requestData): void
{

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM service_providers";
        $stmt = $conn->prepare($sql);
        $stmt->execute([]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Providers not found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}

function build_update_query(array $requestData): array
{
    $res = array();
    $fields = "";
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["name", "firstname", "email", "password", "phone_number", "address", "profile_picture", "education_experience", "subscriber", "sex", "SIREN", "additional_information", "status"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_provider"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}
