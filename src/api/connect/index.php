<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET:
 * PARAMS : email, password
 * AUTH: none
 * RETURN: ?token, message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        customer_connect($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function customer_connect(array $requestData): void
{
    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM customers WHERE email=:login";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":login" => $requestData["email"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
    }

    //var_dump($res);
    if ($res["password"] === $requestData["password"]) {
        $token = generate_token();
        add_token($token, $res["id_customer"]);
        http_response_code(202); // ACCEPTED
        echo json_encode(["token" => $token, "message" => "User logged in"]);
        return;
    }
    http_response_code(403); // FORBIDDEN
    echo json_encode(["message" => "Invalid login"]);
}
