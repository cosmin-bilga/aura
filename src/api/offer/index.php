<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS OFFRE
 * PARAMS : id_offer, ?id_customer
 * AUTH: none
 * RETURN: id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at 	
 * 
 *  * -- POST: AJOUT OFFRE
 * PARAMS: description, duration, category, perimeter_of_displacement, price
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

require __DIR__ . '/../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '\..\..\..');
$dotenv->load();


header("Content-Type: application/json; charset=UTF-8");

if (isset($_ENV["MAPS_API_KEY"]))
    $API_KEY = $_ENV["MAPS_API_KEY"];
else
    $API_KEY = "FAIL";
// https://geocode.maps.co/search?q=555+5th+Ave+New+York+NY+10017+US&api_key=YOUR_SECRET_API_KEY

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

    //$data =  https://geocode.maps.co/search?q=555+5th+Ave+New+York+NY+10017+US&api_key=YOUR_SECRET_API_KEY

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

    if (isset($requestData["id_customer"])) {

        try {
            $sql = "SELECT address FROM service_providers WHERE id_provider=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $res["id_provider"]
            ]);
            $resp = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        if ($resp === false) {
            echo json_encode(["message" => "Provider not found"]);
            http_response_code(500);
            return;
        }

        try {
            $sql = "SELECT address FROM customers WHERE id_customer=:id";
            $stmt = $conn->prepare($sql);
            $stmt->execute([
                ":id" => $requestData["id_customer"]
            ]);
            $resc = $stmt->fetch(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            echo json_encode(["message" => $e->getMessage()]);
            http_response_code(500);
        }

        if ($resc === false) {
            echo json_encode(["message" => "Customer not found"]);
            http_response_code(500);
            return;
        }

        $coords_provider = get_coordinates($resp["address"]);
        $coords_customer = get_coordinates($resc["address"]);
        $res["distance"] = calculate_distance(floatval($coords_provider["lat"]), floatval($coords_provider["lon"]), floatval($coords_customer["lat"]), floatval($coords_customer["lon"]));
        /* $res["customer_coords"] = $coords_customer;
        $res["provider_coords"] = $coords_provider; */
    }



    $res["disponibility"] = disponibilities_return(intval($requestData["id_offer"]));


    echo json_encode($res);
    http_response_code(200);
}

function build_update_query(array $requestData): array
{
    $res = array();
    $fields = "";
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, ["description", "duration", "category", "perimeter_of_displacement", "price", "id_provider"])) {
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
        $sql = "INSERT INTO offers (description, duration, category, perimeter_of_displacement, price, id_provider) VALUES (:description, :duration, :category, :perimeter_of_displacement, :price, :id_provider);";
        $stmt = $conn->prepare($sql);
        /* var_dump($sql);
        var_dump($requestData["category"]); */
        $res = $stmt->execute([
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

function disponibilities_return(int $id_offer = -1): array
{
    $conn = Connection::getConnection();

    /**
     * 1) On recupere toutes les disponibilités pour une offre
     * 2) On recupere tous les services qui ne sont pas encore effectuées 
     * 3) On compare les disponibilitée avec les services à venir pour créer 
     * un liste de disponibilités valide (on supprime les plages trop courtes)
     */

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

    $reserved = array();
    foreach ($res as $service) {
        if ($service["service_date"] > $now)
            array_push($reserved, $service["service_date"]);
    }

    /* echo "reserved";
    print_r($reserved); */

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

    $duration = $res["duration"];

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

    $disponibilities = array();
    foreach ($res as $dispo) {
        array_push($disponibilities, ["start_date" => $dispo["start_date"], "end_date" => $dispo["end_date"]]);
    }

    /*  echo "disponibilities";
    print_r($disponibilities); */

    $dispos = calculate_dispos($disponibilities, $reserved, $duration);

    return $dispos;
}

function calculate_dispos(array $disponibilities, array $reserved, int $duration): array
{
    $format = 'Y-m-d H:i:s';
    $new_dispos = [];
    if (count($reserved) < 1)
        return $disponibilities;
    foreach ($reserved as $r) {
        foreach ($disponibilities as $d) {
            if ($r < $d["start_date"] || $r > $d["end_date"]) {
                array_push($new_dispos, $d);
                continue;
            }
            $p1s = DateTime::createFromFormat($format,  $d["start_date"]);
            $p1e = DateTime::createFromFormat($format, $r);
            if ($p1e->getTimestamp() - $p1s->getTimestamp() > $duration * 60) {
                $p1 = ["start_date" => $p1s->format($format), "end_date" => $p1e->format($format)];
                array_push($new_dispos, $p1);
            }
            $p2s = DateTime::createFromFormat($format,  $r);
            $p2e = DateTime::createFromFormat($format, $d["end_date"]);
            $p2s->add(new DateInterval('PT' . $duration . 'M'));
            if ($p2e->getTimestamp() - $p2s->getTimestamp() > $duration * 60) {
                $p2 = ["start_date" => $p2s->format($format), "end_date" => $p2e->format($format)];
                array_push($new_dispos, $p2);
            }
        }
        $disponibilities = $new_dispos;
    }
    $new_dispos = merge_disponibilities($new_dispos);
    return $new_dispos;
}

function merge_disponibilities(array $disponibilities): array
{
    $new_dispos = array();
    $plages = array();

    /**
     * Boucle qui transforme les disponibilitées en nouvelles plages elargies
     * Pas 1: Creation plage la plus large possible à partir du 1er element de la liste
     * Pas 2: Elimination de tous les elements de la liste compris dans cette plage
     */
    while (count($disponibilities) > 0) {
        $new_dispos = [];
        $plage = $disponibilities[0];
        array_shift($disponibilities);
        foreach ($disponibilities as $dispo) {
            if ($plage["start_date"] === $dispo["start_date"] && $plage["end_date"] === $dispo["end_date"]) {
                continue;
            }
            if ($plage["start_date"] > $dispo["start_date"] && $plage["end_date"] <  $dispo["end_date"]) {
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
        array_push($plages, $plage);
        foreach ($disponibilities as $dispo) {
            $merged = false;
            foreach ($plages as $plage) {
                if ($dispo["start_date"] >= $plage["start_date"] && $dispo["end_date"] <= $plage["end_date"]) {
                    $merged = true;
                    break;
                }
            }
            if (!$merged)
                array_push($new_dispos, $dispo);
        }
        $disponibilities = $new_dispos;
    }
    return $plages;
}

function get_coordinates(string $address): array
{
    global $API_KEY;
    $coords = array();

    $url = "https://geocode.maps.co/search?q=" . urlencode($address) . "&api_key=" . $API_KEY;

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Temporary solution to bypass certificate verification
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);

    if (curl_error($ch)) {
        // echo curl_error($ch);
        return [];
    }

    $response = json_decode($response, true);
    if (!isset($response))
        return [];
    $coords["lat"] = $response[0]["lat"];
    $coords["lon"] = $response[0]["lon"];
    return $coords;
}

function calculate_distance(float $lat1, float $lon1, float $lat2, float $lon2): float
{
    $r = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) * sin($dLat / 2) +
        cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
        sin($dLon / 2) * sin($dLon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    $d = $r * $c;
    return $d;
}
