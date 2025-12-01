-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : jeu. 27 nov. 2025 à 15:08
-- Version du serveur : 8.4.3
-- Version de PHP : 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `aura`
--

-- --------------------------------------------------------

--
-- Structure de la table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admins`
--

INSERT INTO `admins` (`id_admin`, `name`, `firstname`, `email`, `password`) VALUES
(1, 'Padia', 'Claude', 'Claude.admin@auradev.fr', '$2y$10$N6loi91ZKvdPZDEFNuLnoOlT7.nQiFXb26IFUgLgn7fWqDTii7ceK');

-- --------------------------------------------------------

--
-- Structure de la table `comments`
--

CREATE TABLE `comments` (
  `id_comment` int UNSIGNED NOT NULL,
  `id_service` int UNSIGNED NOT NULL,
  `notation` tinyint UNSIGNED NOT NULL,
  `comment` text,
  `comment_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ;

--
-- Déchargement des données de la table `comments`
--

INSERT INTO `comments` (`id_comment`, `id_service`, `notation`, `comment`, `comment_date`) VALUES
(2, 1, 4, 'Très bon service, ma peau est douce après le soin.', '2025-11-25 09:29:50'),
(3, 1, 5, 'Parfait, exactement ce que j\'attendais !', '2025-11-25 09:29:50'),
(4, 2, 5, 'Ménage impeccable ! Pierre est efficace et respectueux.', '2025-11-25 09:29:50'),
(5, 3, 4, 'Bon massage relaxant, je me sens détendue.', '2025-11-25 09:29:50'),
(6, 3, 3, 'Service correct mais un peu cher pour la durée.', '2025-11-25 09:29:50'),
(7, 4, 5, 'Épilation parfaite ! Sophie maîtrise sa technique.', '2025-11-25 09:29:50'),
(8, 5, 5, 'Pierre est formidable avec les enfants !', '2025-11-25 09:29:50'),
(9, 5, 4, 'Mes enfants l\'adorent, service de qualité.', '2025-11-25 09:29:50');

-- --------------------------------------------------------

--
-- Structure de la table `customers`
--

