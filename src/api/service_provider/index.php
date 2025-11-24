<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DONNEES PRESTATAIRE
 * PARAMS : email OR id_provider
 * AUTH: token matching id_provider OR admin token
 * RETURN: id_provider, name, firstname, email, phone_number, address, profile_picture, education_experience, subscriber, sexe, SIREN, additional_information, created_at, updated_at, statut
 * 
 * -- POST: MODIFICATION DONNEES PRESTATAIRE
 * PARAMS: ?name, ?firstname, ?email, ?password, ?phone_number, ?address, ?profile_picture, ?education_experience, ?subscriber, ?sexe, ?SIREN, ?additional_information, ?statut
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER PRESTATARIE
 * PARAMS: id_provider OR email
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */
