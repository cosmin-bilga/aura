/**
 * CGU - Conditions Générales d'Utilisation
 * Site Aura - Services à domicile
 * Dernière mise à jour : 19 novembre 2025
 */

const donneesCGU = {
  derniereMiseAJour: "19 novembre 2025",
  dateEntreeVigueur: "19 novembre 2025",
  
  editeur: {
    nom: "Aura",
    formeJuridique: "SARL au capital de 5 000 €",
    siegeSocial: "15 rue de la République, 78000 Versailles",
    siret: "123 456 789 00012",
    email: "Claude.Martin@auradev.fr",
    telephone: "01 47 25 30 16",
    siteWeb: "www.aura-services.fr",
    directeurPublication: "Claude Martin"
  },

  hebergeur: {
    nom: "La Plateforme",
    adresse: "8 rue d'Hozier, 13002 Marseille"
  },

  accesSite: {
    gratuit: true,
    description: "Le Site est accessible gratuitement à tout utilisateur disposant d'un accès Internet",
    fraisCharge: "Tous les frais liés à l'accès au Site (matériel informatique, connexion Internet, etc.) sont à la charge de l'utilisateur"
  },

  interdictions: [
    "Utiliser le Site à des fins illégales ou frauduleuses",
    "Tenter d'accéder aux zones non publiques du Site",
    "Diffuser des contenus illicites, diffamatoires ou contraires aux bonnes mœurs",
    "Perturber le fonctionnement du Site ou porter atteinte à sa sécurité",
    "Copier, reproduire ou exploiter commercialement les contenus du Site sans autorisation"
  ],

  proprieteIntellectuelle: {
    description: "L'ensemble des contenus présents sur le Site (textes, images, logos, graphismes, vidéos, etc.) est protégé par le droit de la propriété intellectuelle",
    proprietaire: "Aura ou ses partenaires",
    autorisationNecessaire: true,
    usagePersonnelAutorise: true
  },

  donneesPersonnelles: {
    conformite: ["RGPD", "Loi Informatique et Libertés"],
    
    donneesCollectees: [
      "Nom et prénom",
      "Adresse email et numéro de téléphone",
      "Adresse postale",
      "Informations relatives aux réservations de services"
    ],

    finalites: [
      "Traiter les demandes de services",
      "Gérer la relation client",
      "Améliorer les services proposés",
      "Envoyer des communications marketing (avec consentement)"
    ],

    droitsUtilisateurs: [
      {
        droit: "Accès",
        description: "Droit d'accès aux données personnelles"
      },
      {
        droit: "Rectification",
        description: "Droit de rectification et de suppression"
      },
      {
        droit: "Portabilité",
        description: "Droit à la portabilité des données"
      },
      {
        droit: "Opposition",
        description: "Droit d'opposition au traitement"
      },
      {
        droit: "Limitation",
        description: "Droit à la limitation du traitement"
      }
    ],

    contactExerciceDroits: "Claude.Martin@auradev.fr",
    
    conservation: "Les données personnelles sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées, et conformément aux obligations légales"
  },

  cookies: {
    utilisation: true,
    description: "Le Site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic",
    
    typesCookies: [
      {
        type: "Cookies essentiels",
        description: "Nécessaires au fonctionnement du Site",
        obligatoire: true
      },
      {
        type: "Cookies analytiques",
        description: "Pour mesurer l'audience (Google Analytics)",
        obligatoire: false
      },
      {
        type: "Cookies de personnalisation",
        description: "Pour mémoriser vos préférences",
        obligatoire: false
      }
    ],

    desactivation: {
      possible: true,
      consequence: "Cela peut limiter certaines fonctionnalités du Site"
    }
  },

  liensHypertextes: {
    presenceLiensTiers: true,
    responsabilite: "Aura n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu"
  },

  responsabilite: {
    disponibiliteSite: {
      objectif: "Assurer la disponibilité du Site 24h/24 et 7j/7",
      garantie: false,
      raisonInterruption: [
        "Maintenance",
        "Mise à jour",
        "Motifs techniques"
      ]
    },

    exactitudeInformations: {
      effortsRealises: true,
      garantieAbsolue: false,
      description: "Des erreurs ou omissions peuvent survenir"
    },

    limitationsResponsabilite: [
      "Dommages résultant d'une interruption du Site",
      "Utilisation frauduleuse du Site par un tiers",
      "Virus ou programmes malveillants transmis via le Site"
    ]
  },

  modificationsCGU: {
    possible: true,
    entreVigueur: "Dès leur publication sur le Site",
    recommandation: "L'utilisateur est invité à consulter régulièrement cette page"
  },

  droitApplicable: {
    pays: "France",
    juridiction: "Tribunaux français",
    resolutionAmiable: true
  },

  contact: {
    email: "Claude.Martin@auradev.fr",
    telephone: "01 47 25 30 16",
    adresse: "15 rue de la République, 78000 Versailles"
  }
};

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = donneesCGU;
}

