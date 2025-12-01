<?php

function validate_service_date(string $service_date): string
{
    $format = 'Y-m-d H:i:s';
    $dt = DateTime::createFromFormat($format, $service_date);

    if ($dt && $dt->format($format) === $service_date)
        return "";
    else
        return "Service date is invalid.";
}

function validate_payement_date(string $payement_date): string
{
    $format = 'Y-m-d H:i:s';
    $dt = DateTime::createFromFormat($format, $payement_date);

    if ($dt && $dt->format($format) === $payement_date)
        return "";
    else
        return "Payement date is invalid.";
}

function validate_statut(string $statut): string
{

    if (in_array($statut, ["en_attente", "validé", "effectué", "payé", "annulé"]))
        return "";
    return "Statut must be en_attente, validé, effectué, payé or annulé";
}

function validate_amount(int $amount): string
{

    if ($amount < 0 || $amount > 99999999)
        return "Amount needs to be a positive number.";
    return "";
}

function validate_payment_method(string $method): string
{
    if (ctype_alpha($method) === false)
        return "Payement method can only contain letters.";
    else if (strlen($method) < 2)
        return "Payement method too short. (min 2 characters)";
    return "";
}

function validate_payment_reference(string $reference): string
{
    if (strlen($reference) < 2)
        return "Payement reference too short. (min 2 characters)";
    return "";
}

function validate_input_register(array $requestData): array
{
    $errors = array();
    if (!isset($requestData["id_customer"]))
        array_push($errors, "id_customer is not set");
    if (!isset($requestData["id_offer"]))
        array_push($errors, "id_offer is not set");
    if (!isset($requestData["service_date"]))
        array_push($errors, "service_date is not set");
    elseif (($err = validate_service_date($requestData["service_date"])) != "")
        array_push($errors, $err);
    if (isset($requestData["statut"]))
        if (($err = validate_statut($requestData["statut"])) != "")
            array_push($errors, $err);
    if (!isset($requestData["amount"]))
        array_push($errors, "amount is not set");
    elseif (($err = validate_amount($requestData["amount"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["payment_date"]))
        array_push($errors, "payment_date is not set");
    elseif (($err = validate_payement_date($requestData["payment_date"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["payment_method"]))
        array_push($errors, "Payment method is not set");
    elseif (($err = validate_payment_method($requestData["payment_method"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["payment_reference"]))
        array_push($errors, "payment_reference is not set");
    elseif (($err = validate_payment_reference($requestData["payment_reference"])) != "")
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
    if (isset($requestData["service_date"]))
        if (($err = validate_service_date($requestData["service_date"])) != "")
            array_push($errors, $err);
    if (isset($requestData["statut"]))
        if (($err = validate_statut($requestData["statut"])) != "")
            array_push($errors, $err);
    if (isset($requestData["amount"]))
        if (($err = validate_amount($requestData["amount"])) != "")
            array_push($errors, $err);
    if (isset($requestData["payement_date"]))
        if (($err = validate_payement_date($requestData["payement_date"])) != "")
            array_push($errors, $err);
    if (isset($requestData["payement_method"]))
        if (($err = validate_payment_method($requestData["payement_method"])) != "")
            array_push($errors, $err);
    if (isset($requestData["payement_reference"]))
        if (($err = validate_payment_reference($requestData["payemet_reference"])) != "")
            array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}
