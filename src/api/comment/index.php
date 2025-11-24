<?php

/**
 * METHODS: GET, POST, DELETE, OPTIONS
 * 
 * -- GET: RECUPERATION CONTENU COMMENT
 * PARAMS : id_comment
 * AUTH: none
 * RETURN: id_comment, id_service, notation, comment, comment_date 	
 * 
 * -- POST: MODIFICATION CONTENU COMMENT
 * PARAMS: id_comment, ?id_customer
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 * 
 * -- DELETE: SUPPRIMER COMMENT
 * PARAMS: id_comment
 * AUTH: token matching id_customer OR admin token
 * RETURN: message
 */
