<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION CONTENU COMMENT
 * PARAMS : id_service
 * AUTH: none
 * RETURN: array [... {id_comment, id_service, notation, comment, comment_date}]
 * 
 * -- POST: CREATION OU MODIFICATION CONTENU COMMENT
 * CREATION - PARAMS: id_service, notation, comment, token
 * AUTH: token matching customer who used the service
 * MODIFICATION - PARAMS: id_comment, comment, token
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER COMMENT
 * PARAMS: id_comment, token
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 */


declare(strict_types=1);

require_once "../connection.php";
require_once "../tokens.php";



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
        comments_get($requestData);
        break;

    case 'POST':
        $requestData = getJsonBody();

        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }

        comments_post($requestData);
        break;

    case 'DELETE':
        $requestData = getJsonBody();

        if (isset($_SERVER["HTTP_X_API_KEY"])) {
            $requestData["token"] = $_SERVER["HTTP_X_API_KEY"];
        }

        comments_delete($requestData);
        break;

    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function comments_get(array $requestData): void
{
    $conn = Connection::getConnection();

    if (!isset($requestData["id_service"])) {
        echo json_encode(["message" => "Missing parameters"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT * FROM comments WHERE id_service=:id_service ORDER BY comment_date DESC";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_service" => $requestData["id_service"]
        ]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }
    echo json_encode($res);
    http_response_code(200);
}


function comments_post(array $requestData): void
{
    $conn = Connection::getConnection();

    if (!isset($requestData["token"])) {
        echo json_encode(["message" => "Missing token"]);
        http_response_code(400);
        return;
    }


    if (isset($requestData["id_comment"])) {
        comments_update($requestData, $conn);
    } else {
        comments_add($requestData, $conn);
    }
}

function comments_add(array $requestData, PDO $conn): void
{
    if (
        !isset($requestData["id_service"]) || !isset($requestData["notation"]) ||
        !isset($requestData["comment"])
    ) {
        echo json_encode(["message" => "Missing parameters for comment creation"]);
        http_response_code(400);
        return;
    }


    $notation = (int)$requestData["notation"];
    if ($notation < 1 || $notation > 5) {
        echo json_encode(["message" => "Invalid notation. Must be between 1 and 5"]);
        http_response_code(400);
        return;
    }


    if (empty(trim($requestData["comment"]))) {
        echo json_encode(["message" => "Comment cannot be empty"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT id_customer FROM services WHERE id_service = :id_service AND status = 'effectué'";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_service" => $requestData["id_service"]]);
        $serviceData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$serviceData) {
            echo json_encode(["message" => "Service not found or not completed"]);
            http_response_code(404);
            return;
        }


        $isOwner = check_token($requestData["token"], $serviceData["id_customer"], "customer");
        if (!$isOwner) {
            echo json_encode(["message" => "Unauthorized - You can only comment on your own services"]);
            http_response_code(403);
            return;
        }

        $sql = "SELECT COUNT(*) as count FROM comments c
                JOIN services s ON c.id_service = s.id_service 
                WHERE c.id_service = :id_service AND s.id_customer = :id_customer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_service" => $requestData["id_service"],
            ":id_customer" => $serviceData["id_customer"]
        ]);
        $commentCount = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($commentCount["count"] > 0) {
            echo json_encode(["message" => "You have already commented on this service"]);
            http_response_code(409);
            return;
        }


        $sql = "INSERT INTO comments (id_service, notation, comment, comment_date) 
                VALUES (:id_service, :notation, :comment, NOW())";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_service" => $requestData["id_service"],
            ":notation" => $notation,
            ":comment" => trim($requestData["comment"])
        ]);


        //add_token($requestData["token"], $serviceData["id_customer"], "customer");

        echo json_encode(["message" => "Comment successfully created"]);
        http_response_code(201);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }
}

function comments_update(array $requestData, PDO $conn): void
{
    if (!isset($requestData["comment"])) {
        echo json_encode(["message" => "Missing comment parameter"]);
        http_response_code(400);
        return;
    }

    if (empty(trim($requestData["comment"]))) {
        echo json_encode(["message" => "Comment cannot be empty"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT s.id_customer FROM comments c 
                JOIN services s ON c.id_service = s.id_service 
                WHERE c.id_comment = :id_comment";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_comment" => $requestData["id_comment"]]);
        $commentData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$commentData) {
            echo json_encode(["message" => "Comment not found"]);
            http_response_code(404);
            return;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    $isOwner = check_token($requestData["token"], $commentData["id_customer"], "customer");
    $isAdmin = check_token($requestData["token"], -1, "admin");

    if (!$isOwner && !$isAdmin) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    try {
        $sql = "UPDATE comments SET comment = :comment WHERE id_comment = :id_comment";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":comment" => trim($requestData["comment"]),
            ":id_comment" => $requestData["id_comment"]
        ]);


        //add_token($requestData["token"], $commentData["id_customer"], false);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    echo json_encode(["message" => "Comment successfully updated"]);
    http_response_code(200);
}

function comments_delete(array $requestData): void
{
    $conn = Connection::getConnection();

    if (!isset($requestData["id_comment"]) || !isset($requestData["token"])) {
        echo json_encode(["message" => "Missing parameters"]);
        http_response_code(400);
        return;
    }

    try {
        $sql = "SELECT s.id_customer FROM comments c
                JOIN services s ON c.id_service = s.id_service
                WHERE c.id_comment = :id_comment";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_comment" => $requestData["id_comment"]
        ]);

        $commentData = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$commentData) {
            echo json_encode(["message" => "Comment not found"]);
            http_response_code(404);
            return;
        }
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    $isOwner = check_token($requestData["token"], $commentData["id_customer"], "customer");
    $isAdmin = check_token($requestData["token"], -1, "admin");

    if (!$isOwner && !$isAdmin) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    try {
        $sql = "DELETE FROM comments WHERE id_comment = :id_comment";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_comment" => $requestData["id_comment"]
        ]);


        //add_token($requestData["token"], $commentData["id_customer"], false);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    echo json_encode(["message" => "Comment successfully deleted"]);
    http_response_code(200);
}
