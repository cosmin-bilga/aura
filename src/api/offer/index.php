<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS OFFRE
 * PARAMS : id_offer
 * AUTH: none
 * RETURN: id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at 	
 * 
 * -- POST: AJOUT/MODIFICATION OFFRE
 *  - SANS id_offer  => création
 *  - AVEC id_offer  => modification
 * 
 * PARAMS (création): description, duration, category, perimeter_of_displacement, price, id_provider
 * AUTH: token matching id_provider OR admin token
 * 
 * PARAMS (update): id_offer, ?description, ?duration, ?category, ?disponibility, ?perimeter_of_displacement, ?price
 * AUTH: token matching id_provider OR admin token
 * 
 * -- DELETE: SUPPRIMER OFFRE
 * PARAMS: id_offer
 * AUTH: token matching id_provider OR admin token
 */

declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");

require_once "../connection.php";
require_once "../tokens.php";
require_once "../offer_validation.php";

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


function normalize_duration(int|string $value): int
{
    if (is_int($value)) {
        return $value;
    }

    if (is_numeric($value)) {
        return (int) $value;
    }

    $str = strtolower(trim((string) $value));

    // "1h30", "2h15", "1 h 30"
    if (preg_match('/^(\d+)\s*h\s*(\d+)?$/', $str, $m)) {
        $hours = (int) $m[1];
        $minutes = isset($m[2]) && $m[2] !== '' ? (int) $m[2] : 0;
        return $hours * 60 + $minutes;
    }

    // "90min", "45 min"
    if (preg_match('/^(\d+)\s*min/', $str, $m)) {
        return (int) $m[1];
    }

    // fallback : on prend le premier nombre trouvé
    if (preg_match('/(\d+)/', $str, $m)) {
        return (int) $m[1];
    }

    // valeur par défaut : 60 min
    return 60;
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
        return;
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(404);
        return;
    }

    $res["disponibility"] = disponibilities_return((int) $requestData["id_offer"]);

    echo json_encode($res);
    http_response_code(200);
}

function build_update_query(array $requestData): array
{
    $res = [];
    $fields = "";
    $execute = [];
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["description", "duration", "category", "perimeter_of_displacement", "price", "id_provider"], true)) {
            $fields .= $key . " = :" . $key . ", ";
            $execute[":" . $key] = $value;
        }
    }
    if (strlen($fields) > 0) {
        $fields = substr($fields, 0, -2);
    }
    $execute[":id"] = (int) $requestData["id_offer"];
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
        return;
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(404);
        return;
    }

    $access = check_token($requestData["token"], (int) $res["id_provider"], "provider");
    if (!$access) {
        echo json_encode(["message" => "Unauthorized"]);
        http_response_code(403);
        return;
    }

    try {
        $build = build_update_query($requestData);
        if (strlen($build["fields"]) === 0) {
            echo json_encode(["message" => "No updates made"]);
            http_response_code(400);
            return;
        }

        $sql = "UPDATE offers SET " . $build["fields"] . " WHERE id_offer=:id;";
        $stmt = $conn->prepare($sql);
        $stmt->execute($build["execute"]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    echo json_encode(["message" => "Offer succesfully updated"]);
    http_response_code(200);
}

function offer_register(array $requestData): void
{
    $requestData = validate_input_register($requestData);
    $requestData = sanitize_input($requestData);

    if (!empty($requestData["errors"])) {
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
        $sql = "INSERT INTO offers (description, duration, category, perimeter_of_displacement, price, id_provider) 
                VALUES (:description, :duration, :category, :perimeter_of_displacement, :price, :id_provider);";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":description" => $requestData["description"],
            ":duration" => $requestData["duration"],
            ":category" => $requestData["category"],
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
    http_response_code(201);
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
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    if ($res === false) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(404);
        return;
    }

    $access = check_token($requestData["token"], (int) $res["id_provider"], "provider");
    if (!$access) {
        echo json_encode(["message" => "Access Forbidden"]);
        http_response_code(403);
        return;
    }

    try {
        $sql = "DELETE FROM offers WHERE id_offer=:id";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id" => $requestData["id_offer"]
        ]);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    echo json_encode(["message" => "Offer deleted"]);
    http_response_code(200);
}

