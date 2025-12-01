<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION D'UNE LISTE DES SERVICES CORRESPONDANT AUX FILTRES
 * PARAMS : ?id_customer, ?id_offer, ?service_date, ?statut, ?amount, ?payement_date
 * AUTH: token matching id_customer OR admin token OR token matching id_provider
 * RETURN: array [... {id_service, id_customer, id_offer, service_date, statut, amount, payment_date, payment_method, payment_reference, created_at, updated_at}]	
 * 
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../service_validation.php";

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        services_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function build_where_clause(array $requestData): array
{
    $res = array();
    $fields = array();
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, [
            "id_customer",
            "id_offer",
            "service_date",
            "statut",
            "amount",
            "payment_date"
        ])) {
            array_push($fields, $key . " = :" . $key);
            $execute[":" . $key] = $value;
        }
    }
    $fields = implode(" AND ", $fields);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}


function services_get($requestData)
{
    $conn = Connection::getConnection();

    $requestData = sanitize_input($requestData);
    $build = build_where_clause($requestData);

    try {
        $sql = "SELECT * FROM services";
        if (strlen($build['fields']) > 0)
            $sql .= " WHERE " . $build['fields'];
        if (isset($requestData["limit"]))
            $sql .= " LIMIT " . $requestData["limit"];
        if (isset($requestData["offset"]))
            $sql .= " OFFSET " . $requestData["offset"];


        /* var_dump($sql);
        var_dump($build["execute"]); */
        $stmt = $conn->prepare($sql);
        $stmt->execute($build["execute"]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "No services found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}
