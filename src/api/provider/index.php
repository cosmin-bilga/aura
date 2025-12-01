<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : id_provider
 * AUTH: token matching id_provider OR admin token
 * RETURN: id_provider, name, firstname, email, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, created_at, updated_at, statut
 * 
 * -- POST: INSCRIPTION PRESTATAIRE
 * PARAMS: name, firstname, email, password, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, statut
 * AUTH: none
 * RETURN: message
 * 
 * -- POST: MODIFICATION DONNEES PRESTATAIRE
 * PARAMS: id_provider, ?name, ?firstname, ?email, ?password, ?phone_number, ?address, ?profile_picture, ?education_experience, ?subscriber, ?sexe, ?SIREN, ?additional_information, ?statut
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER PRESTATARIE
 * PARAMS: id_provider OR email
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../provider_validation.php";

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
        provider_get($requestData);
        break;
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        provider_update($requestData);
        break;
    case 'DELETE':
        $requestData = getJsonBody();
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        provider_delete($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function provider_get(array $requestData): void
{

    $conn = Connection::getConnection();

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "id_provider is missing"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM service_providers WHERE id_provider=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_provider"]
        ]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "Provider not found"]);
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
        if (in_array($key, ["name", "firstname", "email", "password", "phone_number", "address", "profile_picture", "education_experience", "subscriber", "sex", "SIREN", "additional_information", "statut"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_provider"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function provider_update(array $requestData): void
{
    if (!isset($requestData["id_provider"])) {
        provider_register($requestData);
        return;
    }

    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "No id_provider in query"]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (isset($requestData["password"]))
        $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $access = check_token($requestData["token"], intval($requestData["id_provider"]), "provider");
    if (!$access) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    $conn = Connection::getConnection();

    try {
        /*  print_r($requestData); */
        $build = build_update_query($requestData);
        if (strlen($build["fields"]) === 0) {
            echo json_encode(["message" => "No updates made"]);
            http_response_code(400);
            return;
        }

        $sql = "UPDATE service_providers SET " . $build["fields"] . " WHERE id_provider=:id;";
        /* echo ($sql);
        print_r($build["execute"]); */
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Provider succesfully updated"]);
}

function provider_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $conn = Connection::getConnection();

    try {
        $sql = "INSERT INTO service_providers (name, firstname, email, password, phone_number, address, profile_picture, education_experience, subscriber, sex, SIREN, additional_information, statut) VALUES (:name, :firstname, :email, :password, :phone_number, :address, :profile_picture, :education_experience, :subscriber, :sex, :SIREN, :additional_info, :statut);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"] ?? "",
            ":profile_picture" => $requestData["profile_picture"] ?? "",
            ":education_experience" => $requestData["education_experience"] ?? "",
            ":subscriber" => "none",
            ":sex" => $requestData["sex"] ?? "Autre",
            ":SIREN" => $requestData["SIREN"],
            ":additional_info" => $requestData["additional_information"] ?? "",
            ":statut" => $requestData["statut"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }
    echo json_encode(["message" => "Service provider succesfully created"]);
}

function provider_delete(array $requestData): void
{

    if (!isset($requestData["id_provider"])) {
        echo json_encode(["message" => "No id_provider"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    $access = check_token($requestData["token"], intval($requestData["id_provider"]), "provider");
    if ($access) {
        try {
            $sql = "SELECT * FROM service_providers WHERE id_provider=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_provider"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
            return;
        }

        if ($res === false) {
            echo json_encode(["message" => "Provider not found"]);
            http_response_code(500);
            return;
        }

        try {
            $sql = "DELETE FROM service_providers WHERE id_provider=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_provider"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        echo json_encode(["message" => "Provider deleted"]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }
}
