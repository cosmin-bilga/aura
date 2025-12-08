<?php

const MINIMUM_DISPONIBILITY_MINUTES = 60;

function validate_start_date(string $start_date): string
{
    $format = 'Y-m-d H:i:s';
    $dt = DateTime::createFromFormat($format, $start_date);

    if ($dt && $dt->format($format) === $start_date)
        return "";
    else
        return "Start date is invalid.";
}

function validate_end_date(string $end_date): string
{
    $format = 'Y-m-d H:i:s';
    $dt = DateTime::createFromFormat($format, $end_date);

    if ($dt && $dt->format($format) === $end_date)
        return "";
    else
        return "End date is invalid.";
}

function check_date_diff(string $start_date, string $end_date): string
{

    if ($end_date <= $start_date)
        return "End date precedes start date";

    $sdt = strtotime($start_date);
    $edt = strtotime($end_date);

    if (($edt - $sdt) / 60 < MINIMUM_DISPONIBILITY_MINUTES)
        return "Minimum disponibility must be " . MINIMUM_DISPONIBILITY_MINUTES . " minutes.";


    return "";
}


function validate_input_register(array $requestData): array
{
    $errors = array();
    //print_r($requestData);
    if (!isset($requestData["id_offer"]))
        array_push($errors, "id_offer is not set");
    if (!isset($requestData["start_date"]))
        array_push($errors, "Start date is not set");
    elseif (($err = validate_start_date($requestData["start_date"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["end_date"]))
        array_push($errors, "End date is not set");
    elseif (($err = validate_end_date($requestData["end_date"])) != "")
        array_push($errors, $err);
    if (isset($requestData["end_date"]) && isset($requestData["start_date"]))
        if (($err = check_date_diff($requestData["start_date"], $requestData["end_date"])) != "")
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
    if (isset($requestData["start_date"]))
        if (($err = validate_start_date($requestData["start_date"])) != "")
            array_push($errors, $err);
    if (isset($requestData["end_date"]))
        if (($err = validate_end_date($requestData["end_date"])) != "")
            array_push($errors, $err);
    if (isset($requestData["end_date"]) && isset($requestData["start_date"]))
        if (($err = check_date_diff($requestData["start_date"], $requestData["end_date"])) != "")
            array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}
