<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION D'UNE LISTE DES OFFRES CORRESPONDANT AUX FILTRES
 * PARAMS : ?category, ?disponibility, ?perimeter_of_displacement, ?id_provider, ?limit, ?offset
 * AUTH: none
 * RETURN: array [... {id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at}]	
 */

declare(strict_types=1);

header("Content-Type: application/json; charset=UTF-8");

require_once "../connection.php";
require_once "../offer_validation.php";

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

/**
 * Normalise une durée vers un entier en minutes.
 * Même logique que dans api/offer/index.php.
 */
function normalize_duration(int|string $value): int
{
    if (is_int($value)) {
        return $value;
    }

    if (is_numeric($value)) {
        return (int) $value;
    }

    $str = strtolower(trim((string) $value));

    if (preg_match('/^(\d+)\s*h\s*(\d+)?$/', $str, $m)) {
        $hours = (int) $m[1];
        $minutes = isset($m[2]) && $m[2] !== '' ? (int) $m[2] : 0;
        return $hours * 60 + $minutes;
    }

    if (preg_match('/^(\d+)\s*min/', $str, $m)) {
        return (int) $m[1];
    }

    if (preg_match('/(\d+)/', $str, $m)) {
        return (int) $m[1];
    }

    return 60;
}

function build_where_clause(array $requestData): array
{
    $res = [];
    $fields = [];
    $execute = [];

    foreach ($requestData as $key => $value) {
        if (in_array($key, ["category", "perimeter_of_displacement", "id_provider"], true)) {
            $fields[] = $key . " = :" . $key;
            $execute[":" . $key] = $value;
        }
    }

    $res["fields"] = implode(" AND ", $fields);
    $res["execute"] = $execute;
    return $res;
}

function offers_get(array $requestData): void
{
    $conn = Connection::getConnection();

    $requestData = sanitize_input($requestData);
    $build = build_where_clause($requestData);

    try {
        $sql = "SELECT * FROM offers";
        if (strlen($build['fields']) > 0) {
            $sql .= " WHERE " . $build['fields'];
        }
        if (isset($requestData["limit"])) {
            $sql .= " LIMIT " . (int) $requestData["limit"];
        }
        if (isset($requestData["offset"])) {
            $sql .= " OFFSET " . (int) $requestData["offset"];
        }

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

    // On ajoute les dispo, mais SANS filtrer les offres qui n'en ont pas
    foreach ($res as &$r) {
        $r["disponibility"] = disponibilities_return((int) $r["id_offer"]);
    }
    unset($r);

    // On ne fait plus ça :

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
        if (!empty($r["disponibility"])) {
            $new_res[] = $r;
        }
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
        if ($has_dispo) {
            $new_res[] = $r;
        }
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

    // 1) services futurs
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

    // 2) durée de l'offre
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
            "end_date"   => $dispo["end_date"]
        ];
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
                    "end_date"   => $p1e->format($format)
                ];
                $new_dispos[] = $p1;
            }

            $p2s = DateTime::createFromFormat($format, $r);
            $p2e = DateTime::createFromFormat($format, $d["end_date"]);
            $p2s->add(new DateInterval('PT' . $duration . 'M'));
            if ($p2e->getTimestamp() - $p2s->getTimestamp() > $duration * 60) {
                $p2 = [
                    "start_date" => $p2s->format($format),
                    "end_date"   => $p2e->format($format)
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
