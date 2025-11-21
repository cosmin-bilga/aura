<?php

/**
 * METHODS: POST, OPTIONS
 * 
 * 
 * -- POST: INSCRIPTION CLIENT
 * PARAMS: email, password, firstname, name, address, phone_number, sex, additional_information
 * AUTH: none
 * RETURN: message
 * 
 */

declare(strict_types=1);

require_once "../connection.php";

header("Content-Type: application/json; charset=UTF-8");

//var_dump($_SERVER['REQUEST_METHOD']);

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $requestData = $_POST;
        customer_register($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400); // BAD REQUEST
        break;
}


function validate_name(string $name): string
{
    if (isset($name) && strlen($name) > 2)
        return "";
    else
        return "Invalid name.";
}

function validate_input(array $requestData): array
{
    $errors = array();
    if (!isset($requestData["name"]))
        array_push($errors, "Error: name is not set");
    elseif (($err = validate_name($requestData["name"])) != "")
        array_push($errors, $err);

    /*  string $firstname = "",
    string $email = "",
    string $phone_number = "",
    string $address = "",
    string $sex = "",
    string $additional_info = "" */
    $requestData["errors"] = $errors;
    return $requestData;
}

function customer_register(array $requestData): void
{
    $requestData = validate_input($requestData);

    if (count($requestData["errors"]) > 0) {
        echo json_encode(["message" => $requestData["errors"]]);
        http_response_code(400); // BAD REQUEST?
        return;
    }

    $conn = Connection::getConnection();

    try {
        $sql = "INSERT INTO customers (name, firstname, email, password, phone_number, address, sexe, additional_information) VALUES (:name, :firstname, :email, :password, :phone_number, :address, :sex, :additional_info);";
        $stmt = $conn->prepare($sql);
        $res = $stmt->execute([
            ":name" => $requestData["name"],
            ":firstname" => $requestData["firstname"],
            ":email" => $requestData["email"],
            ":password" => $requestData["password"],
            ":phone_number" => $requestData["phone_number"],
            ":address" => $requestData["address"],
            ":sex" => $requestData["sex"],
            ":additional_info" => $requestData["additional_info"]
        ]);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
    }
    echo json_encode(["message" => "Customer succesfully created"]);
}
