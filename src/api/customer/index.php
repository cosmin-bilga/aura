<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES CLIENT
 * PARAMS : id_customer
 * AUTH: token matching id_customer OR admin token
 * RETURN: id_customer, email, firstname, name, address, phone_number, sex, additional_information, crated_at, updated_at
 * 
 * -- POST: INSCRIPTION CLIENT
 * PARAMS: email, password, firstname, name, address, phone_number, sex, additional_information
 * AUTH: none
 * RETURN: message
 * 
 *  -- POST: MODIFICATION DONNEES CLIENT
 * PARAMS: id_customer, ?email, ?password, ?firstname, ?name, ?address, ?phone_number, ?sex, ?additional_information
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER CLIENT
 * PARAMS: id_customer
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";
require_once "../customer_validation.php";

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
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        customer_get($requestData);
        break;
    case 'POST':
        $requestData = $_POST;
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        customer_update($requestData);
        break;
    case 'DELETE':
        $requestData = getJsonBody();
        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }
        customer_delete($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function customer_get(array $requestData): void
{

    if (!(isset($requestData["id_customer"]) || isset($requestData["email"]))) {
        echo json_encode(["message" => "ID or email not provided"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    try {
        if (isset($requestData["id_customer"])) {
            $sql = "SELECT * FROM customers WHERE id_customer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_customer"]
            ]);
        } else {
            $sql = "SELECT * FROM customers WHERE email=:email";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":email" => $requestData["email"]
            ]);
        }
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        // echo $e->getMessage();
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }

    if ($res === false) {
        echo json_encode(["message" => "User not found"]);
        http_response_code(500);
        return;
    }

    /*  var_dump($res["id_customer"]);
    var_dump($requestData["id_customer"]); */


    if ($res["id_customer"] === intval($requestData["id_customer"]) || (isset($requestData["email"]) && $res["email"] === $requestData["email"]))
        $access = check_token($requestData["token"], $res["id_customer"]);
    else
        $access = false;
    if ($access) {
        echo json_encode($res);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access forbidden"]);
        http_response_code(403);
    }
}

function build_update_query(array $requestData): array
{
    $res = array();
    $fields = "";
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["name", "firstname", "email", "phone_number", "address", "sex", "password", "additional_information"])) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 2);
    $execute[":id"] = intval($requestData["id_customer"]);
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}

function customer_update(array $requestData): void
{

    if (!isset($requestData["id_customer"])) {
        customer_register($requestData);
        return;
    }

    //print_r($requestData);
    $requestData = validate_input_update($requestData);
    $requestData = sanitize_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"][0]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    if (isset($requestData["password"]))
        $requestData["password"] = password_hash($requestData["password"], PASSWORD_DEFAULT);

    $access = check_token($requestData["token"], intval($requestData["id_customer"]));
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

        $sql = "UPDATE customers SET " . $build["fields"] . " WHERE id_customer=:id;";
        /* echo ($sql);
        print_r($build["execute"]); */
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully updated"]);
}

function customer_register(array $requestData): void
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
        $sql = "INSERT INTO customers (name, firstname, email, password, phone_number, address, sex, additional_information) VALUES (:name, :firstname, :email, :password, :phone_number, :address, :sex, :additional_info);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"] ?? "",
            ":sex" => $requestData["sex"] ?? "M",
            ":additional_info" => $requestData["additional_information"] ?? ""
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully created"]);
}

function customer_delete(array $requestData): void
{

    if (!isset($requestData["id_customer"])) {
        echo json_encode(["message" => "ID not provided"]);
        http_response_code(400);
        return;
    }

    $conn = Connection::getConnection();

    $access = check_token($requestData["token"], intval($requestData["id_customer"]));
    if ($access) {
        try {
            $sql = "SELECT * FROM customers WHERE id_customer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_customer"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        if ($res === false) {
            echo json_encode(["message" => "User not found"]);
            http_response_code(500);
            return;
        }

        try {
            $sql = "DELETE FROM customers WHERE id_customer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_customer"]
            ]);

            $res = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // echo $e->getMessage();
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        echo json_encode(["message" => "Customer deleted"]);
        http_response_code(200);
    } else {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }
}
