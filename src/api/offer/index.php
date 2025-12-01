<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS OFFRE
 * PARAMS : id_offer
 * AUTH: none
 * RETURN: id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at 	
 * 
 *  * -- POST: AJOUT OFFRE
 * PARAMS: description, duration, category, disponibility, perimeter_of_displacement, price
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- POST: MODIFICATION OFFRE
 * PARAMS: id_offer, ?description, ?duration, ?category, ?disponibility, ?perimeter_of_displacement, ?price
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER OFFRE
 * PARAMS: id_offer
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../offer_validation.php";

header("Content-Type: application/json; charset=UTF-8");

function getJsonBody(): array
{
    $raw = file_get_contents("php://input");
    if ($raw === false || $raw === "") {
        return [];
    }
    $data = json_decode($raw, true);
    if (!is_array($data)) {
        return [];
    }
    return $data;
}

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        offer_get($requestData);
        break;
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        offer_update($requestData);
        break;
    case 'DELETE':
        $requestData = getJsonBody();
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        offer_delete($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function offer_get(array $requestData): void
{

    $conn = Connection::getConnection();

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "id_offer is missing"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM offers WHERE id_offer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_offer"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
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
        if (in_array($key, ["description", "duration", "category", "disponibility", "perimeter_of_displacement", "price", "id_provider"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_offer"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function offer_update(array $requestData): void
{
    if (!isset($requestData["id_offer"])) {
        offer_register($requestData);
        return;
    }

    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM offers WHERE id_offer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_offer"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(500);
        return;
    }

    $access = check_token($requestData["token"], intval($res["id_provider"]), "provider");
    if (!$access) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }


    try {
        /*  print_r($requestData); */
        $build = build_update_query($requestData);
        if (strlen($build["fields"]) === 0) {
            echo json_encode(["message" => "No updates made"]);
            http_response_code(400);
            return;
        }

        $sql = "UPDATE offers SET " . $build["fields"] . " WHERE id_offer=:id;";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Offer succesfully updated"]);
}

function offer_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400);
        return;
    }

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "No id_provider in query"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        $sql = "INSERT INTO offers (description, duration, category, disponibility, perimeter_of_displacement, price, id_provider) VALUES (:description, :duration, :category, :disponibility, :perimeter_of_displacement, :price, :id_provider);";
        $stmt = $conn->prepare($sql);
        var_dump($sql);
        var_dump($requestData["category"]);
        $res = $stmt->execute([
            ":description" => $requestData["description"],
            ":duration" => $requestData["duration"],
            ":category" => $requestData["category"],
            ":disponibility" => $requestData["disponibility"],
            ":perimeter_of_displacement" => $requestData["perimeter_of_displacement"],
            ":price" => $requestData["price"],
            ":id_provider" => $requestData["id_provider"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }
    echo json_encode(["message" => "Offer succesfully created"]);
}

function offer_delete(array $requestData): void
{

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "No id_offer"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();



    try {
        $sql = "SELECT * FROM offers WHERE id_offer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_offer"]
        ]);

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(500);
        return;
    }


    $access = check_token($requestData["token"], intval($res["id_provider"]), "provider");
    if ($access) {
        try {
            $sql = "DELETE FROM offers WHERE id_offer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_offer"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        echo json_encode(["message" => "Offer deleted"]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }
}