// Fonctions utilitaires
const aidesCGU = {
  /**
   * Vérifier si un cookie est obligatoire
   */
  estCookieObligatoire(typeCookie) {
    const cookie = donneesCGU.cookies.typesCookies.find(c => c.type === typeCookie);
    return cookie ? cookie.obligatoire : false;
  },

  /**
   * Obtenir la liste des droits RGPD
   */
  obtenirDroitsRGPD() {
    return donneesCGU.donneesPersonnelles.droitsUtilisateurs.map(d => d.droit);
  },

  /**
   * Obtenir les informations de contact pour exercer les droits RGPD
   */
  obtenirContactRGPD() {
    return {
      email: donneesCGU.donneesPersonnelles.contactExerciceDroits,
      telephone: donneesCGU.contact.telephone,
      adresse: donneesCGU.contact.adresse
    };
  },

  /**
   * Vérifier si une action est interdite
   */
  estActionInterdite(action) {
    return donneesCGU.interdictions.some(interdit => 
      interdit.toLowerCase().includes(action.toLowerCase())
    );
  },

  /**
   * Obtenir les raisons possibles d'interruption du site
   */
  obtenirRaisonsInterruption() {
    return donneesCGU.responsabilite.disponibiliteSite.raisonInterruption;
  },

  /**
   * Formater le numéro de téléphone
   */
  formaterTelephone(telephone) {
    return telephone.replace(/(\d{2})(?=\d)/g, '$1 ');
  },

  /**
   * Obtenir toutes les données personnelles collectées
   */
  obtenirDonneesCollectees() {
    return donneesCGU.donneesPersonnelles.donneesCollectees;
  },

  /**
   * Obtenir les finalités de collecte des données
   */
  obtenirFinalitesCollecte() {
    return donneesCGU.donneesPersonnelles.finalites;
  },

  /**
   * Vérifier si le site nécessite un consentement pour les cookies
   */
  necessiteConsentementCookies() {
    return donneesCGU.cookies.typesCookies.some(c => !c.obligatoire);
  }
};

// Export des aides
if (typeof module !== 'undefined' && module.exports) {
  module.exports.aides = aidesCGU;
}

// Exemple d'utilisation
console.log("=== AURA SERVICES - CGU ===");
console.log(`Éditeur: ${donneesCGU.editeur.nom}`);
console.log(`Directeur de publication: ${donneesCGU.editeur.directeurPublication}`);
console.log(`Email: ${donneesCGU.editeur.email}`);
console.log(`Téléphone: ${aidesCGU.formaterTelephone(donneesCGU.editeur.telephone)}`);
console.log("\n=== HÉBERGEUR ===");
console.log(`${donneesCGU.hebergeur.nom} - ${donneesCGU.hebergeur.adresse}`);
console.log("\n=== DONNÉES COLLECTÉES ===");
donneesCGU.donneesPersonnelles.donneesCollectees.forEach(donnee => {
  console.log(`- ${donnee}`);
});
console.log("\n=== DROITS RGPD ===");
aidesCGU.obtenirDroitsRGPD().forEach(droit => {
  console.log(`- ${droit}`);
});
console.log("\n=== COOKIES ===");
console.log(`Cookies essentiels obligatoires: ${aidesCGU.estCookieObligatoire("Cookies essentiels")}`);
console.log(`Consentement nécessaire: ${aidesCGU.necessiteConsentementCookies()}`);