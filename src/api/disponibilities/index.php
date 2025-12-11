<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION DISPONIBILITES SUR LES OFFRES
 * PARAMS : id_offer
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

function normalize_duration(?string $durationRaw): int
{
    if ($durationRaw === null) {
        return 60;
    }

    $duration = trim(strtolower($durationRaw));

    if ($duration === '' || $duration === 'variable') {
        return 60; 
    }
   
    if (preg_match('/^(\d+)h(\d+)?$/', $duration, $m)) {
        $hours  = (int) $m[1];
        $mins   = isset($m[2]) ? (int) $m[2] : 0;
        return $hours * 60 + $mins;
    }
    
    if (preg_match('/^(\d+)\s*min$/', $duration, $m)) {
        return (int) $m[1];
    }

    if (preg_match('/^(\d+)h$/', $duration, $m)) {
        return (int) $m[1] * 60;
    }
   
    if (is_numeric($duration)) {
        return (int) $duration;
    }

    return 60;
}


function calculate_dispos(array $disponibilities, array $reserved, int $duration): array
{
    $format = 'Y-m-d H:i:s';
    $new_dispos = [];

   
        return $disponibilities;
    }

    foreach ($reserved as $r) {
        $tmp_dispos = [];

        foreach ($disponibilities as $d) {
           
            if ($r < $d["start_date"] || $r > $d["end_date"]) {
                $tmp_dispos[] = $d;
                continue;
            }

          
            $p1s = DateTime::createFromFormat($format, $d["start_date"]);
            $p1e = DateTime::createFromFormat($format, $r);

            if ($p1e->getTimestamp() - $p1s->getTimestamp() > $duration * 60) {
                $p1 = [
                    "start_date" => $p1s->format($format),
                    "end_date"   => $p1e->format($format)
                ];
                $tmp_dispos[] = $p1;
            }

            $p2s = DateTime::createFromFormat($format, $r);
            $p2e = DateTime::createFromFormat($format, $d["end_date"]);
            $p2s->add(new DateInterval('PT' . $duration . 'M'));

            if ($p2e->getTimestamp() - $p2s->getTimestamp() > $duration * 60) {
                $p2 = [
                    "start_date" => $p2s->format($format),
                    "end_date"   => $p2e->format($format)
                ];
                $tmp_dispos[] = $p2;
            }
        }

        // On itère sur les nouvelles dispos découpées
        $disponibilities = $tmp_dispos;
    }

    // Ici tu peux éventuellement fusionner les plages si besoin
    if (count($reserved) < 1) {
        return $disponibilities;
    }

function disponibilities_get(array $requestData): void
{
    $conn = Connection::getConnection();

    if (!isset($requestData["id_offer"])) {
        echo json_encode(["message" => "Missing id_offer"]);
        http_response_code(400);
        return;
    }

    $idOffer = (int) $requestData["id_offer"];
        /**
     * 1) On recupere toutes les disponibilités pour une offre
     * 2) On recupere tous les services qui ne sont pas encore effectuées 
     * 3) On compare les disponibilitée avec les services à venir pour créer 
     * un liste de disponibilités valide (on supprime les plages trop courtes)
     */
    $now = date("Y-m-d H:i:s");

    // 1) Services futurs pour cette offre
    try {
        $sql = "SELECT * FROM services 
                WHERE id_offer = :id_offer 
                  AND service_date > :now";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_offer" => $idOffer,
            ":now"      => $now
        ]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    $reserved = [];
    foreach ($res as $service) {
        if ($service["service_date"] > $now) {
            $reserved[] = $service["service_date"];
        }
    }


    try {
        $sql = "SELECT duration FROM offers WHERE id_offer = :id_offer";
        $stmt = $conn->prepare($sql);
        $stmt->execute([":id_offer" => $idOffer]);
        $offer = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    if (!$offer) {
        echo json_encode(["message" => "Offer not found"]);
        http_response_code(404);
        return;
    }

    $duration = normalize_duration($offer["duration"] ?? null);

    // 3) Dispos brutes futures
    try {
        $sql = "SELECT * FROM disponibilities 
                WHERE id_offer = :id_offer 
                  AND end_date > :now";
        $stmt = $conn->prepare($sql);
        $stmt->execute([
            ":id_offer" => $idOffer,
            ":now"      => $now
        ]);
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } catch (PDOException $e) {
        echo json_encode(["message" => $e->getMessage()]);
        http_response_code(500);
        return;
    }

    $disponibilities = [];
    foreach ($res as $dispo) {
        $disponibilities[] = [
            "start_date" => $dispo["start_date"],
            "end_date"   => $dispo["end_date"]
        ];
    }


    $dispos = calculate_dispos($disponibilities, $reserved, $duration);

    echo json_encode($dispos);
    http_response_code(200);
}
