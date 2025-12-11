<?php

declare(strict_types=1);

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : ?name, ?firstname, ?email, ?phone_number, ?address, ?education_experience, ?SIREN, ?additional_information, ?status
 * AUTH:  admin token
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

    $build = build_where_clause($requestData);

    try {
        $sql = "SELECT * FROM service_providers";
        if (strlen($build['fields']) > 0)
            $sql .= " WHERE " . $build['fields'];
        if (isset($requestData["limit"]))
            $sql .= " LIMIT " . $requestData["limit"];
        if (isset($requestData["offset"]))
            $sql .= " OFFSET " . $requestData["offset"];

        $stmt = $conn->prepare($sql);
        $stmt->execute($build["execute"]);
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

function build_where_clause(array $requestData): array
{
    //?name, ?firstname, ?email, ?phone_number, ?address, ?education_experience, ?SIREN, ?additional_information, ?status
    $res = array();
    $fields = array();
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, [
            "email",
            "firstname",
            "name",
            "address",
            "additional_information",
            "payment_date",
            "phone_number",
            "education_experience",
            "SIREN",
            "status"
        ])) {
            array_push($fields, $key . " LIKE :" . $key);
            $execute[":" . $key] = "%" . $value . "%";
        }
    }
    $fields = implode(" AND ", $fields);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}
