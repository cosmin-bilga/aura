<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION COMMENTS SUR SERVICE
 * PARAMS : id_service
 * AUTH: none
 * RETURN: array [... {id_comment, id_service, notation, comment, comment_date}]	
 * 
 */

declare(strict_types=1);

require_once "../connection.php";



header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']){
    case 'GET' :
        $requestData=$_GET; 
        comments_get($requestData);
        break;
        default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;        
}

function comments_get(array $requestData) : void {
    $conn = Connection:: getConnection();

    if(!isset($requestData["id_service"])){
        echo json_encode(["message" => "Missing parameters"]);
        http_response_code(400);
        return;
    }

    try {
        $sql="SELECT * FROM comments WHERE id_service=:id_service";
        $stmt = $conn->prepare ($sql);
        $stmt->execute(
            [
                ":id_service" => $requestData["id_service"]
            ]
            );
            $res=$stmt->fetchAll(PDO::FETCH_ASSOC);
    }catch(PDOException $e){
        echo $e->getMessage();
        http_response_code(500);
        return;
    }
    echo json_encode($res);
    http_response_code(200);

}