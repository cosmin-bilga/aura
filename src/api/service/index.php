<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS SERVICE
 * PARAMS : id_service
 * AUTH: token matching id_customer OR admin token
 * RETURN: id_service, id_customer, id_offer, service_date, statut, amount, payment_date, payment_method, payment_reference, created_at, updated_at	
 * 
 * -- POST: MODIFICATION SERVICE
 * PARAMS: id_service, ?id_customer, ?id_offer, ?service_date, ?statut, ?amount, ?payment_date, ?payment_method, ?payment_reference
 * AUTH: admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER SERVICE
 * PARAMS: id_service
 * AUTH: admin token
 * RETURN: message
 */
