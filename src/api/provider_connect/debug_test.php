<?php
// src/api/provider_connect/debug_test.php

// CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

require_once "../connection.php";

echo "<h1>Outil de Debug Connexion Provider</h1>";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';

    if (empty($email)) {
        echo "<p style='color:red'>Email manquant</p>";
    } else {
        echo "<h2>Test pour l'email : " . htmlspecialchars($email) . "</h2>";

        try {
            $conn = Connection::getConnection();
            $sql = "SELECT * FROM service_providers WHERE email=:email";
            $stmt = $conn->prepare($sql);
            $stmt->execute([":email" => $email]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC); // Fetch one
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC); // Fetch others if duplicates? (fetch consumes one)

            // Re-execute for full count
            $stmt->execute([":email" => $email]);
            $allUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (count($allUsers) === 0) {
                echo "<p style='color:red'>❌ AUCUN utilisateur trouvé avec cet email.</p>";
            } else {
                echo "<p style='color:green'>✅ " . count($allUsers) . " utilisateur(s) trouvé(s).</p>";

                foreach ($allUsers as $u) {
                    echo "<pre style='background:#f4f4f4;padding:10px;border:1px solid #ccc'>";
                    print_r($u);
                    echo "</pre>";

                    if ($u['email'] !== $email) {
                        echo "<p style='color:orange'>⚠️ Attention: L'email en base (" . $u['email'] . ") est différent de la recherche</p>";
                    }
                }
            }
        } catch (Exception $e) {
            echo "<p style='color:red'>Erreur SQL : " . $e->getMessage() . "</p>";
        }
    }
}
?>

<form method="POST" style="margin-top:20px;padding:20px;border:1px solid #ddd;max-width:400px">
    <label>Entrez l'email du provider :</label><br>
    <input type="email" name="email" required style="width:100%;margin:10px 0;padding:5px"><br>
    <button type="submit" style="padding:10px 20px;background:#007bff;color:white;border:none;cursor:pointer">Vérifier l'utilisateur</button>
</form>