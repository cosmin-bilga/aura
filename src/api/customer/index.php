<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES CLIENT
 * PARAMS : email OR id_customer
 * AUTH: token matching id_customer OR admin token
 * RETURN: id_customer, email, firstname, name, address, phone_number, sex, additional_information, crated_at, updated_at
 * 
 * -- POST: MODIFICATION DONNEES CLIENT
 * PARAMS: id_customer, ?email, ?password, ?firstname, ?name, ?address, ?phone_number, ?sex, ?additional_information
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER CLIENT
 * PARAMS: id_customer OR email
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"]; //ICI ON MET LE TOKEN
        }
        customer_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function customer_get(array $requestData): void
{
    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM customers WHERE id_customer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "User ID does not exist"]);
        http_response_code(500);
        return;
    }

    if ($res["id_customer"] === $requestData["id"])
        $access = check_token($requestData["token"], $res["id_customer"], false);
    else
        $access = check_token($requestData["token"], $res["id_customer"], true);
    if ($access) {
        echo json_encode($res);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access forbidden"]);
        http_response_code(403);
    }
}
