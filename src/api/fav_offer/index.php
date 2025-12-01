<?php

/**
 * ENDPOINT: fav_offer - POST/DELETE
 * 
 * -- POST: AJOUT NOUVELLE FAV OFFER
 * PARAMS: id_customer, id_offer
 * AUTH: token matching id_customer
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER FAV OFFER  
 * PARAMS: id_customer, id_offer
 * AUTH: token matching id_customer
 * RETURN: message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";

header("Content-Type: application/json; charset=UTF-8");

function getJsonBody(): array {
    $input = file_get_contents('php://input');
    $decoded = json_decode($input, true);
    return is_array($decoded) ? $decoded : [];
}




$method = strtoupper(trim($_SERVER['REQUEST_METHOD']));

switch ($method) {
    case 'POST':
        $requestData = $_POST;
        
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        
        error_log("POST data: " . json_encode($requestData));
        
        favOffer_post($requestData);
        break;
    
    case 'DELETE':
        
        $requestData = $_POST;
        
        
        if (empty($requestData)) {
            $requestData = getJsonBody();
            error_log("DELETE using JSON body: " . json_encode($requestData));
        } else {
            error_log("DELETE using form-data: " . json_encode($requestData));
        }
        
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }

        favOffer_delete($requestData);
        break;

    default:
        echo json_encode([
            "message" => "Invalid request method", 
            "received_method" => $method,
            "endpoint" => "fav_offer.php",
            "time" => date('H:i:s'),
            "debug_info" => [
                "raw_method" => $_SERVER['REQUEST_METHOD'],
                "post_data" => $_POST,
                "get_data" => $_GET,
                "json_body" => getJsonBody()
            ]
        ]);
        http_response_code(405);
        break;
}

function favOffer_post(array $requestData): void {
    $conn = Connection::getConnection();

   
    if (!isset($requestData["id_customer"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing id_customer parameter",
            "debug_received_data" => $requestData
        ]);
        return;
    }
    
    if (!isset($requestData["id_offer"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing id_offer parameter",
            "debug_received_data" => $requestData
        ]);
        return;
    }

    if (!isset($requestData["token"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing token",
            "debug_received_data" => $requestData
        ]);
        return;
    }

    $id_customer = (int)$requestData["id_customer"];
    $id_offer = (int)$requestData["id_offer"];
    $token = trim($requestData["token"]);

    if ($id_customer <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid customer ID"]);
        return;
    }

    if ($id_offer <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid offer ID"]);
        return;
    }

    if (empty($token)) {
        http_response_code(400);
        echo json_encode(["message" => "Empty token"]);
        return;
    }

    $isAuthorized = check_token($token, $id_customer, false);
    if (!$isAuthorized) {
        http_response_code(403);
        echo json_encode(["message" => "Unauthorized"]);
        return;
    }

    try {
      
        $sql = "SELECT id_customer FROM customers WHERE id_customer = :id_customer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_customer" => $id_customer]);
        $customerExists = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$customerExists) {
            http_response_code(404);
            echo json_encode(["message" => "Customer not found"]);
            return;
        }

       
        $sql = "SELECT id_offer FROM offers WHERE id_offer = :id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_offer" => $id_offer]);
        $offerExists = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$offerExists) {
            http_response_code(404);
            echo json_encode(["message" => "Offer not found"]);
            return;
        }

        
        $sql = "SELECT id_favOffer FROM fav_offers WHERE id_customer = :id_customer AND id_offer = :id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_customer" => $id_customer,
            ":id_offer" => $id_offer
        ]);
        $alreadyExists = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($alreadyExists) {
            http_response_code(409);
            echo json_encode(["message" => "Offer already in favorites"]);
            return;
        }

        
        $sql = "INSERT INTO fav_offers (id_customer, id_offer) VALUES (:id_customer, :id_offer)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_customer" => $id_customer,
            ":id_offer" => $id_offer
        ]);

        add_token($token, $id_customer, false);

        echo json_encode(["message" => "Offer added to favorites", "success" => true]);
        http_response_code(201);

    } catch (PDOException $e) {
        error_log("Database error in favOffer_post: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database error"]);
        return;
    }
}

function favOffer_delete(array $requestData): void {
    $conn = Connection::getConnection();


    if (!isset($requestData["id_customer"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing id_customer parameter",
            "debug_received_data" => $requestData
        ]);
        return;
    }
    
    if (!isset($requestData["id_offer"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing id_offer parameter", 
            "debug_received_data" => $requestData
        ]);
        return;
    }

    if (!isset($requestData["token"])) {
        http_response_code(400);
        echo json_encode([
            "message" => "Missing token",
            "debug_received_data" => $requestData
        ]);
        return;
    }

    $id_customer = (int)$requestData["id_customer"];
    $id_offer = (int)$requestData["id_offer"];
    $token = trim($requestData["token"]);

    if ($id_customer <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid customer ID"]);
        return;
    }

    if ($id_offer <= 0) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid offer ID"]);
        return;
    }

    if (empty($token)) {
        http_response_code(400);
        echo json_encode(["message" => "Empty token"]);
        return;
    }

    $isAuthorized = check_token($token, $id_customer, false);
    if (!$isAuthorized) {
        http_response_code(403);
        echo json_encode(["message" => "Unauthorized"]);
        return;
    }

    try {
        $sql = "SELECT id_favOffer FROM fav_offers WHERE id_customer = :id_customer AND id_offer = :id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_customer" => $id_customer,
            ":id_offer" => $id_offer
        ]);
        $favoriteExists = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$favoriteExists) {
            http_response_code(404);
            echo json_encode(["message" => "Favorite offer not found"]);
            return;
        }

       
        $sql = "DELETE FROM fav_offers WHERE id_customer = :id_customer AND id_offer = :id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_customer" => $id_customer,
            ":id_offer" => $id_offer
        ]);

        if ($stmt->rowCount() === 0) {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete favorite offer"]);
            return;
        }

        add_token($token, $id_customer, false);

        echo json_encode(["message" => "Offer removed from favorites", "success" => true]);
        http_response_code(200);

    } catch (PDOException $e) {
        error_log("Database error in favOffer_delete: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(["message" => "Database error"]);
        return;
    }
}