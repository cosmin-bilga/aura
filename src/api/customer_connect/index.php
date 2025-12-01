<?php

/**
 * METHODS: POST, OPTIONS
 * 
 * -- POST:
 * PARAMS : email, password
 * AUTH: none
 * RETURN: ?token, message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        customer_connect($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}

function customer_connect(array $requestData): void
{
    if (!isset($requestData["email"])) {
        http_response_code(400);
        echo json_encode(["message" => "Login required"]);
    }
    if (!isset($requestData["password"])) {
        http_response_code(400);
        echo json_encode(["message" => "Password required"]);
    }

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
    if (!$res) {
        http_response_code(202); // ACCEPTED
        echo json_encode(["message" => "Login not found"]);
        return;
    }
    if (password_verify($requestData["password"], $res["password"])) {
        $token = generate_token();
        add_token($token, $res["id_customer"], "customer");
        http_response_code(202); // ACCEPTED
        echo json_encode(["token" => $token, "message" => "User logged in"]);
        return;
    }
    http_response_code(403); // FORBIDDEN
    echo json_encode(["message" => "Wrong password"]);
}