CREATE TABLE `customers` (
  `id_customer` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `sex` enum('M','F','Autre') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `additional_information` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `customers`
--

INSERT INTO `customers` (`id_customer`, `name`, `firstname`, `email`, `password`, `phone_number`, `address`, `sex`, `additional_information`, `created_at`, `updated_at`) VALUES
(1, 'Dupont', 'Marie', 'marie.dupont@client.com', '$2y$10$hashclient1', '0145678901', '123 rue Client, 75002 Paris', 'F', NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(2, 'Bernard', 'Jean', 'jean.bernard@client.com', '$2y$10$hashclient2', '0156789012', '456 av Client, 69002 Lyon', 'M', NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(3, 'Moreau', 'Claire', 'claire.moreau@client.com', '$2y$10$hashclient3', '0167890123', '789 bd Client, 13001 Marseille', 'F', NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50');

-- --------------------------------------------------------

--
-- Structure de la table `fav_offers`
--

CREATE TABLE `fav_offers` (
  `id_favOffer` int UNSIGNED NOT NULL,
  `id_customer` int UNSIGNED NOT NULL,
  `id_offer` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `fav_offers`
--

INSERT INTO `fav_offers` (`id_favOffer`, `id_customer`, `id_offer`, `created_at`) VALUES
(1, 1, 1, '2025-11-27 14:24:52'),
(2, 1, 4, '2025-11-27 14:24:52'),
(3, 1, 7, '2025-11-27 14:24:52'),
(4, 2, 2, '2025-11-27 14:24:52'),
(5, 2, 6, '2025-11-27 14:24:52');

-- --------------------------------------------------------

--
-- Structure de la table `fav_providers`
--

CREATE TABLE `fav_providers` (
  `id_favPro` int UNSIGNED NOT NULL,
  `id_customer` int UNSIGNED NOT NULL,
  `id_provider` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `offers`
--

CREATE TABLE `offers` (
  `id_offer` int UNSIGNED NOT NULL,
  `description` text NOT NULL,
  `duration` varchar(50) NOT NULL,
  `category` enum('Beauté','Garde_denfant','Massage','Ménage') NOT NULL,
  `disponibility` varchar(255) NOT NULL,
  `perimeter_of_displacement` enum('5km','10km','15km','20km','30km') DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `id_provider` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `offers`
--

INSERT INTO `offers` (`id_offer`, `description`, `duration`, `category`, `disponibility`, `perimeter_of_displacement`, `price`, `id_provider`, `created_at`, `updated_at`) VALUES
(1, 'Soin du visage complet avec nettoyage et hydratation', '1h30', 'Beauté', 'Lun-Ven 9h-18h', '10km', 65.00, 1, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(2, 'Épilation jambes complètes à la cire', '45min', 'Beauté', 'Mar-Sam 10h-19h', '15km', 45.00, 1, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(3, 'Manucure avec pose de vernis semi-permanent', '1h', 'Beauté', 'Lun-Sam 9h-18h', '10km', 35.00, 1, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(4, 'Massage relaxant corps entier', '1h', 'Massage', 'Lun-Dim 10h-20h', '20km', 80.00, 1, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(5, 'Massage sportif pour récupération', '45min', 'Massage', 'Mar-Sam 14h-19h', '15km', 70.00, 1, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(6, 'Ménage complet appartement 2-3 pièces', '2h', 'Ménage', 'Lun-Sam 8h-18h', '20km', 40.00, 2, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(7, 'Grand ménage de printemps', '4h', 'Ménage', 'Lun-Ven 8h-16h', '15km', 80.00, 2, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(8, 'Repassage à domicile', '2h', 'Ménage', 'Mar-Sam 14h-18h', '10km', 30.00, 2, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(9, 'Garde d\'enfant à domicile (3-10 ans)', 'Variable', 'Garde_denfant', 'Lun-Ven 16h-20h', '15km', 15.00, 2, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(10, 'Baby-sitting ponctuel soirée', 'Variable', 'Garde_denfant', 'Ven-Dim 18h-23h', '20km', 12.00, 2, '2025-11-25 09:29:50', '2025-11-25 09:29:50');

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id_service` int UNSIGNED NOT NULL,
  `id_customer` int UNSIGNED NOT NULL,
  `id_offer` int UNSIGNED NOT NULL,
  `service_date` datetime NOT NULL,
  `status` enum('en_attente','validé','effectué','payé','annulé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'en_attente',
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id_service`, `id_customer`, `id_offer`, `service_date`, `status`, `amount`, `payment_date`, `payment_method`, `payment_reference`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2024-11-15 14:00:00', 'effectué', 65.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(2, 2, 6, '2024-11-16 10:00:00', 'effectué', 40.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(3, 1, 4, '2024-11-17 16:00:00', 'effectué', 80.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(4, 3, 2, '2024-11-18 11:00:00', 'effectué', 45.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(5, 2, 9, '2024-11-19 17:00:00', 'effectué', 60.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(6, 3, 5, '2024-11-20 15:00:00', 'effectué', 70.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(7, 1, 8, '2024-11-21 14:00:00', 'effectué', 30.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(8, 2, 3, '2024-11-25 10:00:00', 'validé', 35.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50'),
(9, 3, 7, '2024-11-26 09:00:00', 'en_attente', 80.00, NULL, NULL, NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50');

-- --------------------------------------------------------

--
-- Structure de la table `service_providers`
--

CREATE TABLE `service_providers` (
  `id_provider` int UNSIGNED NOT NULL,
  `name` varchar(50) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `address` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT 'default.WebP',
  `education_experience` text,
  `subscriber` enum('none','basique') DEFAULT 'none',
  `sex` enum('M','F','Autre') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `SIREN` char(9) DEFAULT NULL,
  `additional_information` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` enum('EI','Micro-entreprise','EURL','SASU','SARL','SAS') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Micro-entreprise'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `service_providers`
--

INSERT INTO `service_providers` (`id_provider`, `name`, `firstname`, `email`, `password`, `phone_number`, `address`, `profile_picture`, `education_experience`, `subscriber`, `sex`, `SIREN`, `additional_information`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Martin', 'Sophie', 'sophie.martin@aura.com', '$2y$10$hashexample1', '0123456789', '15 rue de la Paix, 75001 Paris', 'default.WebP', 'CAP Esthétique, 5 ans d\'expérience', 'basique', 'F', '123456789', NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50', 'Micro-entreprise'),
(2, 'Dubois', 'Pierre', 'pierre.dubois@aura.com', '$2y$10$hashexample2', '0987654321', '42 avenue des Services, 69001 Lyon', 'default.WebP', 'Formation aide à domicile, 3 ans d\'expérience', 'none', 'M', '987654321', NULL, '2025-11-25 09:29:50', '2025-11-25 09:29:50', 'Micro-entreprise');

-- --------------------------------------------------------

--
-- Structure de la table `tokens`
--

CREATE TABLE `tokens` (
  `token` varchar(255) NOT NULL,
  `id_customer` int NOT NULL,
  `admin` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `tokens`
--

INSERT INTO `tokens` (`token`, `id_customer`, `admin`, `created_at`) VALUES
('token_admin_2025', 1, 1, '2025-11-27 16:08:25'),
('token_claire_2025', 3, 0, '2025-11-27 16:08:25'),
('token_jean_2025', 2, 0, '2025-11-27 16:08:25'),
('token_marie_2025', 1, 0, '2025-11-27 16:08:25');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id_comment`),
  ADD KEY `id_service` (`id_service`);

--
-- Index pour la table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id_customer`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `fav_offers`
--
ALTER TABLE `fav_offers`
  ADD PRIMARY KEY (`id_favOffer`),
  ADD UNIQUE KEY `id_customer` (`id_customer`,`id_offer`),
  ADD KEY `id_offer` (`id_offer`);

--
-- Index pour la table `fav_providers`
--
ALTER TABLE `fav_providers`
  ADD PRIMARY KEY (`id_favPro`),
  ADD UNIQUE KEY `id_customer` (`id_customer`,`id_provider`),
  ADD KEY `id_provider` (`id_provider`);

--
-- Index pour la table `offers`
--
ALTER TABLE `offers`
  ADD PRIMARY KEY (`id_offer`),
  ADD KEY `id_provider` (`id_provider`);

--
-- Index pour la table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id_service`),
  ADD KEY `id_customer` (`id_customer`),
  ADD KEY `id_offer` (`id_offer`);

--
-- Index pour la table `service_providers`
--
ALTER TABLE `service_providers`
  ADD PRIMARY KEY (`id_provider`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`token`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `comments`
--
ALTER TABLE `comments`
  MODIFY `id_comment` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `customers`
--
ALTER TABLE `customers`
  MODIFY `id_customer` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `fav_offers`
--
ALTER TABLE `fav_offers`
  MODIFY `id_favOffer` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `fav_providers`
--
ALTER TABLE `fav_providers`
  MODIFY `id_favPro` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id_offer` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `service_providers`
--
ALTER TABLE `service_providers`
  MODIFY `id_provider` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`id_service`) REFERENCES `services` (`id_service`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `fav_offers`
--
ALTER TABLE `fav_offers`
  ADD CONSTRAINT `fav_offers_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fav_offers_ibfk_2` FOREIGN KEY (`id_offer`) REFERENCES `offers` (`id_offer`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `fav_providers`
--
ALTER TABLE `fav_providers`
  ADD CONSTRAINT `fav_providers_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fav_providers_ibfk_2` FOREIGN KEY (`id_provider`) REFERENCES `service_providers` (`id_provider`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `offers`
--
ALTER TABLE `offers`
  ADD CONSTRAINT `offers_ibfk_1` FOREIGN KEY (`id_provider`) REFERENCES `service_providers` (`id_provider`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `services_ibfk_2` FOREIGN KEY (`id_offer`) REFERENCES `offers` (`id_offer`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
