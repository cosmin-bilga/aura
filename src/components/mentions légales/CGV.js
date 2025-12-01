/**
 * CGV - Conditions Générales de Vente
 * Aura Services - Services à domicile
 * Dernière mise à jour : 19 novembre 2025
 */

const donneesCGV = {
  derniereMiseAJour: "19 novembre 2025",
  
  entreprise: {
    nom: "Aura Services",
    formeJuridique: "SARL au capital de 5 000 €",
    adresse: "15 rue de la République, 78000 Versailles",
    siret: "123 456 789 00012",
    email: "Claude.Martin@auradev.fr",
    telephone: "01 47 25 30 16",
    tva: "FR12 123456789",
    siteWeb: "www.aura-services.fr",
    assurance: {
      compagnie: "Allianz France",
      numeroPolice: "123456789",
      couverture: "2 000 000 €"
    }
  },

  services: [
    {
      id: 1,
      categorie: "Massage et bien-être",
      elements: [
        "Massage relaxant",
        "Massage thérapeutique",
        "Réflexologie"
      ],
      durees: ["30 min", "1h", "1h30"]
    },
    {
      id: 2,
      categorie: "Coiffure à domicile",
      elements: [
        "Coupe homme, femme, enfant",
        "Coloration et mèches",
        "Coiffure pour événements",
        "Soins capillaires"
      ]
    },
    {
      id: 3,
      categorie: "Garde d'enfants",
      elements: [
        "Garde ponctuelle ou régulière",
        "Aide aux devoirs",
        "Activités éducatives et ludiques"
      ],
      trancheAge: "3 mois à 12 ans"
    },
    {
      id: 4,
      categorie: "Ménage et entretien",
      elements: [
        "Ménage courant (sols, surfaces, sanitaires)",
        "Repassage",
        "Nettoyage approfondi",
        "Entretien régulier ou ponctuel"
      ]
    }
  ],

  zonesIntervention: [
    "Versailles et agglomération",
    "Saint-Quentin-en-Yvelines",
    "Départements 78 et 92"
  ],

  tarifs: {
    massage: [
      { duree: "30 minutes", prix: 35 },
      { duree: "1 heure", prix: 60 },
      { duree: "1h30", prix: 85 }
    ],
    coiffure: [
      { service: "Coupe homme", prix: 30 },
      { service: "Coupe femme", prix: 40 },
      { service: "Coupe enfant", prix: 20 },
      { service: "Coloration (à partir de)", prix: 60 },
      { service: "Coiffure événement", prix: 80 }
    ],
    gardeEnfants: {
      tarifHoraire: 15,
      heuresMinimum: 2,
      majorationSoiree: 3, // après 20h
      majorationDimancheFerie: 5
    },
    menage: {
      tarifHoraire: 25,
      forfait3h: 70,
      forfait5h: 110,
      repassageSeul: 20
    },
    fraisDeplacement: {
      rayonGratuit: 10, // km
      tarifKmSupplementaire: 0.50
    }
  },

  moyensPaiement: [
    "Espèces",
    "Chèque (à l'ordre d'Aura Services)",
    "Carte bancaire (sur place ou en ligne)",
    "Virement bancaire",
    "CESU (Chèque Emploi Service Universel)"
  ],

  horaires: {
    semaine: "Lundi au samedi : 8h - 20h",
    dimanche: "Dimanche : 9h - 18h (avec majoration)",
    serviceClient: {
      semaine: "Lundi au vendredi : 9h - 18h",
      samedi: "Samedi : 9h - 13h"
    }
  },

  politiqueAnnulation: {
    plusDe24h: { taux: 0, description: "Annulation gratuite" },
    entre24hEt12h: { taux: 50, description: "Facturation de 50%" },
    moinsDe12h: { taux: 100, description: "Facturation de 100%" },
    absenceClient: { taux: 100, description: "Facturation de 100%" }
  },

  mediation: {
    nom: "Association des Médiateurs Européens (AME CONSO)",
    adresse: "11 Place Dauphine - 75001 Paris",
    siteWeb: "www.mediationconso-ame.com"
  },

  creditImpot: {
    eligible: true,
    taux: 50,
    description: "Certains services ouvrent droit à un crédit d'impôt de 50% (garde d'enfants, ménage)"
  }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = donneesCGV;
}

// Fonctions utilitaires
const aidesCGV = {
  /**
   * Obtenir le prix d'un service de massage
   */
  obtenirPrixMassage(duree) {
    const massage = donneesCGV.tarifs.massage.find(m => m.duree === duree);
    return massage ? massage.prix : null;
  },

  /**
   * Calculer le prix de garde d'enfants avec majorations
   */
  calculerPrixGardeEnfants(heures, estSoiree = false, estDimancheFerie = false) {
    let tarif = donneesCGV.tarifs.gardeEnfants.tarifHoraire;
    
    if (estSoiree) tarif += donneesCGV.tarifs.gardeEnfants.majorationSoiree;
    if (estDimancheFerie) tarif += donneesCGV.tarifs.gardeEnfants.majorationDimancheFerie;
    
    return heures * tarif;
  },

  /**
   * Calculer les frais de déplacement
   */
  calculerFraisDeplacement(distance) {
    const rayonGratuit = donneesCGV.tarifs.fraisDeplacement.rayonGratuit;
    if (distance <= rayonGratuit) return 0;
    
    const kmSupplementaires = distance - rayonGratuit;
    return kmSupplementaires * donneesCGV.tarifs.fraisDeplacement.tarifKmSupplementaire;
  },

  /**
   * Obtenir le taux d'annulation selon le délai
   */
  obtenirTauxAnnulation(heuresAvantService) {
    if (heuresAvantService > 24) return donneesCGV.politiqueAnnulation.plusDe24h.taux;
    if (heuresAvantService >= 12) return donneesCGV.politiqueAnnulation.entre24hEt12h.taux;
    return donneesCGV.politiqueAnnulation.moinsDe12h.taux;
  },

  /**
   * Formater le numéro de téléphone
   */
  formaterTelephone(telephone) {
    return telephone.replace(/(\d{2})(?=\d)/g, '$1 ');
  },

  /**
   * Vérifier si un service est éligible au crédit d'impôt
   */
  estEligibleCreditImpot(categorieService) {
    const servicesEligibles = ["Garde d'enfants", "Ménage et entretien"];
    return servicesEligibles.includes(categorieService);
  }
};

// Export des aides
if (typeof module !== 'undefined' && module.exports) {
  module.exports.aides = aidesCGV;
}

// Exemple d'utilisation
console.log("=== AURA SERVICES - CGV ===");
console.log(`Entreprise: ${donneesCGV.entreprise.nom}`);
console.log(`Email: ${donneesCGV.entreprise.email}`);
console.log(`Téléphone: ${aidesCGV.formaterTelephone(donneesCGV.entreprise.telephone)}`);
console.log("\n=== TARIFS MASSAGE ===");
donneesCGV.tarifs.massage.forEach(m => {
  console.log(`${m.duree}: ${m.prix}€`);
});
console.log("\n=== EXEMPLES DE CALCULS ===");
console.log(`Garde d'enfants 3h en soirée dimanche: ${aidesCGV.calculerPrixGardeEnfants(3, true, true)}€`);
console.log(`Déplacement 15km: ${aidesCGV.calculerFraisDeplacement(15)}€`);
console.log(`Annulation 18h avant: ${aidesCGV.obtenirTauxAnnulation(18)}% facturé`);