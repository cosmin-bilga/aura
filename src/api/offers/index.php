<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION D'UNE LISTE DES OFFRES CORRESPONDANT AUX FILTRES
 * PARAMS : ?category, ?disponibility, ?perimeter_of_displacement, ?id_provider, ?id_customer
 * AUTH: none
 * RETURN: array [... {id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at}]	
 * 
 */

declare(strict_types=1);

require_once "../connection.php";
require_once "../offer_validation.php";

require __DIR__ . '/../../../vendor/autoload.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '\..\..\..');
$dotenv->load();

if (isset($_ENV["MAPS_API_KEY"]))
    $API_KEY = $_ENV["MAPS_API_KEY"];
else
    $API_KEY = "FAIL";

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        offers_get($requestData);
        break;
    default:
        http_response_code(400);
        echo json_encode(["message" => "Invalid request"]);
        break;
}

function build_where_clause(array $requestData): array
{
    $res = array();
    $fields = array();
    $execute = array();
    foreach ($requestData as $key => $value) {
        if (in_array($key, [
            "category",
            "perimeter_of_displacement",
            "perimeter_of_displacement",
            "id_provider"
        ])) {
            array_push($fields, $key . " = :" . $key);
            $execute[":" . $key] = $value;
        }
    }
    $fields = implode(" AND ", $fields);
    /* if (strlen($fields) > 0)
        $fields = substr($fields, 0, strlen($fields) - 5); */
    $res["fields"] = $fields;
    $res["execute"] = $execute;
    return $res;
}


function offers_get($requestData)
{
    $conn = Connection::getConnection();

    $requestData = sanitize_input($requestData);
    $build = build_where_clause($requestData);

    try {
        $sql = "SELECT * FROM offers";
        if (strlen($build['fields']) > 0)
            $sql .= " WHERE " . $build['fields'];
        if (isset($requestData["limit"]))
            $sql .= " LIMIT " . $requestData["limit"];
        if (isset($requestData["offset"]))
            $sql .= " OFFSET " . $requestData["offset"];


        $stmt = $conn->prepare($sql);
        $stmt->execute($build["execute"]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    if ($res === false) {
        http_response_code(500);
        echo json_encode(["message" => "No offers found"]);
        return;
    }

    foreach ($res as &$r) {
        if (isset($requestData["id_customer"])) {
            try {
                $sql = "SELECT address FROM service_providers WHERE id_provider=:id";
                $stmt = $conn->prepare($sql);
                $stmt->execute([
                    ":id" => $r["id_provider"]
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
            if (isset($coords_provider["lat"]) && isset($coords_customer["lat"]))
                $r["distance"] = calculate_distance(floatval($coords_provider["lat"]), floatval($coords_provider["lon"]), floatval($coords_customer["lat"]), floatval($coords_customer["lon"]));
            //$r["customer_coords"] = $coords_customer;
            //$r["provider_coords"] = $coords_provider;
        }
        $r["disponibility"] = disponibilities_return($r["id_offer"]);
    }

    $res = clear_no_disponibilities($res);
    // On elimine les offres qui n'ont pas la disponibilité demandé ou pas de disponibilité
    if (isset($requestData["disponibility"])) {
        $res = check_has_disponibility($res, $requestData["disponibility"]);
    }

    http_response_code(200);
    echo json_encode($res);
}

function clear_no_disponibilities(array $res): array
{
    $new_res = [];
    foreach ($res as $r) {
        if (count($r["disponibility"]) > 0)
            array_push($new_res, $r);
    }
    return $new_res;
}

function check_has_disponibility(array $res, string $disponibility): array
{
    $new_res = [];
    foreach ($res as $r) {
        $has_dispo = false;
        foreach ($r["disponibility"] as $dispo) {
            if ($dispo["start_date"] < $disponibility && $dispo["end_date"] > $disponibility) {
                $has_dispo = true;
                break;
            }
        }
        if ($has_dispo)
            array_push($new_res, $r);
    }
    return $new_res;
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

    /* if ($id_offer == 2)
        var_dump($disponibilities); */

    $dispos = calculate_dispos($disponibilities, $reserved, $duration);

    /* if ($id_offer == 2)
        var_dump($dispos); */
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
