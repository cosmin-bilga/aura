<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS SERVICE
 * PARAMS : id_service
 * AUTH: token matching id_customer OR admin token
 * RETURN: id_service, id_customer, id_offer, service_date, statut, amount, payment_date, payment_method, payment_reference, created_at, updated_at	
 * 
 * -- POST: CREATION SERVICE
 * PARAMS: id_customer, id_offer, service_date, ?statut, amount, payment_date, payment_method, payment_reference
 * AUTH: admin token
 * RETURN: message
 * 
 * -- POST: MODIFICATION SERVICE
 * PARAMS: id_service, ?id_customer, ?id_offer, ?service_date, ?statut, ?amount, ?payment_date, ?payment_method, ?payment_reference
 * AUTH: admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER SERVICE
 * PARAMS: id_service
 * AUTH: admin token
 * RETURN: message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../service_validation.php";

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
        service_get($requestData);
        break;
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        service_update($requestData);
        break;
    case 'DELETE':
        $requestData = getJsonBody();
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        service_delete($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function service_get(array $requestData): void
{

    $conn = Connection::getConnection();

    if (!isset($requestData["id_service"])) {
        echo json_encode(["message" => "id_service is missing"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM services WHERE id_service=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_service"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Service not found"]);
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
        if (in_array($key, ["id_customer", "id_offer", "service_date", "statut", "amount", "payment_date", "payment_method", "payment_reference"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_service"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function service_update(array $requestData): void
{
    if (!isset($requestData["id_service"])) {
        service_register($requestData);
        return;
    }

    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM services WHERE id_service=:id";
        var_dump($sql);
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_service"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Service not found"]);
        http_response_code(500);
        return;
    }

    $access = check_token($requestData["token"], intval($res["id_customer"]));
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

        $sql = "UPDATE services SET " . $build["fields"] . " WHERE id_service=:id;";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Service succesfully updated"]);
}

function service_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);


    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400);
        return;
    }

    if (!isset($requestData["id_customer"])) {
        echo json_encode(["message" => "No id_customer in query"]);
        http_response_code(400);
        return;
    }

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "No id_offer in query"]);
        http_response_code(400);
        return;
    }

    #TODO CHECK  OFFER DISPONIBILITY
    // $is_available = check_offer_availability(offer, date, )

    $conn = Connection::getConnection();

    $access = check_token($requestData["token"], intval($requestData["id_customer"]));
    if ($access === false) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    try {
        $sql = "INSERT INTO services (id_customer, id_offer, service_date, statut, amount, payment_date, payment_method, payment_reference) VALUES (:id_customer, :id_offer, :service_date, :statut, :amount, :payment_date, :payment_method, :payment_reference);";
        $stmt = $conn->prepare($sql);

        $res = $stmt->execute([
            ":id_customer" => $requestData["id_customer"],
            ":id_offer" => $requestData["id_offer"],
            ":service_date" => $requestData["service_date"],
            ":statut" => $requestData["statut"] ?? "en attente",
            ":amount" => $requestData["amount"],
            ":payment_date" => $requestData["payment_date"],
            ":payment_method" => $requestData["payment_method"],
            ":payment_reference" => $requestData["payment_reference"],
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }
    echo json_encode(["message" => "Service succesfully created"]);
}

function service_delete(array $requestData): void
{

    if (!isset($requestData["id_service"])) {
        echo json_encode(["message" => "No id_service"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();


    try {
        $sql = "SELECT * FROM services WHERE id_service=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_service"]
        ]);

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    if ($res === false) {
        echo json_encode(["message" => "Service not found"]);
        http_response_code(500);
        return;
    }


    $access = check_token($requestData["token"], -1, "admin");
    if ($access) {
        try {
            $sql = "DELETE FROM services WHERE id_service=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_service"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        echo json_encode(["message" => "Service deleted"]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }
}
