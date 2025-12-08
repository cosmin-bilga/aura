<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 *
 * -- GET: RECUPERATION DISPONIBILITES 
 * PARAMS : id_offer
 * AUTH: none
 * RETURN: array [... {id_disponibility, id_offer, start_date, end_date}]
 *
 * -- POST: CREATION OU MODIFICATION DISPONIBILITE
 * CREATION - PARAMS: id_offer, start_date, end_date
 * AUTH: token matching provider who has offer
 * MODIFICATION - PARAMS: id_disponibility, start_date, end_date
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 *
 * -- DELETE: SUPPRIMER COMMENT
 * PARAMS: id_disponibility, token
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../disponibility_validation.php";



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
        dispo_get($requestData);
        break;

    case 'POST':
        $requestData = $_POST;

        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }

        dispo_update($requestData);
        break;

    case 'DELETE':
        $requestData = getJsonBody();

        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }

        dispo_delete($requestData);
        break;

    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function dispo_get(array $requestData): void
{

    $conn = Connection::getConnection();

    if (!isset($requestData["id_dispo"])) {
        echo json_encode(["message" => "id_dispo is missing"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM disponibilities WHERE id_disponibility=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_disponibility"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Disponibility not found"]);
        http_response_code(500);
        return;
    }

    echo json_encode($res);
    http_response_code(200);
}

function build_update_query(array $requestData): array
{
    $res = array();
    $fields = array();
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["start_date", "end_date"])) {
            array_push($fields, $key . " = :" . $key);
            $execute[":" . $key] = $value;
        }
    }
    $fields = implode(", ", $fields);
    $execute[":id"] = intval($requestData["id_disponibility"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function dispo_update(array $requestData): void
{
    if (!isset($requestData["id_disponibility"])) {
        dispo_register($requestData);
        return;
    }

    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM disponibilities JOIN offers on disponibilities.id_offer = offers.id_offer WHERE id_disponibility=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_disponibility"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Disponibility not found"]);
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

        $sql = "UPDATE disponibilities SET " . $build["fields"] . " WHERE id_disponibility=:id;";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Disponibility succesfully updated"]);
}

function dispo_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400);
        return;
    }

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "No id_offer in query"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM offers WHERE id_offer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => intval($requestData["id_offer"])
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
        $sql = "INSERT INTO disponibilities (id_offer, start_date, end_date) VALUES (:id_offer, :start_date, :end_date);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":id_offer" => $requestData["id_offer"],
            ":start_date" => $requestData["start_date"],
            ":end_date" => $requestData["end_date"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }
    echo json_encode(["message" => "Disponibility succesfully created"]);
}

function dispo_delete(array $requestData): void
{

    if (!isset($requestData["id_disponibility"])) {
        echo json_encode(["message" => "No id_disponibility"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        $sql = "SELECT * FROM disponibilities JOIN offers on disponibilities.id_offer = offers.id_offer WHERE id_disponibility=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_disponibility"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Disponibility not found"]);
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
        $sql = "DELETE FROM disponibilities WHERE id_disponibility=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_disponibility"]
        ]);

        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    echo json_encode(["message" => "Disponibility deleted"]);
    http_response_code(200);
}
