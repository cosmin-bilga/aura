<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES CLIENT
 * PARAMS : ?email, ?firstname, ?name, ?address, ?phone_number, ?sex, ?additional_information, ?limit, ?offset
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

    $build = build_where_clause($requestData);


    try {
        $sql = "SELECT * FROM customers";
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
        echo json_encode(["message" => "Users not found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}

function build_where_clause(array $requestData): array
{
    //?email, ?firstname, ?name, ?address, ?phone_number, ?additional_information
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
            "phone_number"
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
