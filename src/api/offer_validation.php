<?php


function validate_price(int $price): string
{

    if ($price < 0 || $price > 99999999)
        return "Price needs to be a positive number.";
    return "";
}

function validate_description(string $description): string
{
    if (!isset($description))
        return "Description is missing.";
    else if (strlen($description) < 10)
        return "Description too short. (min 10 characters)";
    return "";
}

function validate_duration(int $duration): string // On suppose que c'est en minutes
{
    if (!isset($duration))
        return "Duration is missing.";
    if ($duration < 30 || $duration > 999)
        return "Invalid duration. Must be between 30 and 999 (minutes).";
    return "";
}

function validate_category(string $category): string
{
    if (in_array($category, ["Beauté", "Garde_denfant", "Massage", "Ménage"]))
        return "";
    return "Category must be Beauté, Garde_denfant, Massage, Ménage";
}

function validate_disponibility(string $disponibility): string
{
    ## TODO
    return "";
}

function validate_perimeter(string $perimeter): string
{
    if (in_array($perimeter, ["5km", "10km", "15km", "20km", "30km"]))
        return "";
    return "Perimeter values can be 5km, 10km, 15km, 20km, 30km";
}


function validate_input_register(array $requestData): array
{
    $errors = array();
    if (!isset($requestData["description"]))
        array_push($errors, "Description is not set");
    elseif (($err = validate_description($requestData["description"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["duration"]))
        array_push($errors, "Duration is not set");
    elseif (($err = validate_duration(intval($requestData["duration"]))) != "")
        array_push($errors, $err);
    if (!isset($requestData["category"]))
        array_push($errors, "Category is not set");
    elseif (($err = validate_category($requestData["category"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["disponibility"]))
        array_push($errors, "Disponibility not set");
    elseif (($err = validate_disponibility($requestData["disponibility"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["perimeter_of_displacement"]))
        array_push($errors, "perimeter_of_displacement is not set");
    elseif (($err = validate_perimeter($requestData["perimeter_of_displacement"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["price"]))
        array_push($errors, "price is not set");
    elseif (($err = validate_price($requestData["price"])) != "")
        array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}

function sanitize_input(array $requestData): array
{
    foreach ($requestData as $key => $value) {
        if (gettype($value) === "string")
            $requestData[$key] = htmlentities($value);
    }
    return $requestData;
}

function validate_input_update(array $requestData): array
{
    $errors = array();
    if (isset($requestData["description"]))
        if (($err = validate_description($requestData["description"])) != "")
            array_push($errors, $err);
    if (isset($requestData["duration"]))
        if (($err = validate_duration($requestData["duration"])) != "")
            array_push($errors, $err);
    if (isset($requestData["category"]))
        if (($err = validate_category($requestData["category"])) != "")
            array_push($errors, $err);
    if (isset($requestData["disponibility"]))
        if (($err = validate_disponibility($requestData["disponibility"])) != "")
            array_push($errors, $err);
    if (isset($requestData["perimeter_of_displacement"]))
        if (($err = validate_perimeter($requestData["perimeter_of_displacement"])) != "")
            array_push($errors, $err);
    if (isset($requestData["price"]))
        if (($err = validate_price($requestData["price"])) != "")
            array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}
