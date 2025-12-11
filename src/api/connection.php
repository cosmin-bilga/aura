<?php

declare(strict_types=1);


/**
 * Classe de connexion. 
 * Pour récuperer une connexion à la database: $conn = Connection::getConnection();
 */
class Connection
{
    private static ?pdo $conn = null;

    public static function getConnection(): pdo | null
    {
        if (self::$conn === null) {
            try {
                self::$conn = new PDO("mysql:host=localhost;dbname=aura;port=3306;charset=utf8mb4", "root", "", [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
                return self::$conn;
            } catch (PDOException $e) {
                echo $e->getMessage();
                return null;
            }
        } else
            return self::$conn;
    }
}
