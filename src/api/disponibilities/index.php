<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION DISPONIBILITES SUR LES OFFRES
 * PARAMS : id_service
 * AUTH: none
 * RETURN: array [... {start_date, end_date}]	
 * 
 */

declare(strict_types=1);

require_once "../connection.php";

header("Content-Type: application/json; charset=UTF-8");

switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $requestData = $_GET;
        disponibilities_get($requestData);
        break;
    default:
        echo json_encode(["message" => "Invalid request"]);
        http_response_code(400);
        break;
}

function calculate_dispos(array $disponibilities, array $reserved, int $duration): array
{
    $format = 'Y-m-d H:i:s';
    $new_dispos = [];
    foreach ($reserved as $r) {
        foreach ($disponibilities as $d) {
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
    return $new_dispos;
}

function disponibilities_get(array $requestData): void
{
    $conn = Connection::getConnection();

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "Missing id_offer"]);
        http_response_code(400);
        return;
    }

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
                ":id_offer" => $requestData["id_offer"],
                ":now" => $now
            ]
        );
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
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
                ":id_offer" => $requestData["id_offer"]
            ]
        );
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    $duration = $res["duration"];

    try {
        $sql = "SELECT * FROM disponibilities WHERE id_offer=:id_offer AND end_date > :now";
        $stmt = $conn->prepare($sql);
        $stmt->execute(
            [
                ":id_offer" => $requestData["id_offer"],
                ":now" => $now
            ]
        );
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo $e->getMessage();
        http_response_code(500);
        return;
    }

    $disponibilities = array();
    foreach ($res as $dispo) {
        array_push($disponibilities, ["start_date" => $dispo["start_date"], "end_date" => $dispo["end_date"]]);
    }

    $dispos = calculate_dispos($disponibilities, $reserved, $duration);

    echo json_encode($dispos);
    http_response_code(200);
}