function disponibilities_return(int $id_offer = -1): array
{
    $conn = Connection::getConnection();

    $now = date("Y-m-d H:i:s");

    try {
        $sql = "SELECT * FROM services WHERE id_offer=:id_offer AND service_date > :now";
        $stmt = $conn->prepare($sql);
        $stmt->execute(
            [
                ":id_offer" => $id_offer,
                ":now" => $now
            ]
        );
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }

    $reserved = [];
    foreach ($res as $service) {
        if ($service["service_date"] > $now) {
            $reserved[] = $service["service_date"];
        }
    }

    try {
        $sql = "SELECT duration FROM offers WHERE id_offer=:id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute(
            [
                ":id_offer" => $id_offer
            ]
        );
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }

    if (!$res || !isset($res["duration"])) {
        return [];
    }

    $duration = normalize_duration($res["duration"]);

    // 3) disponibilités brutes
    try {
        $sql = "SELECT * FROM disponibilities WHERE id_offer=:id_offer AND end_date > :now";
        $stmt = $conn->prepare($sql);
        $stmt->execute(
            [
                ":id_offer" => $id_offer,
                ":now" => $now
            ]
        );
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        return [];
    }

    $disponibilities = [];
    foreach ($res as $dispo) {
        $disponibilities[] = [
            "start_date" => $dispo["start_date"],
            "end_date" => $dispo["end_date"]
        ];
    }

    $dispos = calculate_dispos($disponibilities, $reserved, $duration);

    return $dispos;
}

function calculate_dispos(array $disponibilities, array $reserved, int $duration): array
{
    $format = 'Y-m-d H:i:s';
    $new_dispos = [];

    if (count($reserved) < 1) {
        return $disponibilities;
    }

    foreach ($reserved as $r) {
        foreach ($disponibilities as $d) {
            if ($r < $d["start_date"] || $r > $d["end_date"]) {
                $new_dispos[] = $d;
                continue;
            }

            $p1s = DateTime::createFromFormat($format, $d["start_date"]);
            $p1e = DateTime::createFromFormat($format, $r);
            if ($p1e->getTimestamp() - $p1s->getTimestamp() > $duration * 60) {
                $p1 = [
                    "start_date" => $p1s->format($format),
                    "end_date" => $p1e->format($format)
                ];
                $new_dispos[] = $p1;
            }

            $p2s = DateTime::createFromFormat($format, $r);
            $p2e = DateTime::createFromFormat($format, $d["end_date"]);
            $p2s->add(new DateInterval('PT' . $duration . 'M'));
            if ($p2e->getTimestamp() - $p2s->getTimestamp() > $duration * 60) {
                $p2 = [
                    "start_date" => $p2s->format($format),
                    "end_date" => $p2e->format($format)
                ];
                $new_dispos[] = $p2;
            }
        }
        $disponibilities = $new_dispos;
    }

    $new_dispos = merge_disponibilities($new_dispos);
    return $new_dispos;
}

function merge_disponibilities(array $disponibilities): array
{
    $new_dispos = [];
    $plages = [];

    while (count($disponibilities) > 0) {
        $new_dispos = [];
        $plage = $disponibilities[0];
        array_shift($disponibilities);

        foreach ($disponibilities as $dispo) {
            if ($plage["start_date"] === $dispo["start_date"] && $plage["end_date"] === $dispo["end_date"]) {
                continue;
            }
            if ($plage["start_date"] > $dispo["start_date"] && $plage["end_date"] < $dispo["end_date"]) {
                $plage = $dispo;
                continue;
            }
            if ($plage["start_date"] < $dispo["start_date"] && $plage["end_date"] > $dispo["end_date"]) {
                continue;
            }
            if ($plage["start_date"] > $dispo["start_date"] && $plage["start_date"] < $dispo["end_date"]) {
                $plage["start_date"] = $dispo["start_date"];
                continue;
            }
            if ($plage["end_date"] > $dispo["start_date"] && $plage["end_date"] < $dispo["end_date"]) {
                $plage["end_date"] = $dispo["end_date"];
                continue;
            }
        }

        $plages[] = $plage;

        foreach ($disponibilities as $dispo) {
            $merged = false;
            foreach ($plages as $p) {
                if ($dispo["start_date"] >= $p["start_date"] && $dispo["end_date"] <= $p["end_date"]) {
                    $merged = true;
                    break;
                }
            }
            if (!$merged) {
                $new_dispos[] = $dispo;
            }
        }
        $disponibilities = $new_dispos;
    }

    return $plages;
}
