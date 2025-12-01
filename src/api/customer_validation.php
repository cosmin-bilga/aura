<?php

function validate_name(string $name): string
{
    if (!isset($name))
        return "Name is missing.";
    else if (ctype_alpha($name) === false)
        return "Name can only contain letters.";
    else if (strlen($name) < 2)
        return "Name too short. (min 2 characters)";
    return "";
}

function validate_firstname(string $name): string
{
    if (!isset($name))
        return "Firstname is missing.";
    else if (ctype_alpha($name) === false)
        return "Firstname can only contain letters.";
    else if (strlen($name) < 2)
        return "Firstname too short. (min 2 characters)";
    return "";
}

function validate_email(string $email): string
{
    if (!filter_var($email, FILTER_VALIDATE_EMAIL))
        return "Email is not valid";
    return "";
}

function validate_phone_number(string $phone_number): string
{
    if (!preg_match("/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}/", $phone_number))
        return "Invalid phone number";
    return "";
}

function validate_sex(string $sex): string
{
    if ($sex !== "M" && $sex !== "F" && $sex !== "Autre")
        return "Sex must be M, F or Autre";
    return "";
}

function validate_password(string $password, string $password_confirm): string
{
    if ($password !== $password_confirm)
        return "Passwords do not match";
    if (strlen($password) < 8)
        return "Password must be atleast 8 characters long";
    if (!preg_match("/^(?=.*?[A-Z]).{8,}$/", $password))
        return "Password must contain atleast one uppercase letter";
    if (!preg_match("/^(?=.*?[a-z]).{8,}$/", $password))
        return "Password must contain atleast one lowercase letter";
    if (!preg_match("/^(?=.*?[0-9]).{8,}$/", $password))
        return "Password must contain one number";
    if (!preg_match("/^(?=.*?[#?!@$%^&*-+=()[\]{}]).{8,}$/", $password))
        return "Password must contain a special character";
    if (!preg_match("/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+=()[\]{}]).{8,}$/", $password))
        return "Invalid Password";
    return "";
}

function validate_input_register(array $requestData): array
{
    $errors = array();
    if (!isset($requestData["password"]))
        array_push($errors, "Password is not set");
    elseif (!isset($requestData["password_confirm"]))
        array_push($errors, "Password confirm is not set");
    elseif (($err = validate_password($requestData["password"], $requestData["password_confirm"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["name"]))
        array_push($errors, "Name is not set");
    elseif (($err = validate_name($requestData["name"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["firstname"]))
        array_push($errors, "Firstname is not set");
    elseif (($err = validate_firstname($requestData["firstname"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["email"]))
        array_push($errors, "Email is not set");
    elseif (($err = validate_email($requestData["email"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["phone_number"]))
        array_push($errors, "Phone number is not set");
    elseif (($err = validate_phone_number($requestData["phone_number"])) != "")
        array_push($errors, $err);
    if (!isset($requestData["sex"]))
        array_push($errors, "Sex is not set");
    elseif (($err = validate_sex($requestData["sex"])) != "")
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
    if (isset($requestData["password"]) && isset($requestData["password_confirm"]))
        if (($err = validate_password($requestData["password"], $requestData["password_confirm"])) != "")
            array_push($errors, $err);
    if (isset($requestData["password"]) && !isset($requestData["password_confirm"]))
        array_push($errors, "Password and password confirm and both required");
    if (!isset($requestData["password"]) && isset($requestData["password_confirm"]))
        array_push($errors, "Password and password confirm and both required");
    if (isset($requestData["name"]))
        if (($err = validate_name($requestData["name"])) != "")
            array_push($errors, $err);
    if (isset($requestData["firstname"]))
        if (($err = validate_firstname($requestData["firstname"])) != "")
            array_push($errors, $err);
    if (isset($requestData["email"]))
        if (($err = validate_email($requestData["email"])) != "")
            array_push($errors, $err);
    if (isset($requestData["phone_number"]))
        if (($err = validate_phone_number($requestData["phone_number"])) != "")
            array_push($errors, $err);
    if (isset($requestData["sex"]))
        if (($err = validate_sex($requestData["sex"])) != "")
            array_push($errors, $err);
    $requestData["errors"] = $errors;
    return $requestData;
}
