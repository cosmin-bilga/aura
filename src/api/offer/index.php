<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION DETAILS OFFRE
 * PARAMS : id_offer
 * AUTH: none
 * RETURN: id_offer, description, duration, category, disponibility, perimeter_of_displacement, price, id_provider, created_at, updated_at 	
 * 
 * -- POST: MODIFICATION OFFRE
 * PARAMS: id_offer, ?description, ?duration, ?category, ?disponibility, ?perimeter_of_displacement, ?price
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER OFFRE
 * PARAMS: id_offer
 * AUTH: token matching id_provider OR admin token
 * RETURN: message
 */
