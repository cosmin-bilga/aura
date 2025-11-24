<?php

/**
 * METHODS: GET, OPTIONS
 * 
 * -- GET: RECUPERATION D'UNE LISTE DES SERVICES CORRESPONDANT AUX FILTRES
 * PARAMS : ?id_customer, ?id_offer, ?service_date, ?statut, ?amount, ?payement_date
 * AUTH: token matching id_customer OR admin token OR token matching id_provider
 * RETURN: array [... {id_service, id_customer, id_offer, service_date, statut, amount, payment_date, payment_method, payment_reference, created_at, updated_at}]	
 * 
 */
