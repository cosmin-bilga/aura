<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION FAVORITE OFFERS DU CLIENT
 * PARAMS : id_customer
 * AUTH: token matching id_customer
 * RETURN: array [{id_favOffer, id_customer, id_offer, created_at}]
 * 
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        
        favOffers_get($requestData);
        break;

    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function favOffers_get(array $requestData): void {
    $conn = Connection::getConnection();

   
    if (!isset($requestData["id_customer"])) {
        echo json_encode(["message" => "Missing id_customer parameter"]);
        http_response_code(400);
        return;
    }

    if (!isset($requestData["token"])) {
        echo json_encode(["message" => "Missing token"]);
        http_response_code(400);
        return;
    }

    
    $id_customer = (int)$requestData["id_customer"];
    if ($id_customer <= 0) {
        echo json_encode(["message" => "Invalid customer ID"]);
        http_response_code(400);
        return;
    }

    $token = trim($requestData["token"]);
    if (empty($token)) {
        echo json_encode(["message" => "Empty token"]);
        http_response_code(400);
        return;
    }

    
    $isAuthorized = check_token($token, $id_customer, false);
    if (!$isAuthorized) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    try {
        
        $sql = "SELECT id_customer FROM customers WHERE id_customer = :id_customer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_customer" => $id_customer]);
        $customerExists = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$customerExists) {
            echo json_encode(["message" => "Customer not found"]);
            http_response_code(404);
            return;
        }

        
        $sql = "SELECT * FROM fav_offers WHERE id_customer = :id_customer ORDER BY created_at DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_customer" => $id_customer]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

      
        add_token($token, $id_customer, false);

        echo json_encode($res);
        http_response_code(200);

    } catch (PDOException $e) {
        echo json_encode(["message" => "Database error"]);
        http_response_code(500);
        return;
    }
}