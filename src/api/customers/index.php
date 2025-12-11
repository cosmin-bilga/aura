<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES CLIENT
 * PARAMS : ?id_customer, ?email, ?firstname, ?name, ?address, ?phone_number, ?sex, ?additional_information, ?created_at, ?updated_at
 * AUTH: admin token
 * RETURN: array [...{id_customer, email, firstname, name, address, phone_number, sex, additional_information, crated_at, updated_at}]
 * 
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
//require_once "../customer_validation.php";


switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        customers_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function customers_get(array $requestData): void
{

    $conn = Connection::getConnection();

    #TODO FILTRES

    try {
        $sql = "SELECT * FROM customers";
        $stmt = $conn->prepare($sql);
        $stmt->execute([]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Users not found"]);
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
        if (in_array($key, ["name", "firstname", "email", "phone_number", "address", "sex", "password", "additional_information"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_customer"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}
