-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 21 nov. 2025 à 08:58
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

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

CREATE TABLE `services` (
  `id_service` int UNSIGNED NOT NULL,
  `id_customer` int UNSIGNED NOT NULL,
  `id_offer` int UNSIGNED NOT NULL,
  `service_date` datetime NOT NULL,
  `statut` enum('en_attente','validé','effectué','payé','annulé') NOT NULL DEFAULT 'en_attente',
  `amount` decimal(10,2) NOT NULL,
  `payment_date` datetime DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_reference` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `statut` enum('EI','Micro-entreprise','EURL','SASU','SARL','SAS') NOT NULL DEFAULT 'Micro-entreprise'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  MODIFY `id_customer` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fav_offers`
--
ALTER TABLE `fav_offers`
  MODIFY `id_favOffer` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `fav_providers`
--
ALTER TABLE `fav_providers`
  MODIFY `id_favPro` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `offers`
--
ALTER TABLE `offers`
  MODIFY `id_offer` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `services`
--
ALTER TABLE `services`
  MODIFY `id_service` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `service_providers`
--
ALTER TABLE `service_providers`
  MODIFY `id_provider` int UNSIGNED NOT NULL AUTO_INCREMENT;

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
